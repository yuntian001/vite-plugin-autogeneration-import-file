import a from "../components/a.vue"
import b from "../components/b.vue"
import adavs from "../components/adavs/Index.vue"
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