const { sftp } = require('./connect')
const { backup } = require('./backup')
// 上传部署并备份
async function deployBackup(config) {
  try {
    // 连接SFTP服务器
    await sftp.connect(config.sftpConfig)
    // 备份文件夹路径
    console.log(`=====start===${new Date().toLocaleString()}===`)
    await backup(sftp, config)
    // 将整个文件夹上传到远端
    await sftp.uploadDir(config.uploadFile, config.remotePath)
    console.log(`=====部署成功=====`)
    console.log(`=====end===${new Date().toLocaleString()}===`)
  } catch (error) {
    console.log(`=====报错===${new Date().toLocaleString()}===`, error.message)
  } finally {
    sftp.end()
  }
}
module.exports = {
  deployBackup
}
