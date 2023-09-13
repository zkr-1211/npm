const { sftp } = require('./connect')
// 上传部署
async function deploy(config) {
  try {
    // 连接SFTP服务器
    await sftp.connect(config.sftpConfig)
    console.log('=====start=====')
    // 将整个文件夹上传到远端
    await sftp.uploadDir(config.uploadFile, config.remotePath)
    console.log('=====部署成功=====')
    console.log('=====end=====')
  } catch (error) {
    console.error('报错===', error.message)
  } finally {
    sftp.end()
  }
}
module.exports = {
  deploy
}
