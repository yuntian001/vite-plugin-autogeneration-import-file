# vite-plugin-autogeneration-import-file
Vite automatically generates import file plug-ins.

Support vite2 and vite3.

## 中文文档: [README-zh-cn.md](./README-zh-cn.md).

## Fast Start
1. Install
   `npm i vite-plugin-autogeneration-import-file -D`
2. Example 
```
//vite.config.js
import { defineConfig } from 'vite';
import { getName, createPlugin } from 'vite-plugin-autogeneration-import-file';
const { autoImport } = createPlugin();
export default defineConfig({
    root:'./index.html',
    plugins: [autoImport([
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

## Automatically import components/directives use with "unplugin-vue-components"
```
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite'
import { getName, createPlugin } from 'vite-plugin-autogeneration-import-file';
const { autoImport, resolver } = createPlugin();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    autoImport([
    {
      pattern: ['**/{index.vue,index.ts,index.js}', '*.{vue,ts,js}'],
      dir: './src/components',
      toFile: './components1.d.ts',
      template: `
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    //import code
  }
}`,
      name: '_{{name}}',
      codeTemplates: [
        { key: '//import code', template: '{{name}}: typeof import("{{path}}")["default"]\n    ' },
      ]
    },
    {
      pattern: ['**/*.{ts,js}', '*.{ts,js}'],
      dir: './src/store/modules',
      toFile: './src/store/module.ts',
      name: (name) => {
        name = getName(name);
        return name[0].toUpperCase() + name.slice(1) + 'Store';
      }
    },
    {
      pattern: ['**/{index.vue,index.ts,index.js}', '*.{vue,ts,js}'],
      dir: './src/myComponents',
      toFile: './myComponents.d.ts',
      template: `
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    //import code
  }
}`,
      name: '_{{name}}',
      codeTemplates: [
        { key: '//import code', template: '{{name}}: typeof import("{{path}}")["default"]\n    ' },
      ]
    },
    {
      pattern: ['**/{index.vue,index.ts,index.js}', '*.{vue,ts,js}'],
      dir: './src/myDirective',
      toFile: './myDirective.d.ts',
      template: `
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    //import code
  }
}`,
      name: 'V_{{name}}',
      codeTemplates: [
        { key: '//import code', template: '{{name}}: typeof import("{{path}}")["default"]\n    ' },
      ]
    }
  ]),Components({dirs:[],  dts: false,resolvers:[resolver([0,2],[3])]})]
})

```
### resolver type
 ```
 resolver(componentInclude: number[], directiveInclude?: number[]): any[]
 ```
 'componentInclude' is the index of the component schema to be imported(dirOptions index)

 'directiveInclude' is the index of the directive schema to be imported(dirOptions index)
 
'unplugin-vue-components' will dynamically import components/directives in the 'vite-plugin-autogeneration-import-file' mode of the corresponding index entry

