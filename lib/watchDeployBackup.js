const { deployBackup } = require('./deployBackup')
const { watchFn } = require('./watchFn')
// 监听文件上传部署并备份
async function watchDeployBackup(config) {
  watchFn(config, deployBackup)
}
module.exports = {
  watchDeployBackup
}
