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