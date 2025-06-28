# 安卓手机部署指南

## 前言

本教程面向有一定Linux基础的小白用户，使用ZeroTermux搭建基于MaiBot的QQ机器人。

开始之前，**作者十分建议阅读 [MaiBot文档中心-Linux部署](./mmc_deploy_linux.md) 和 [如何高效提问](/manual/other/how-to-ask-questions) ，这对小白了解大致流程和提问来说很有好处。**

## 1. 安装 ZeroTermux 环境

前往[ZeroTermux-Github](https://github.com/hanxinhao000/ZeroTermux/releases/tag/release)下载ZeroTermux安装包并安装。

**注意：安装其他版本或者选择Termux会导致以下教程出现部分的不适用，文档作者不建议这样做**

进入ZeroTermux软件界面，提示完整阅读协议时记得要把文字内容拉到最底下。

双击屏幕左侧边缘（部分ZT版本是按音量上/下键），下滑并点击“切换源”，随意选择，作者推荐选择`清华源`，等待脚本运行完成。

> 如无特殊说明，当出现 `(Y/I/N/O/D/Z)[default=?]` 或 `[Y/N]` 时，直接点击回车，选择默认选项即可。

## 2. 安装proot，Ubuntu 等必要软件

运行（逐行粘贴并回车）如下命令安装 `proot`, `Ubuntu`
```bash
pkg install proot-distro      # 安装proot
proot-distro install ubuntu   # 安装Ubuntu
proot-distro login ubuntu     # 登录Ubuntu
```

随后运行如下命令安装必要软件

```bash
apt update
apt install sudo vim git python3-dev python3.12-venv build-essential screen
```

::: details root 方法
直接使用root用户操作所有命令可能有巨大的安全风险（**尤其是新手！**），下述命令会创建一个账户。此步骤可跳过但**不建议**。

替换 `<username>` 为你的用户名，输入两次密码后可以全部按回车留空。**密码输入后不显示是正常的。**
```bash
adduser <username>           # 创建账户
usermod -G sudo <username>   # 添加运行sudo的权限
visudo                       # 编辑sudoers文件
```
进入vim后，用下箭头翻到最下面，点击INS，进入INSERT模式，另起一行，输入如下内容，并点击ESC退出INSERT模式，输入:wq保存并退出，以下使用vim编辑器的方法不再赘述。
```
<username> ALL=(ALL)
```
之后继续运行
```bash
su <username>                # 登入账户
```
:::

## 3. 部署 MaiBot 与 MaiBot Napcat Adapter

依次运行以下命令，创建文件夹并从Github上拉取数据。

```bash
cd ~              # 进入home目录（~）
mkdir maimai      # 创建maimai文件夹
cd maimai         # 进入maimai文件夹
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-uMaiBot-Napcat-Adapter.git
git clone https://github.com/MaiM-with-u/MaiMBot-LPMM.git
```

运行以下命令，创建并激活venv虚拟环境。

::: tip
此后每次使用,如未显示`(venv)`，都需要重新激活环境
:::

```bash
python3 -m venv MaiBot/venv      # 创建虚拟环境    
source MaiBot/venv/bin/activate  # 激活环境
```

运行以下命令，安装依赖。

```bash
pip install uv setuptools wheel pyproject -i https://mirrors.aliyun.com/pypi/simple
cd MaiMBot-LPMM
uv pip install -r requirements.txt --upgrade
cd lib/quick_algo
python3 build_lib.py --cleanup --cythonize --install
cd ../../../MaiBot
uv pip install -r requirements.txt --upgrade
cd ../MaiBot-Napcat-Adapter
uv pip install -r requirements.txt --upgrade
# 复制并重命名文件
cp template/template_config.toml config.toml
```

最终的文件结构应当如下
```
maimai
├── MaiBot
│   ├── changelogs
│   ├── config
│   ├── data
│   ├── depends-data
│   ├── src
│   │   └── ...
│   └── template
└── MaiBot-Napcat-Adapter
    ├── config.toml
    └── template
```

## 4. 部署 Napcat
```bash
#安装NapCat
curl -o \
napcat.sh \
https://nclatest.znin.net/NapNeko/NapCat-Installer/main/script/install.sh \
&& sudo bash napcat.sh \
--docker n \
--cli y

#打开NapCat
sudo napcat
```

之后使用方向键和回车依次选择
```
配置Napcat
配置服务
输入QQ号码
保存
配置服务
4  WebSocket客户端
```
名称任意填，Url将“8082”修改为“8095”，其他保持默认

然后继续选择
```
OK
enable（使用空格选中）
OK
退出
启动Napcat
启动账号：xxxxxxxxx
```
之后截屏二维码，发送/投屏到另一个设备 **（直接从相册导入二维码实测无法登录）**，用登录该QQ号的手机QQ扫码。随后退出即可。

## 5.配置config文件

```bash
cd ../MaiBot
# 创建文件夹
mkdir config
# 复制并重命名配置文件
cp template/bot_config_template.toml config/bot_config.toml
cp template/template.env .env
vim .env
#修改.env，开头的port改成8000
```

**随后前往 [MaiBot文档中心配置指南](/manual/configuration/index.md)完成配置**
**大部分的问题都是在这一步发生的，上述文档有看不懂的内容欢迎找群友沟通**

然后配置MaiBot-Napcat-Adapter

使用vim打开MaiBot-Napcat-Adapter文件夹下的config.toml，配置`Napcat_Server`、`MaiBot_Server`字段
```toml
[Napcat_Server] # Napcat连接的ws服务设置
host = "localhost" # Napcat设定的主机地址
port = 8095        # Napcat设定的端口
heartbeat = 30     # 与Napcat设置的心跳相同（按秒计）

[MaiBot_Server] # 连接麦麦的ws服务设置
platform_name = "qq" # 标识adapter的名称（必填）
host = "localhost"   # 麦麦在.env文件中设置的主机地址，即HOST字段
port = 8000          # 麦麦在.env文件中设置的端口，即PORT字段
```
`Napcat_Serve`字段的`port`,应该与Napcat设置的反向代理的url相同（这里是8095）

`Napcat_Server`字段的`heartbeat`,应该与Napcat设置的反向代理的心跳间隔相同（注意，Napcat中的间隔为毫秒，填入时请转化为秒，这里是30）

`MaiBot_Server`字段的`port`,应该与麦麦本体的.env中的`PORT`相同（此处为8000）

其余字段参考[MaiBot文档中心-Adapter配置](/manual/adapters/napcat.html)

**记得在这里配置群组或私聊的白名单！否则无法回复消息**

## 6.启动
*恭喜你已经完成了大部分步骤！胜利的曙光就在眼前！*

```bash
screen -R mmc
#窗口会清空，别慌
cd ~/maimai/MaiBot
python3 bot.py
#依次点击Ctrl A D(即输入a和d)

screen -R mmc-adapter
cd ~/maimai/MaiBot-Napcat-Adapter
python3 main.py
#依次点击Ctrl A D退出
```

## 恭喜你已经完成了整个安装流程，以下是命令速查表

| 命令 | 作用 |
|---|---|
| `cd xxx` | 进入xxx目录（若xxx为..则返回上一级目录） |
| `vim xxx` | 使用编辑vim编辑文件 |
| `ESC` + `:wq` | 退出vim并保存 | 
| `screen -r xxx` / `screen -R xxx` | 进入xxx session （后者当没有该session时会创建一个） |
| `Ctrl` + `A` + `D` | 退出session |
| `screen -ls` | 列出所有session |
| `source ~/maimai/MaiBot/venv/bin/activate` | 进入虚拟环境venv |

## 常态化启动
```bash
proot-distro login ubuntu
su <username> #如果使用root用户完成整个流程请跳过这步
screen -r mmc-adapter
python3 main.py
# Ctrl + A + D
screen -r mmc
python3 bot.py
```