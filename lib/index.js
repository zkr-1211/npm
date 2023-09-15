const { deploy } = require('./deploy')
const { deployBackup } = require('./deployBackup')
const { watchDeploy } = require('./watchDeploy')
const { watchDeployBackup } = require('./watchDeployBackup')
const { rollback } = require('./rollback')

module.exports = {
  deploy,
  deployBackup,
  watchDeploy,
  watchDeployBackup,
  rollback
}
