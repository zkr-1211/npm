const { sftp } = require('./connect')
const chokidar = require("chokidar");
// 节流函数
function throttle(fn, delay) {
  let lastTime = 0;
  return function (...args) {
    const currentTime = new Date().getTime();
    if (currentTime - lastTime >= delay) {
      lastTime = currentTime;
      fn.apply(this, args);
    }
  };
}
// 自动上传部署并备份
async function autoDeployBackup(config) {
  const upload = async () => {
    try {
      // 连接SFTP服务器
      await sftp.connect(config.sftpConfig);
      console.log("=====start=====");
      // 判断远端 backup 文件夹是否存在，如果不存在，则创建
      const existsBackup = await sftp.exists(config.backupFolder);
      if (!existsBackup) {
        await sftp.mkdir(config.backupFolder);
      }
      // 获取当前时间戳，并根据时间戳生成备份目录名
      const timestamp = new Date().getTime();
      const backupName = `dist_${config.author}_${timestamp}`;
      // 判断远端 dist 文件夹是否存在，如果存在，则将其移动到备份文件夹中
      const existsDist = await sftp.exists(`${config.remotePath}`);
      if (existsDist) {
        // 将 dist 文件夹移动到备份目录
        const result = await sftp.rename(
          `${config.remotePath}`,
          `${config.backupFolder}/${backupName}`
        );
        if (result) {
          console.log(`===备份成功===`);
          // 获取备份文件夹列表
          const backupList = await sftp.list(config.backupFolder);
          if (backupList.length > 5) {
            // 对备份文件夹按照时间戳排序
            const sortedBackupList = backupList.sort((a, b) => {
              return a.modifyTime - b.modifyTime;
            });
            // 删除时间最久远的文件夹
            const oldestBackup = sortedBackupList[0].name;
            await sftp.rmdir(`${config.backupFolder}/${oldestBackup}`, true);
            console.log(`超过5个备份文件夹，删除了${oldestBackup}文件夹`);
          }
        } else {
          console.error(`!!!备份失败!!!`);
          return;
        }
      }
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
      console.log(`监听文件夹=== ${config.watchFolder} ===等待备份并部署.....`);
      watcher.on("add", throttle(upload, 1000));
    });
}
module.exports = {
  autoDeployBackup
}

