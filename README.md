## 上传部署
deploy

## 上传部署并进行备份
deployBackup

## 监听文件夹上传部署
watchDeploy

## 监听文件夹上传部署并进行备份
watchDeployBackup

## 回滚到最近一次的部署文件
rollback

## 关于npm（如何发布自己的npm包）可参考 https://zhuanlan.zhihu.com/p/575485165

## 登录npm
npm login --registry https://registry.npmjs.org

## 发布npm
npm publish --registry https://registry.npmjs.org

## 后续更新npm包
npm version patch
  npm version后面参数说明：
    patch：小变动，比如修复bug等，版本号变动 v1.0.0->v1.0.1
    minor：增加新功能，不影响现有功能,版本号变动 v1.0.0->v1.1.0
    major：破坏模块对向后的兼容性，版本号变动 v1.0.0->v2.0.0

## 迭代版本号之后重复第四步
npm publish --registry https://registry.npmjs.org

## 撤销发布（慎用）
npm unpublish 包名@版本号 --force （根据需要接上npm源地址）
示例：npm unpublish mikey-npm-test@1.0.0 --force --registry https://registry.npmjs.org




# 使用verdaccio搭建内网私服
# 可参考：1、https://fuhanghang.blog.csdn.net/article/details/133063466?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-133063466-blog-118294103.235%5Ev38%5Epc_relevant_anti_vip&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-133063466-blog-118294103.235%5Ev38%5Epc_relevant_anti_vip&utm_relevant_index=5
# 2、https://www.cnblogs.com/alaner/p/15649914.html
# 3、https://www.jb51.net/article/260292.htm

npm install verdaccio -g
# 开放远程访问，允许所有IP
配置config.yaml，使局域网下能共享访问，否则只能本机访问。
C:\Users\admin\AppData\Roaming\verdaccio\config.yaml
listen:
- 0.0.0.0:4873
重启，必须重启电脑配置才能生效。

# 守护进程 开机自启动 参考： https://www.cnblogs.com/smile008/p/16746375.html  
npm install pm2 -g
# 安装windows自启动包：
npm install pm2-windows-startup -g
# 创建开机启动脚本文件：
pm2-startup install
# 通过pm2启动verdaccio
pm2 start verdaccio  出现报错：
查找node的全局包 verdaccio存放路径：
C:\Users\Administrator\AppData\Roaming\npm\node_modules\verdaccio\bin
执行命令：
pm2 start C:\Users\Administrator\AppData\Roaming\npm\node_modules\verdaccio\bin\verdaccio
# 保存pm2中的项目：
pm2 save
# 如果要卸载服务，执行：
pm2-service-uninstall
# 本地ip可以访问verdaccio（其他局域网内团队成员也可使用）
http://本地IP地址:4873/


# 全局安装nrm
npm install -g nrm
# 添加私有库
nrm add verdaccio http://本地IP地址:4873/
# 查看现有的npm源
nrm ls
npm ---------- https://registry.npmjs.org/
yarn --------- https://registry.yarnpkg.com/
tencent ------ https://mirrors.cloud.tencent.com/npm/
cnpm --------- https://r.cnpmjs.org/
taobao ------- https://registry.npmmirror.com/
npmMirror ---- https://skimdb.npmjs.com/registry/
* verdaccio ---- http://本地IP地址:4873/
# 设置npm源
nrm use verdaccio

# 使用示例
npm i gtxy-sftp -D (当前为私服npm)
npm i gtxy-cicd -D (当前为公开npm)









