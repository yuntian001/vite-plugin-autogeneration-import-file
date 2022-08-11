import a from "../components/a.vue"
import b from "../components/b.vue"
import cdd from "../components/cdd/Index.vue"
//import code
declare module "@vue/runtime-core" {
    interface GlobalComponents {
        a:typeof a
        b:typeof b
        cdd:typeof cdd
        //key code
    }
}
export {};