

## [3.0.0](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.1.0...3.0.0) (2022-10-25)

### 新功能[feat]

* 修改改为函数生成，支持多vite同时引入 ([21079df](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/21079df818e7f63c9ad44fdd3596b5f224c3b596))

## [2.1.2](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.1.0...3.0.0) (2022-10-25)


### Bug 修复[fix]

* 修复多次监听同一文件夹重命名问题 ([5ee331e](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/5ee331ef7ffa1271bcd7a74b8ba65d020fbf1ce7))
* 修复文件重命名多次重复插入问题 ([570af17](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/570af17a9a98b4b1362b2133825d106234c66902))

## [2.1.0](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.0.6...2.1.0) (2022-08-12)


### 新功能[feat]

* 不再跟据vite2和vite3区分版本，module和commonjs共用同一引入方式 ([9325ec3](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/9325ec326e3fc31a6f7de2bdfc58c11946dec6c5))
* 加上unplugin-vue-components自动引入支持 ([1fabf99](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/1fabf99aadad2b9df992c6cbf5eb506318812cf5))

### [2.0.9](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.0.8...2.0.9) (2022-07-14)


### 文档更改[docs]

* 加上英文文档、引入demo错误修复 ([ed57d51](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/ed57d51957e0a6047b5d4f462eb421bec85c25e7))

### [2.0.8](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.0.7...2.0.8) (2022-07-11)


### Bug 修复[fix]

* 修复ts 不提示的错误 ([b727792](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/b727792c16485a8a2ebf7c4142fc7e48577c0a9b))

### [2.0.7](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/compare/2.0.6...2.0.7) (2022-07-11)


### 其他[chore]

* bootstrap releases for path: . ([344f908](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/344f9089177864061d22cd3834228010e041b6a8))


### 性能改进[perf]

* 优化发版流程 ([02be0f7](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/02be0f7f2b3d6ececa3b55ed25cbae9d34ad2771))


### Bug 修复[fix]

* 修复toFile 不存在时不自动创建的bug ([a3b3256](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/a3b32563703925dfd31341ba633706fdb0ab06ca))

### 2.0.6 (2022-07-10)


### 功能

* 根据配置自动生成import文件

### 重构

*  基于vite3.0.0 ([2e5d3cd](https://github.com/yuntian001/vite-plugin-autogeneration-import-file/commit/2e5d3cd6ff4611108654f4898a6fb1319e848890))