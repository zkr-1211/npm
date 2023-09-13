const { sftp } = require('./connect')
const chokidar = require("chokidar");
// 自动上传部署
async function autoDeploy(config) {
  const upload = async () => {
    try {
      // 连接SFTP服务器
      await sftp.connect(config.sftpConfig);
      console.log("=====start=====");
      // 将整个文件夹上传到远端
      await sftp.uploadDir(config.uploadFile, `${config.remotePath}`);
      console.log("=====部署成功=====");
      console.log("=====end=====");
    } catch (error) {
      console.error("报错===", error.message);
    } finally {
      sftp.end();
    }
  };
  // 监听文件夹变化
  const watcher = chokidar.watch(config.watchFolder, {
    persistent: true,
    ignored: /(^|[\/\\])\../,
    depth: Infinity,
  });
  watcher
    .on("error", (error) => console.error(`Watcher error: ${error}`))
    .on("ready", () => {
      console.log(`监听文件夹=== ${config.watchFolder} ===等待部署.....`);
      watcher.on("add", throttle(upload, 1000));
    });
}
module.exports = {
  autoDeploy
}
