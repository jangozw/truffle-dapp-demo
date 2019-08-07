# 以太坊dapp开发入门指引
## 简介
适合想了解以太坊dapp开发,了解要做哪些事情，这篇教程以一个简单的部署在区块链上的投票合约为例详细讲述以太坊开发全流程体验。有过程序开基础的人可直接入手，代码很简单预计花费1小时。包含的技术点：
- 使用以太坊开发的truffle框架
- 使用ganache图形界面版做测试环境
- 使用solidity 编写投票合约
- 将合约部署到ganache
- 使用web3.js调用合约里的方法进行投票和获取票数

## 环境准备
安装node，npm, truffle, ganache(界面版),web3,lite-server

## 流程
### 1,创建项目目录
```sh
mkdir Voting && cd Voting
```
### 2，初始化truffle项目
```sh
# 用truffle 初始化项目,会生成一些目录和文件
truffle init
```
### 3,创建合约
```sh
# 创建一个合约,文件生成在contracts/Voting.sol
truffle create contract Voting

```
### 4,用solidity编写合约代码
```sh
# 编写合约代码
见contracts/Voting.sol
```
### 5,编译合约
```sh
# 编译合约，检查是否报错
cd Voting && truffle compile
```
### 6,部署前的配置
- 打开ganache软件界面版
如图：软件自动生成了10个账户和对应的rpc地址和端口
https://jangozw.github.io/images/pasted-50.png
![upload successful](/images/pasted-50.png)

- 在Voting/truffle.config.js（truffle自动生成的）里面修改监听的url和端口，这个是ganache中给的

![upload successful](/images/pasted-52.png)

- 在Voting/migrations/里复制一个migration.js 少动修改作为部署配置
如Voting/migrations/2_migtation_vote.js

![upload successful](/images/pasted-54.png)
```sh
# 部署合约
$ cd Voting 
$ truffle migrate --reset 
```
部署成功后合约就永久在区块链上了

### 7，调用合约方法
调用合约使用web3.js, 本案例直接用html引入js展示调用
具体看 Voting/src下的html,js 代码很简单，里面注释充分，不多讲。
### 8，预览
![upload successful](/images/pasted-56.png)
package.json中红框内写lite-server,如果没有安装就
```npm install lite-server``` 安装。
创建Voting/bs-config.js 这个是用作node.js 服务器用的：

![upload successful](/images/pasted-58.png)
然后浏览器访问：
```sh
$ cd Voting
$ npm run dev
```
![upload successful](/images/pasted-60.png)
此时浏览器会自动打开http://localhost:3000/

![upload successful](/images/pasted-62.png)
打开浏览器开发者模式的console,观察web3.js调用结果。

如有疑问多看代码，代码很少，注释很多，本篇只梳理开发流程。
至此一个简单的以太坊dapp在测试环境开发完成。



