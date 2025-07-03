# 🐳 Docker 部署

## 📋 环境要求

- ✅ 已安装 Docker 环境
- ⚙️ 最低系统配置：2 核 CPU / 2GB 内存 / 5GB 磁盘空间
- 🐧 本教程测试环境：Ubuntu Server 24.04 LTS

---

<!-- ::: warning
**升级到0.6.2时由于更换了adapter需要重新拉取docker-compose.yml和adapter相关配置(adapter配置方法见[修改相关配置](#⚙%EF%B8%8F-二、麦麦环境配置))，  
新版的adapter需要将napcat改为客户端([配置示例](#_5-2-⚙%EF%B8%8F-napcat配置入口))**
::: -->

## 🛠️ 一、准备麦麦部署环境

### 1.1 📂 创建项目目录

```bash
mkdir -p maim-bot/docker-config/{mmc,adapters} && cd maim-bot
```

### 1.2 📥 获取 Docker 编排文件

```bash
wget https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml
```

> 🔄 **备用下载方式**  
> 若 GitHub 直连不稳定，可使用镜像源：
>
> ```bash
> wget https://github.moeyy.xyz/https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml
> ```

> 使用本地构建镜像请跳转这里[本地构建流程](#本地构建流程)

---

## ⚙️ 二、麦麦环境配置

### 2.1 📝 准备配置文件模板

```bash
# 获取核心组件配置模板
wget https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env \
     -O docker-config/mmc/.env
# 若 GitHub 直连不稳定，可使用镜像源：https://github.moeyy.xyz/https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env
```

获取`adapter`的`config.toml`

```bash
wget https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter/raw/refs/heads/main/template/template_config.toml \
     -O docker-config/adapters/config.toml
# 若 GitHub 直连不稳定，可使用镜像源：https://github.moeyy.xyz/https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter/raw/refs/heads/main/template/template_config.toml
```

> 配置文件里的服务名如不可用可替换为容器名
>
> - `MaiBot_Server`配置可替换成`maim-bot-core`
> - `napcat`ws客户端可替换成`ws://maim-bot-adapters:8095`

[//]: # (> - `ONEBOT_WS_URLS`配置可替换成`ws://maim-bot-napcat:8095`)
[//]: # (> - `nonebot-qq`配置可替换成`http://maim-bot-adapters:18002/api/message`)

**预留文件**

`MacOS/Linux`

```bash
mkdir data && touch ./data/MaiMBot/maibot_statistics.html
```

`Windows`

```cmd
mkdir data  && type nul > ./data/MaiMBot/maibot_statistics.html
```

### 2.2 ✏️ 修改相关配置

```bash
vim docker-config/mmc/.env
```

需修改以下关键参数：

```ini
# 网络监听配置
HOST=0.0.0.0

# API 密钥配置（根据实际情况填写）
SILICONFLOW_KEY=sk-xxxxxx
```

修改config.toml

```bash
vim docker-config/adapters/config.toml
```

修改`Napcat_Server`的host为`0.0.0.0`  
修改`MaiBot_Server`的host为`core`  

```toml
[napcat_server] # Napcat连接的ws服务设置
host = "0.0.0.0"      # Napcat设定的主机地址
port = 8095             # Napcat设定的端口 
heartbeat_interval = 30 # 与Napcat设置的心跳相同（按秒计）

[maibot_server] # 连接麦麦的ws服务设置
host = "core" # 麦麦在.env文件中设置的主机地址，即HOST字段
port = 8000        # 麦麦在.env文件中设置的端口，即PORT字段
```

### 2.3 📜 取消注释docker-compose.yml的eula

```bash
vim docker-compose.yml
# 取消注释以下两行（23-24行）
- EULA_AGREE=bda99dca873f5d8044e9987eac417e01  # 同意EULA
- PRIVACY_AGREE=42dddb3cbe2b784b45a2781407b298a1 # 同意EULA
```

当前配置完成后目录结构应如下

```text
.
├── docker-compose.yml
├── data
    ├── MaiMbot
        └── maibot_statitics.html
└── docker-config
    ├── adapters
    │   └── config.toml
    └── mmc
        └── .env
```

---

## 🚀 三、初始化容器环境

### 3.1 ⚡ 首次启动容器生成剩余配置文件

```bash
docker compose up -d && sleep 15 && docker compose down
```

### 3.2 🔧 调整麦麦配置

```bash
vim docker-config/mmc/bot_config.toml
```

> 请根据需要自行修改
> 配置文件相关说明见[配置指南](/manual/configuration/index.md)

---

## 🎉 四、启动麦麦

### 4.1 🏁 启动所有组件

```bash
docker compose up -d
```

### 4.2 🔍 验证服务状态

```bash
docker compose ps
```

正常应显示 4 个容器（maim-bot-core、maim-bot-adapters、maim-bot-napcat）状态为 `running`

```bash
NAME                IMAGE                           COMMAND                  SERVICE     CREATED          STATUS          PORTS
maim-bot-adapters   unclas/maimbot-adapter:latest   "python main.py"         adapters    34 minutes ago   Up 34 minutes   8095/tcp
maim-bot-core       sengokucola/maimbot:main        "python bot.py"          core        34 minutes ago   Up 34 minutes   8000/tcp
maim-bot-napcat     mlikiowa/napcat-docker:latest   "bash entrypoint.sh"     napcat      34 minutes ago   Up 34 minutes   0.0.0.0:6099->6099/tcp, [::]:6099->6099/tcp
sqlite-web          coleifer/sqlite-web             "/bin/ash -c 'sqlite…"   sqlite-web  34 minutes ago   Up 34 minutes   0.0.0.0:8120->8080/tcp   
```

### 4.3 📜 实时日志监控

```bash
docker compose logs -f
```

---

## 🔧 五、后续管理操作

### 5.1 🎛️ 服务启停命令

| 操作 | 命令 |
|------|------|
| ▶️ 启动服务 | `docker compose up -d` |
| ⏹️ 停止服务 | `docker compose down` |
| 🔄 强制重建 | `docker compose up -d --force-recreate` |

### 5.2 ⚙️ Napcat配置入口

访问 `http://<服务器IP>:6099` 完成 Napcat 的配置
> 网络配置使用`websocket客户端`，`url`为`ws://adapters:8095`
> 例：
> ![Napcat配置](/images/mmc-napcat-client.png)

---

## ❓ 常见问题排查

1. ❌ **容器启动失败**：
   - 🔍 检查端口冲突（18002/8000/8095/6099/8120）
      > 如未映射请忽略
   - 🔑 验证 `.env` 文件中的 API 密钥有效性

2. 🔄 **配置文件更新**：
   修改配置后需执行：

   ```bash
   docker compose down
   docker compose up -d
   ```

   或：

   ```bash
   docker compose restart
   ```

3. 📊 **资源监控**：

   ```bash
   docker stats
   ```

> 💡 提示：遇到问题时可以查看日志获取更多信息：
>
> ```bash
> docker compose logs -f
> ```

---

## 本地构建流程

### 准备必要的文件

1. 通过 git clone 将 [麦麦](https://github.com/MaiM-with-u/MaiBot) clone 到本地

2. 通过 git clone 将 [MaiMBot-LPMM 包](https://github.com/MaiM-with-u/MaiMBot-LPMM) clone 到本地

3. 通过 git clone 将 [MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter) clone 到本地

```shell
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/MaiMBot-LPMM.git
git clone https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter.git
```

> 如需切换分支在链接后面加`-b <分支名>`即可  

复制`MaiMBot-LPMM`到`MaiBot`目录下

```bash
cp -r MaiMBot-LPMM MaiBot/MaiMBot-LPMM 
```

拉取所需的镜像

```bash
sudo docker pull python:3.13.5-slim-bookworm
sudo docker pull python:3.13.5-slim
sudo docker pull ghcr.io/astral-sh/uv:latest
```

运行构建

```bash
cd MaiBot
sudo docker build -t mmc:local .
cd ../MaiBot-Napcat-Adapter
sudo docker build -t adapters:local .
```

想要使用本地构建将`docker-compose.yml`的`image`替换即可

---

## adapter的nonebot版本安装（即将弃用）

生成`adapter`的`.env`配置

```bash
# 生成适配器环境配置
cat > docker-config/adapters/.env << EOF
ENVIRONMENT=dev
DRIVER=~fastapi+~websockets
HOST=0.0.0.0
PORT=18002
ONEBOT_WS_URLS=["ws://napcat:8095"]
EOF
```

获取config.py

```bash
wget https://raw.githubusercontent.com/MaiM-with-u/nonebot-plugin-maibot-adapters/refs/heads/master/nonebot_plugin_maibot_adapters/config.py \
     -O docker-config/adapters/config.py
# 若 GitHub 直连不稳定，可使用镜像源：https://github.moeyy.xyz/https://raw.githubusercontent.com/MaiM-with-u/nonebot-plugin-maibot-adapters/refs/heads/master/nonebot_plugin_maibot_adapters/config.py
```

然后修改config.py

```bash
vim docker-config/adapters/config.py
```

```python
# 修改config.py
Fastapi_url: str = "http://core:8000/api/message"  # 容器间内部通信
```

当前配置完成后目录结构应如下

```text
.
├── docker-compose.yml
└── docker-config
    ├── adapters
    │   ├── .env
    │   └── config.py
    └── mmc
        └── .env
```

启动一次docker，详见[初始化容器环境](#-三初始化容器环境)  
调整麦麦配置

```bash
vim docker-config/mmc/bot_config.toml
```

修改通信地址：

```toml
[platforms]
nonebot-qq = "http://adapters:18002/api/message"  # 使用容器服务名通信
```

napcat相关：  
网络配置使用`websocket服务器`，端口使用`8095`，host填`0.0.0.0`
