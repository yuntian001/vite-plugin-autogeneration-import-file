import fg from 'fast-glob';
import micromatch from 'micromatch';
import * as fs from 'fs';
import * as path from "path";
import { normalizePath } from 'vite';
let isServer = false;
let loadFiles: string[] = [];
let tmpRemoves: string[] = [];
//path转驼峰变量名并剔除最后的index/Index
export const getName = function (fileName: string, nameTemplate = '{{name}}'): string {
    const index = fileName.lastIndexOf('.');
    if (index > 0) {
        fileName = fileName.slice(0, index);
    }
    let fileNameArr = nameTemplate.replace(/\{\{name\}}/g, fileName.replace(/\\/g, '/')).replace(/\//g, '_').split('_');
    if (fileNameArr[fileNameArr.length - 1] == 'index' || fileNameArr[fileNameArr.length - 1] == 'Index') {
        fileNameArr.pop();
    }
    for (let i = 1, len = fileNameArr.length; i < len; i++) {
        fileNameArr[i] = fileNameArr[i].slice(0, 1).toUpperCase() + fileNameArr[i].slice(1)
    }
    return fileNameArr.join('');
}

interface codeTemplate {
    key: string, //标识符 
    template: string,//模板 codeTemplate.template里的{{name}}会被替换为name
    value?: string //根据模板自动生成，不可传入
}
type dirOptions = {
    dir: string,//遍历路径
    toFile: string,//写入目标文件地址
    pattern: fg.Pattern | fg.Pattern[],//匹配规则 参考 fast-glob
    options?: fg.Options,//fast-glob 匹配参数
    name?: string | ((fileName: string) => string),//名称 当为字符串时里面的{{name}}会被替换为格式化后的驼峰名称,
    nameFunction?: (name: string) => string //自定义名称函数
    codeTemplates?: codeTemplate[] //代码模板
    template?: string//文件模板 会递归循环codeTemplates把template里的codeTemplate.key替换为对应的codeTemplate.value
}[]


//获取导入文件地址
const getFileImportName = function (dir: string, fileName: string): string {
    fileName = path.resolve(dir, fileName);
    if (fileName.endsWith('.ts')) {
        fileName = fileName.slice(0, -3);
    }
    return normalizePath(fileName);
}

//获取导入文件代码
const getCode = function (dir: string,
    fileName: string = '',
    name: string | ((name: string) => string) = undefined,
    codeTemplates: codeTemplate[] = []): codeTemplate[] {
    const filePath = getFileImportName(dir, fileName);
    if (typeof name == 'function') {
        fileName = name(getName(fileName));

    } else {
        fileName = getName(fileName, name);
    }

    let codeTemplate: codeTemplate[] = JSON.parse(JSON.stringify(codeTemplates));
    if (!codeTemplate.length) {
        codeTemplate.push({
            key: '//code',
            template: 'export { default as {{name}} } from "{{path}}"\n',
        })
    }
    codeTemplate.forEach((item) => {
        item.value = item.template.replace(/\{\{name\}\}/g, fileName).replace(new RegExp('\{\{path\}\}', 'g'), filePath);
    })
    return codeTemplate;
}

const loadPath = async function (dir: string,
    toFile: string = '',
    pattern: fg.Pattern | fg.Pattern[],
    options: fg.Options,
    name: string | ((name: string) => string) = undefined,
    template: string = '',
    codeTemplates: codeTemplate[] = []) {
    const entries = await fg(pattern, Object.assign({ cwd: dir, dot: true }, options));
    let str = template ? template : '//当前文件自动生成，不要自行更改\n//code';
    entries.forEach((fileName: string) => {
        if (isServer) {
            loadFiles.push(fileName);
        }
        getCode(dir, fileName, name, codeTemplates).forEach((item) => {
            str = str.replace(item.key, item.value + item.key);
        });
    });
    str && fs.writeFileSync(toFile, str);
    console.log(`mk ${toFile} success\n`)
}


export default function loadPathsPlugin(dirOptions: dirOptions) {
    return {
        name: 'load-path-ts',
        async buildStart() {
            let proArr: Promise<unknown>[] = [];
            dirOptions.forEach(item => {
                proArr.push(loadPath(item.dir, item.toFile, item.pattern, item.options || {}, item.name, item.template, item.codeTemplates));
            })
            await Promise.allSettled(proArr);
        },
        configureServer() {//服务器启动时被调用
            dirOptions.forEach(item => {
                isServer = true;
                fs.watch(item.dir, { recursive: true },
                    function (eventType: fs.WatchEventType, fileName: string) {
                        if (eventType === 'rename') {
                            let str = fs.readFileSync(item.toFile, 'utf8');
                            let filePath = path.resolve(item.dir, fileName);
                            if (fs.existsSync(filePath)) {//存在
                                let stat = fs.lstatSync(filePath);
                                let changeFiles: string[] = [];
                                let prefix = '';
                                if (stat.isFile()) {
                                    if (micromatch.isMatch(fileName, item.pattern)) {
                                        changeFiles = [fileName];
                                    }
                                } else if (tmpRemoves.length && fs.existsSync(path.resolve(filePath, tmpRemoves[0]))) {
                                    //如果是重命名文件夹
                                    changeFiles = tmpRemoves;
                                    prefix = fileName + '/';
                                }
                                changeFiles.forEach(fileName => {
                                    const code = getCode(item.dir, prefix + fileName, item.name, item.codeTemplates);
                                    code.forEach((codeItem) => {
                                        str = str.replace(codeItem.key, codeItem.value + codeItem.key);
                                    });
                                    loadFiles.push(prefix + fileName);
                                })
                                if (changeFiles.length) {
                                    fs.writeFileSync(item.toFile, str);
                                    console.log(item.toFile + ' add code');
                                }
                                tmpRemoves = [];
                            } else {//不存在文件
                                let changeFiles = loadFiles.filter(name => name.startsWith(fileName + '/') || name == fileName);
                                changeFiles.forEach(fileName => {
                                    const code = getCode(item.dir, fileName, item.name, item.codeTemplates);
                                    code.forEach((codeItem) => {
                                        str = str.replace(codeItem.value, '');
                                    });
                                    loadFiles.slice(loadFiles.indexOf(fileName), 1);
                                });
                                if (changeFiles.length) {
                                    fs.writeFileSync(item.toFile, str);
                                    if (changeFiles[0] !== fileName) {
                                        tmpRemoves = changeFiles.map(name => name.slice(fileName.length + 1));
                                    } else {
                                        tmpRemoves = [];
                                    }
                                    console.log(item.toFile + ' remove code');
                                }

                            }
                        }
                    });
            })

        },
    }
}