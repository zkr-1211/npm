const { watchFn } = require('./watchFn')
// 监听文件上传部署
async function watchDeploy(config) {
  watchFn(config, 1)
}
module.exports = {
  watchDeploy
}
