import b from "../components/b.vue"
import adavs from "../components/adavs/Index.vue"
import a from "../components/a.vue"
//import code
declare module "@vue/runtime-core" {
    interface GlobalComponents {
        b:typeof b
        adavs:typeof adavs
        a:typeof a
        //key code
    }
}
export {};