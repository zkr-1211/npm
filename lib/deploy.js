const { sftp } = require('./connect')
// 上传部署
async function deploy(config) {
  try {
    // 连接SFTP服务器
    await sftp.connect(config.sftpConfig)
    console.log(`=====start===${new Date().toLocaleString()}===`)
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
  deploy
}
