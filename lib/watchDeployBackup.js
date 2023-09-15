const { watchFn } = require('./watchFn')
// 监听文件上传部署并备份
async function watchDeployBackup(config) {
  watchFn(config, 2)
}
module.exports = {
  watchDeployBackup
}
