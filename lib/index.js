// 主入
const { deploy } = require('./deploy');
const { deployBackup } = require('./deployBackup');
const { rollback } = require('./rollback');

module.exports = {
  deploy,
  deployBackup,
  rollback
}