# vite-plugin-autogeneration-import-file
vite 自动生成 引入文件插件

支持vite2 和 vite^3.0.0-beta

## 快速开始
1. 安装
   
    `npm i vite-plugin-autogeneration-import-file -D`
2. vite.config.js中使用
   
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
   
## 插件配置说明(dirOptions)
```
interface codeTemplate { //代码模板
    key: string, //标识符 
    template: string,//模板 codeTemplate.template里的{{name}}会被替换为name {{path}}会被替换为被导入的相对路径
    value?: string //根据模板自动生成，不可传入
}
type dirOptions = { //插件配置
    dir: string,//遍历路径
    toFile: string,//写入目标文件地址
    pattern: fg.Pattern | fg.Pattern[],//匹配规则 参考 fast-glob
    options?: fg.Options,//fast-glob 匹配参数
    name?: string | ((fileName:string)=>string),//名称 当为字符串时里面的{{name}}会被替换为格式化后的驼峰名称, 默认值为："{{name}}"
    codeTemplates?: codeTemplate[] //代码模板 默认值为："[{key: '//code',template: 'export { default as {{name}} } from "{{path}}"\n'}]"
    template?: string//文件模板 会递归循环codeTemplates把template里的codeTemplate.key替换为对应的codeTemplate.value 默认值为："当前文件由vite-plugin-autogeneration-import-file自动生成\n//code"
}[]
``` 

## 用 "unplugin-vue-components" 自动引入组件/指令
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
### resolver 类型
 ```
 resolver(componentInclude: number[], directiveInclude?: number[]): any[]
 ```
 componentInclude 为需要导入的组件模式的索引(dirOptions的index)
 
 directiveInclude 为需要导入的指令模式的索引(dirOptions的index)

 unplugin-vue-components 会按对应索引项的`vite-plugin-autogeneration-import-file`模式去动态引入组件/指令

