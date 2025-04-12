# 🐳 在 Docker 上部署麦麦

## 📋 环境要求
- ✅ 已安装 Docker 环境
- ⚙️ 最低系统配置：2 核 CPU / 2GB 内存 / 5GB 磁盘空间
- 🐧 本教程测试环境：Ubuntu Server 24.04 LTS

---

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
> ```bash
> wget https://github.moeyy.xyz/https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml
> ```


> 使用本地构建镜像请跳转这里[本地构建流程](#本地构建流程)

---

## ⚙️ 二、配置麦麦环境配置
### 2.1 📝 准备配置文件模板
```bash
# 获取核心组件配置模板
wget https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env \
     -O docker-config/mmc/.env
# 若 GitHub 直连不稳定，可使用镜像源：https://github.moeyy.xyz/https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env

# 生成适配器环境配置
cat > docker-config/adapters/.env << EOF
ENVIRONMENT=dev
DRIVER=~fastapi+~websockets
HOST=0.0.0.0
PORT=18002
ONEBOT_WS_URLS=["ws://napcat:8095"]
EOF
```
> 配置文件里的服务名如不可用可替换为容器名
> - `ONEBOT_WS_URLS`配置可替换成`ws://maim-bot-napcat:8095`
> - `Fastapi_url`配置可替换成`http://maim-bot-core:8000/api/message`
> - `MONGODB_HOST`配置可替换成`maim-bot-mongo`
> - `nonebot-qq`配置可替换成`http://maim-bot-adapters:18002/api/message`

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

### 2.2 ✏️ 修改env配置
```bash
vim docker-config/mmc/.env
```
需修改以下关键参数：
```ini
# 网络监听配置
HOST=0.0.0.0

# 数据库连接配置
MONGODB_HOST=mongodb  # 修改为容器名称

# API 密钥配置（根据实际情况填写）
SILICONFLOW_KEY=sk-xxxxxx
```

### 2.3 📜 取消注释docker-compose.yml的eula
```bash
vim docker-compose.yml
# 取消注释以下两行（25-26行）
- EULA_AGREE=35362b6ea30f12891d46ef545122e84a  # 同意EULA
- PRIVACY_AGREE=2402af06e133d2d10d9c6c643fdc9333 # 同意EULA
```

当前配置完成后目录结构应如下
```bash
.
├── docker-compose.yml
└── docker-config
    ├── adapters
    │   ├── .env
    │   └── config.py
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
修改通信地址：
```toml
[platforms]
nonebot-qq = "http://adapters:18002/api/message"  # 使用容器服务名通信
```

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
正常应显示 3 个容器（maim-bot-core、maim-bot-adapters、maim-bot-mongo、maim-bot-napcat）状态为 `running`
```bash
NAME                IMAGE                                COMMAND                  SERVICE    CREATED          STATUS          PORTS
maim-bot-adapters   infinitycat/maimbot-adapter:latest   "/entrypoint.sh nb r…"   adapters   30 seconds ago   Up 18 seconds   0.0.0.0:18002->18002/tcp, [::]:18002->18002/tcp
maim-bot-core       infinitycat/maimbot:latest         "/MaiMBot/entrypoint…"   core       30 seconds ago   Up 17 seconds   0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp
maim-bot-mongo      mongo:latest                         "docker-entrypoint.s…"   mongodb    34 seconds ago   Up 25 seconds   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp
maim-bot-napcat     mlikiowa/napcat-docker:latest        "bash entrypoint.sh"     napcat     34 seconds ago   Up 25 seconds   0.0.0.0:6099->6099/tcp, [::]:6099->6099/tcp, 0.0.0.0:8095->8095/tcp, [::]:8095->8095/tcp
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
网络配置使用websocket服务器，端口使用`8095`，host填`0.0.0.0`

---

## ❓ 常见问题排查
1. ❌ **容器启动失败**：
   - 🔍 检查端口冲突（18002/8000/8095/6099/27017）
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
> ```bash
> docker compose logs -f
> ```

---
## 本地构建流程
### 一、准备必要的文件

1. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地

2. 通过 git clone 将 [maim_message 包](https://github.com/MaiM-with-u/maim_message) clone 到本地

3. 通过 git clone 将 [nonebot-plugin-maibot-adapters](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters) clone 到本地
```shell
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/maim_message.git
git clone https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters.git
```
> 如需切换分支在链接后面加`-b <分支名>`即可  

复制`maim_message`到`MaiBot`和`nonebot-plugin-maibot-adapters`目录下
```bash
cp -r maim_message MaiBot/maim_message 
cp -r maim_message nonebot-plugin-maibot-adapters/maim_message
```
拉取所需的镜像
```bash
sudo docker pull python:3.13.2-slim-bookworm
sudo docker pull ghcr.io/astral-sh/uv:latest
sudo docker pull infinitycat/adapter-bottom:latest
```
运行构建
```bash
cd MaiBot
sudo docker build -t mmc:local .
cd ../nonebot-plugin-maibot-adapters
sudo docker build -t adapters:local .
```
想要使用本地构建将`docker-compose.yml`的`image`替换即可
