# 📦 Linux手动部署MaiMbot麦麦（main 0.6版）

- 以下内容假设你对Linux系统有一定的了解，如果觉得难以理解，请用Windows系统部署[Windows系统部署指南](mmc_deploy_windows)

## 一、 克隆麦麦，获取必要的文件
1. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地

2. 通过 git clone 将 [maim_message 包](https://github.com/MaiM-with-u/maim_message) clone 到本地

3. 通过 git clone 将 [MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter) clone 到本地
```bash
# 创建一个文件夹
mkdir maimai
cd maimai
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/maim_message.git
git clone https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter.git
```

## 二、环境配置

### 1️. 确认Python版本

需确保Python版本为3.10及以上

```bash
python --version
# 或
python3 --version
```

如果版本低于3.10，请更新Python版本。

```bash
# 此处以 Python 3.12 为例
# Ubuntu/Debian
sudo apt update
sudo apt install python3.12 python3.12-venv
# 如执行了这一步，建议在执行时将python3指向python3.12
# 更新替代方案，设置 python3.12 为默认的 python3 版本:
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12
sudo update-alternatives --config python3
```

### 2. 创建虚拟环境
```bash
# 方法1：使用venv(推荐)
python3 -m venv MaiBot/venv
source MaiBot/venv/bin/activate  # 激活环境

# 方法2：使用conda（需先安装Miniconda或Anaconda）
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
conda create -n MaiBotEnv python=3.12
conda activate MaiBotEnv
```

## 三、依赖安装
```bash
cd MaiBot
pip install uv
uv pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```
回到上一级文件夹，再进入MaiBot-Napcat-Adapter文件夹，安装依赖
```bash
cd ..
cd MaiBot-Napcat-Adapter
uv pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```
## 四、MaiBot Napcat Adapter 部署

进入`MaiBot-Napcat-Adapter`文件夹，然后复制`template`文件夹下的`template_config.toml`到Adapter的根目录下

<hr class="custom_hr"/>

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
└── MaiBot-Napcat-Adapter
    └── ...
```

## 五、NapCat配置

###  **安装NapCat框架**

- 请参考NapCatQQ文档：[Shell版](https://www.napcat.wiki/guide/boot/Shell)、[Framework版](https://www.napcat.wiki/guide/boot/Framework),任选一种即可

## 六、配置MaiBot和Adapter

### MaiBot配置

```bash
cd MaiBot
# 创建文件夹
mkdir config
# 复制并重命名配置文件
cp template/bot_config_template.toml config/bot_config.toml
cp template/template.env .env
```
复制完成后打开`.env`并修改PORT为8000
随后前往[配置指南](/manual/configuration/index)完成配置

::: details 如果你想修改这个PORT为其他，点开这里
找到 MaiBot-Napcat-Adapter 下的 config.toml ，打开，修改 MaiBot_Server 字段中的 port 为你想要的端口号
:::

### MaiBot Napcat Adapter 配置

1. 在Napcat中新建`websocket客户端`并设置反向代理的url（这里以`ws://localhost:8095/`为例）
> [!IMPORTANT]
> 配置示例：
> ![](/images/napcat_websockets_client.png)
2. 打开`MaiBot-Napcat-Adapter`文件夹下的`config.toml`，配置`[Napcat_Server]`、`[MaiBot_Server]`、`[Napcat]`字段
    - `[Napcat_Server]`字段的port,应该与Napcat设置的反向代理的url相同（这里是8095）
    - `[Napcat_Server]`字段的heartbeat,应该与Napcat设置的反向代理的心跳间隔相同（注意，Napcat中的间隔为毫秒，填入时请转化为秒，这里是30）
    - `[MaiBot_Server]`字段的port,应该与麦麦本体的`.env`中的`PORT`相同
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

## 启动麦麦

### 启动麦麦核心
到MaiBot下运行`python3 bot.py`
```bash
# 在MaiBot目录下操作
cd MaiBot
python3 bot.py
```
开一个新窗口或者终端到`MaiBot-Napcat-Adapter`运行`python main.py`
```bash
cd MaiBot-Napcat-Adapter
python3 main.py
```

### 后台运行麦麦
如需在后台运行请使用screen
启动麦麦核心前运行`screen -S mmc`
```bash
cd MaiBot
# 启动一个screen
screen -S mmc
source ../MaiBot/venv/bin/activate  # 激活环境
# 运行mmc
python3 bot.py
```
> 按:Ctrl+a, 再按:d, 即可退出screen, 此时,程序仍在后台执行;  

启动麦麦的adapter
```bash
cd ../MaiBot-Napcat-Adapter
screen -S mmc-adapter
source ../MaiBot/venv/bin/activate
# 运行adapter
python3 main.py
```

## 命令速查表

| 命令 | 用途 |
|------|------|
| `source MaiBot/venv/bin/activate` | 激活Python虚拟环境（使用venv） |
| `conda activate MaiBotEnv` | 激活Python虚拟环境（使用conda） |
| `python3 bot.py` | 启动麦麦核心 |
| `python3 main.py` | 启动Napcat适配器|

后台运行相关：
| 命令 | 用途 |
|------|------|
| `screen -S mmc` | 创建一个名为mmc的screen会话运行麦麦核心 |
| `screen -S mmc-adapter` | 创建一个名为mmc-adapter的screen会话运行适配器 |
| `Ctrl+a d` | 退出当前screen会话(程序继续在后台运行) |
| `screen -r mmc` | 重新连接到mmc会话 |
| `screen -r mmc-adapter` | 重新连接到mmc-adapter会话 |
| `screen -ls` | 查看所有screen会话列表 |
