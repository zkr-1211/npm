const { sftp } = require('./connect')
// 回退
async function rollback(config) {
  try {
    // 连接 SFTP 服务器，判断备份文件夹是否存在
    await sftp.connect(config.sftpConfig)
    console.log('===回退开始===')
    const existsBackup = await sftp.exists(config.backupFolder)
    if (!existsBackup) {
      console.log('备份文件夹不存在')
      return
    }

    // 获取备份文件夹下所有的文件夹和文件名，并按照时间戳从大到小排序，以便找到最近的备份
    const backups = await sftp.list(config.backupFolder)
    // 过滤出文件夹
    const backupFolders = backups.filter(item => item.type === 'd')
    // 按照时间戳从大到小排序
    backupFolders.sort((a, b) => b.modifyTime - a.modifyTime)

    // 循环备份文件夹中的文件夹名字，找到最近的备份文件夹
    let latestBackupFolder = null
    for (let i = 0; i < backupFolders.length; i++) {
      const folder = backupFolders[i]
      // 如果文件夹名字符合 dist_${author} 的格式，说明是我们部署时备份的文件夹
      if (folder.name.match(`^dist_${config.author}`).length) {
        latestBackupFolder = folder
        break
      }
    }

    // 如果找到最近的备份文件夹，则根据其名字将文件夹重命名为 dist，即回退到该备份状态
    if (latestBackupFolder) {
      // 删除原先的 dist 文件夹
      const existsDist = await sftp.exists(config.remotePath)
      if (existsDist) {
        const result = await sftp.rmdir(config.remotePath, true)
        if (!result) {
          console.log('!!!删除 dist 文件夹失败!!!')
          return
        }
      }
      const result = await sftp.rename(`${config.backupFolder}/${latestBackupFolder.name}`, config.remotePath)
      if (result) {
        console.log('=====回退成功=====')
      } else {
        console.log('!!!回退失败!!!')
      }
    } else {
      console.log('未找到备份文件夹')
    }
  } catch (error) {
    console.error('报错===', error.message)
  } finally {
    sftp.end()
  }
}

module.exports = {
  rollback
}
