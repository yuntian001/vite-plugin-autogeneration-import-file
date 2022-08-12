
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    HelloWorld: typeof import("./src/components/HelloWorld.vue")["default"]
    //import code
  }
}