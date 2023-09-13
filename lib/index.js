// 主入
const { deploy } = require('./deploy');
const { autoDeploy } = require('./autoDeploy');
const { autoDeployBackup } = require('./autoDeployBackup');
const { rollback } = require('./rollback');

module.exports = {
  deploy,
  autoDeploy,
  autoDeployBackup,
  rollback
}