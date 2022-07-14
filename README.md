# vite-plugin-autogeneration-import-file
Vite automatically generates import file plug-ins.

Support vite2 and vite^3.0.0-beta.

## 中文文档: [README-zh-cn.md](./README-zh-cn.md).

## Fast Start
1. Install
  - vite2:
   `npm i vite-plugin-autogeneration-import-file@">=1.0.0 < 2.0.0" -D`

  - vite3:
  `npm i vite-plugin-autogeneration-import-file@">=2.0.0 < 3.0.0" -D`

2. Example 
    
```
//vite.config.js
import {default as autogenerationImportFile,getName} from 'vite-plugin-autogeneration-import-file';
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
   
## Configuration Description(dirOptions)
```
interface codeTemplate { //Code Templates
    key: string, //tag 
    template: string,//template. {{name}} in codetemplate, template will be replaced by name. {{path}} which will be replaced by the relative path to be imported.
    value?: string //It is automatically generated based on the template and cannot be imported
}
type dirOptions = { //Plugin config
    dir: string,//The path to traverse
    toFile: string,//write the destination file address
    pattern: fg.Pattern | fg.Pattern[],//For the matching rule, see `fast-glob`.
    options?: fg.Options,//`fast-glob` matching parameter.
    name?: string | ((fileName:string)=>string),//Name. `{{name}}` is replaced with a formatted hump name when it is a string. Default: "{{name}}"
    codeTemplates?: codeTemplate[] //The code template. defaults:"[{key: '//code',template: 'export { default as {{name}} } from "{{path}}"\n'}]"
    template?: string//File Template. `codeTemplate.key` is replaced by codeTemplate.value recursively by `codeTemplate.value`. default:"当前文件由vite-plugin-autogeneration-import-file自动生成\n//code"
}[]
``` 

