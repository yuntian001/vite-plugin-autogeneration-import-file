import a from "D:/my/vite-plugin-autogeneration-import-file/test/components/a.vue"
import b from "D:/my/vite-plugin-autogeneration-import-file/test/components/b.vue"
import adavs from "D:/my/vite-plugin-autogeneration-import-file/test/components/adavs/Index.vue"
//import code
declare module "@vue/runtime-core" {
    interface GlobalComponents {
        a:typeof a
        b:typeof b
        adavs:typeof adavs
        //key code
    }
}
export {};