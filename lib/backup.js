// 备份
async function backup(sftp, config) {
  // 判断远端 backup 文件夹是否存在，如果不存在，则创建
  const existsBackup = await sftp.exists(config.backupFolder)
  if (!existsBackup) {
    await sftp.mkdir(config.backupFolder)
  }
  // 获取当前时间，并根据时间生成备份目录名
  const timestamp = new Date().toLocaleString().replace(/\//g, '-')
  const backupName = `dist_${config.author}_${timestamp}`
  // 判断远端 dist 文件夹是否存在，如果存在，则将其移动到备份文件夹中
  const existsDist = await sftp.exists(`${config.remotePath}`)
  if (existsDist) {
    // 将 dist 文件夹移动到备份目录
    const result = await sftp.rename(`${config.remotePath}`, `${config.backupFolder}/${backupName}`)
    if (result) {
      console.log('=====备份成功=====')
      // 获取备份文件夹列表
      const backupList = await sftp.list(config.backupFolder)
      if (backupList?.length > 5) {
        // 对备份文件夹按照时间戳排序
        const sortedBackupList = backupList.sort((a, b) => {
          return a.modifyTime - b.modifyTime
        })
        // 删除时间最久远的文件夹
        const oldestBackup = sortedBackupList[0].name
        await sftp.rmdir(`${config.backupFolder}/${oldestBackup}`, true)
        console.log(`超过5个备份文件夹，删除了${oldestBackup}文件夹`)
      }
    } else {
      console.log('!!!备份失败!!!')
      return
    }
  }
}
module.exports = {
  backup
}
