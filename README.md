# light-vue3
实现一个轻量级的vue3

# 使用说明
- 切换到特定的分支在packages文件夹下找到对应模块，dist 中有测试文件和对src文件的打包文件，src 是代码的实现过程
- 例如：学习 reactivie 就 git checkout reactivity-reactive 分支，到 /packages/reactivity 下查看对应的实现过程

# 分支
- init 项目初始化
- reactivity 响应式模块
  - reactive 实现 reactive
  - effect 实现 effect
- runtime-core 运行时核心模块
  - h 实现 h 函数