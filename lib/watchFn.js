const chokidar = require('chokidar')
const { deploy } = require('./deploy')
const { deployBackup } = require('./deployBackup')
async function watchFn(config, type = 1) {
  const upload = () => {
    return type === 1 ? deploy(config) : deployBackup(config)
  }
  // 监听文件夹变化
  const watcher = chokidar.watch(config.watchFolder, {
    persistent: true,
    ignored: /(^|[\/\\])\../,
    depth: Infinity
  })
  watcher
    .on('error', error => console.error(`Watcher error: ${error}`))
    .on('ready', () => {
      console.log(`监听文件夹=== ${config.watchFolder} ===等待部署.....`)
      watcher.on('add', throttle(upload, 1000))
    })
}
// 节流函数
function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    const currentTime = new Date().getTime()
    if (currentTime - lastTime >= delay) {
      lastTime = currentTime
      fn.apply(this, args)
    }
  }
}
module.exports = {
  watchFn
}
