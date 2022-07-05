# vite-plugin-autogeneration-import-file
vite 自动生成 引入文件插件

## 快速开始
1. 安装
  
   `npm i vite-plugin-autogeneration-import-file -D`
2. vite.config.js中使用
    
```
import {default as autogenerationImportFile,getName} from '../dist/index.js';
import { defineConfig } from 'vite'
export default defineConfig({
    root:'./index.html',
    plugins: [autogenerationImportFile([
        {
            pattern:['**/*.{ts,js}','*.{ts,js}'],
            dir:'test/store/modules',
            toFile:'test/store/module.ts',
            name:(name)=>{
              name = getName(name);
              return name[0].toUpperCase()+name.slice(1)+'Store';
            }
          },
          {
            pattern:['**/{Index.vue,index.ts,index.js}','*.{vue,ts,js}'],
            dir:'test/components',
            toFile:'test/types/components.d.ts',
            template:'//import code\ndeclare module "@vue/runtime-core" {\n    interface GlobalComponents {\n        //key code\n    }\n}\nexport {};',
            codeTemplates:[
              {key:'//import code\n',template:'import {{name}} from "{{path}}"\n'},
              {key:'        //key code\n',template:'        {{name}}:typeof {{name}}\n'},
            ]
          }
    ])]
});
```
   
## 插件配置说明(dirOptions)
```
interface codeTemplate { //代码模板
    key: string, //标识符 
    template: string,//模板 codeTemplate.template里的{{name}}会被替换为name
    value?: string //根据模板自动生成，不可传入
}
type dirOptions = { //插件配置
    dir: string,//遍历路径
    toFile: string,//写入目标文件地址
    pattern: fg.Pattern | fg.Pattern[],//匹配规则 参考 fast-glob
    options?: fg.Options,//fast-glob 匹配参数
    name?: string | ((fileName:string)=>string),//名称 当为字符串时里面的{{name}}会被替换为格式化后的驼峰名称, 默认值为："{{name}}"
    codeTemplates?: codeTemplate[] //代码模板 默认值为："[{key: '//code',template: 'export { default as {{name}} } from "{{path}}"\n'}]"
    template?: string//文件模板 会递归循环codeTemplates把template里的codeTemplate.key替换为对应的codeTemplate.value 默认值为："//当前文件自动生成，不要自行更改\n//code"
}[]
``` 

