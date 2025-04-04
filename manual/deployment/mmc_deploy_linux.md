# 📦 Linux系统如何手动部署MaiMbot麦麦？

## 准备工作

- 一台联网的Linux设备（本教程以Ubuntu/Debian系为例）
- QQ小号（QQ框架的使用可能导致qq被风控，严重（小概率）可能会导致账号封禁，强烈不推荐使用大号）
- 可用的大模型API
- 一个AI助手，网上随便搜一家打开来用都行，可以帮你解决一些不懂的问题
- 以下内容假设你对Linux系统有一定的了解，如果觉得难以理解，请直接用Windows系统部署[Windows系统部署指南](mmc_deploy.md)

## 你需要知道什么？

- 如何正确向AI助手提问，来学习新知识

- Python是什么

- Python的虚拟环境是什么？如何创建虚拟环境

- 命令行是什么

- 数据库是什么？如何安装并启动MongoDB

- 如何运行一个QQ机器人，以及NapCat框架是什么

---

## 环境配置

### 1️. **确认Python版本**

需确保Python版本为3.10及以上

```bash
python --version
# 或
python3 --version
```

如果版本低于3.10，请更新Python版本。

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.12 python3.12-venv
# 如执行了这一步，建议在执行时将python3指向python3.12
# 更新替代方案，设置 python3.9 为默认的 python3 版本:
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12
sudo update-alternatives --config python3
```

### 2. **创建虚拟环境**
```bash
# 创建一个文件夹
mkdir maimai
# 方法1：使用venv(推荐)
python3 -m venv MaiBotEnv
source MaiBotEnv/bin/activate  # 激活环境

# 方法2：使用conda（需先安装Miniconda）
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
conda create -n MaiBotEnv python=3.12
conda activate MaiBotEnv
```
### 3. **克隆麦麦，获取必要的文件**
1. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地

2. 通过 git clone 将 [maim_message 包](https://github.com/MaiM-with-u/maim_message) clone 到本地

3. 通过 git clone 将 [nonebot-plugin-maibot-adapters](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters) clone 到本地
```bash
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/maim_message.git
git clone https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters.git
```
### 4.依赖安装
```bash
cd MaiBot
pip install uv
uv pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt
uv pip install -i https://mirrors.aliyun.com/pypi/simple nb-cli
```
回到上一级文件夹，再进入maim_message文件夹，安装这个包
```shell
cd ..
cd maim_message
uv pip install -i https://mirrors.aliyun.com/pypi/simple -e .
```

### 5、Nonebot adapter 部署
- 如果你按照上面的进行且没有关闭窗口，那么你应该在python环境/conda环境中，如果没有，请手动进入

> 空格选择，变绿即为选中

1. 回到`MaiM-with-u`文件夹，在`MaiM-with-u`文件夹下面运行`nb`命令
    ```bash
    cd ..
    nb
    ```
2. 用选择`创建一个NoneBot项目`并回车
3. 选择`simple（插件开发者）`
4. 项目名称任意，我们以`nonebot-maibot-adapter`为例输入（这与你后来生成的文件夹名称相同）
5. 选中`OneBot V11（OneBot V11 协议）`，回车
6. 驱动器选择`FastAPI（FastAPI 驱动器）`和`websockets（websockets 驱动器）`，回车
7. 插件安装位置选择`在 "src" 文件夹中`，回车
8. 立即安装依赖输入`Y`（即安装依赖）
9. 创建虚拟环境选择`n`（因为我们本身就在虚拟环境，没必要再套一个）
10. 选择内置插件时**不选择任何内置插件**，直接回车

创建完成后运行下面的命令将`nonebot-plugin-maibot-adapters`复制到`plugin`里
```bash
cp -r nonebot-plugin-maibot-adapters/nonebot_plugin_maibot_adapters nonebot-maibot-adapter/src/plugins/
```
到这里，nonebot adapter部署完成
最终的文件夹结构应该类似这样：
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
├── maim_messages
└── nonebot-maibot-adapter
    └── src
        └── plugins
            └── nonebot_plugin_maibot_adapters
```

---

## 数据库配置

###  **安装并启动MongoDB**

- 安装与启动：Debian参考[官方文档](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/)，Ubuntu参考[官方文档](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- 默认连接本地27017端口

---

## NapCat配置

###  **安装NapCat框架**

- 参考[NapCat官方文档](https://www.napcat.wiki/guide/boot/Shell#napcat-installer-linux%E4%B8%80%E9%94%AE%E4%BD%BF%E7%94%A8%E8%84%9A%E6%9C%AC-%E6%94%AF%E6%8C%81ubuntu-20-debian-10-centos9)安装

-  使用QQ小号登录，添加websocket服务器，port使用`8095`，host使用默认即`0.0.0.0`  

> 配置示例：
> ![](/images/napcat_websocket.png)

---

## 配置文件设置

### MaiBot配置

```bash
cd MaiBot
# 创建文件夹
mkdir config
# 复制并重命名配置文件
cp template/bot_config_template.toml config/bot_config.toml
cp template/template.env .env
```
复制完成后根据需要进行配置修改
> 配置文件修改请参考请前往 [🎀 新手配置指南](/manual/installation/installation_cute) 或 [⚙️ 标准配置指南](/manual/installation/installation_standard) 
> 或根据配置文件注释自行修改

> <details>
> <summary>如果你想修改.env的PORT为其他或者出现了端口冲突，点开这里</summary>
> 找到 nonebot_plugin_maibot_adapters 下的 config.py ，打开，修改第六行的 Fastapi_url 中的端口号为你想要的端口号
>
> ```python
> Fastapi_url : str = "http://localhost:8000/api/message"  # 你的FastAPI地址 / 与maimcore的服务器（端口）相同
> ```
> </details>

### Nonebot adapter 配置
##### 正向连接
1. 在Napcat中新建`websocket服务端`并设置端口为你想要的端口（这里以`8095`为例），`Host`设置为`0.0.0.0`
2. 打开`nonebot-maibot-adapter`文件夹下的`.env`文件，配置如下：
```ini
ENVIRONMENT=dev
DRIVER=~fastapi+~websockets
PORT=18002
ONEBOT_WS_URLS=["ws://127.0.0.1:8095"] #此处与Napcat端口相同
```
> <details>
> <summary>如果你想修改这里的 PORT=18002 配置，看这里</summary>
> 找到MaiBot下的 bot_config.toml ，打开找到 platform
>
> ```ini
> [platforms] # 必填项目，填写每个平台适配器提供的链接
> qq="http://127.0.0.1:18002/api/message"
> ```
>
> 然后把这里的18002修改为你设置的PORT
> </details>
## 启动麦麦

### 启动麦麦核心
到MaiBot下运行`python3 bot.py`
```bash
# 在MaiBot目录下操作
cd MaiBot
python3 bot.py
```
开一个新窗口或者终端到`nonebot-maibot-adapter`运行`nb run --reload`
```bash
cd nonebot-maibot-adapter
nb run --reload
```

---
如需在后台运行请使用screen
启动麦麦核心前运行`screen -S mmc`
```bash
cd MaiBot
# 启动一个screen
screen -S mmc
source ../MaiBotEnv/bin/activate  # 激活环境
# 运行mmc
python3 bot.py
```
> 按:Ctrl+a, 再按:d, 即可退出screen, 此时,程序仍在后台执行;  

启动麦麦的adapter
```bash
cd ../nonebot-maibot-adapter
screen -S mmc-adapter
source ../MaiBotEnv/bin/activate
# 运行adapter
nb run --reload
```
