
import '@vue/runtime-core'
export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    TestA: typeof import("./src/myComponents/test-a.vue")["default"]
    Test: typeof import("./src/myComponents/test.vue")["default"]
    TestB: typeof import("./src/myComponents/test_b.vue")["default"]
    TestDir: typeof import("./src/myComponents/test/dir/index.vue")["default"]
    //import code
  }
}