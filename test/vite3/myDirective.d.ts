
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    VFocus: typeof import("./src/myDirective/focus")["default"]
    //import code
  }
}