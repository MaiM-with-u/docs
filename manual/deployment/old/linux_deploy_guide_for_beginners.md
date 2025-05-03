# 新手 Linux 服务器部署指南

本文是针对完全的 Linux 服务器新手编写的详细部署教程。如果你之前从未接触过 Linux 服务器，但想尝试部署 MaiBot，这篇教程将一步步引导你完成整个过程。

## 基础知识

### 什么是 Linux 服务器？

Linux 服务器是一种运行 Linux 操作系统的计算机，专门用于提供各种服务。与 Windows 不同，Linux 服务器主要通过命令行操作，而非图形界面。

### 如何连接到 Linux 服务器？

你需要使用 SSH 工具连接到服务器：

- **Windows 用户**：推荐使用 [PuTTY](https://www.putty.org/) 或 [MobaXterm](https://mobaxterm.mobatek.net/)
- **Mac/Linux 用户**：直接使用终端，输入 `ssh 用户名@服务器IP地址`

## 前置准备

1. 一台 Linux 服务器（推荐 Ubuntu 20.04 LTS 或 Debian 11）
2. 服务器的 IP 地址、用户名和密码
3. 基本的命令行操作知识（本教程会教你最基本的命令）

## 安装步骤

### 步骤 1：连接到服务器

使用 SSH 客户端连接到你的服务器，输入用户名和密码。

### 步骤 2：更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

### 步骤 3：安装必要的依赖

```bash
sudo apt install -y git curl python3 python3-pip python3-venv
```

### 步骤 4：安装 Docker

Docker 是一种容器化技术，可以让我们更容易地部署 MaiBot。

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt install -y docker-compose

# 将当前用户添加到 docker 组，这样就不需要每次使用 docker 时都加 sudo
sudo usermod -aG docker $USER

# 重新登录以使更改生效
exit
```

重新连接到服务器。

### 步骤 5：克隆 MaiBot 仓库

```bash
git clone https://github.com/MaiM-with-u/MaiBot.git
cd MaiBot
```

### 步骤 6：配置机器人

你需要编辑两个配置文件：`.env.prod` 和 `bot_config.toml`。

```bash
# 复制模板文件
cp template.env .env.prod
cp template/bot_config_template.toml bot_config.toml

# 使用 nano 编辑器编辑 .env.prod 文件
nano .env.prod
```

在编辑 `.env.prod` 文件时，主要需要修改以下内容：

- `SILICONFLOW_KEY=`：填入你的 Silicon Flow API 密钥
- `HOST=`：改为 `0.0.0.0`（允许从任何地址访问）
- `PORT=`：保持默认即可（8080）
- `MONGODB_URI=`：保持默认即可（mongodb://localhost:27017/MegBot）

编辑完成后，按 `Ctrl+X`，然后按 `Y` 再按 `Enter` 保存文件。

接下来编辑 `bot_config.toml` 文件：

```bash
nano bot_config.toml
```

主要需要修改以下内容：

- `name =`：填入你想要的机器人名称
- `provider =`：保持默认 `"SILICONFLOW"`
- 其他设置可以根据需要修改

同样，编辑完成后按 `Ctrl+X`，然后按 `Y` 再按 `Enter` 保存文件。

### 步骤 7：启动 MaiBot

```bash
docker-compose up -d
```

这个命令会在后台启动 MaiBot 及其所有依赖服务。

### 步骤 8：配置 NapCat

NapCat 是一个 QQ 机器人框架，MaiBot 通过它与 QQ 通信。

1. 在浏览器中访问 `http://你的服务器IP:6099`
2. 使用终端查看 token：
   ```bash
   docker logs -f napcat
   ```
   找到类似 `[WebUi] WebUi Local Panel Url: http://127.0.0.1:6099/webui?token=xxxx` 的日志，这个 `token=` 后面的就是你的 token
3. 在浏览器中输入这个 token 登录 NapCat 控制面板
4. 登录你的 QQ 小号（**建议使用小号，不要使用主力 QQ 号**）
5. 添加反向 WebSocket 连接：
   - 点击「网络配置」→「新建」→「Websocket客户端」
   - 名称随意填写
   - URL 填写 `ws://maimbot:8080/onebot/v11/ws`
   - 点击「启用」和「保存」

### 步骤 9：测试机器人

找个 QQ 群，@你的机器人，发送「你好」或「你在吗」，看看它是否正常回复。

## 常见问题

### 服务没有正常启动怎么办？

你可以使用以下命令检查容器的运行状态：

```bash
docker ps -a
```

如果某个容器没有运行（STATUS 不是 Up），你可以查看它的日志：

```bash
docker logs 容器名称
```

### 机器人不回复消息怎么办？

1. 检查 NapCat 是否成功登录 QQ
2. 检查 WebSocket 连接是否正确配置
3. 查看 maimbot 容器的日志：
   ```bash
   docker logs maimbot
   ```

### 如何更新 MaiBot？

```bash
cd MaiBot
git pull
docker-compose up -d --build
```

### 如何停止 MaiBot？

```bash
cd MaiBot
docker-compose down
```

## 进阶操作

### 设置开机自启

如果你希望服务器重启后 MaiBot 自动启动，可以设置 Docker 服务开机自启：

```bash
sudo systemctl enable docker
```

### 文件传输

如果你需要在本地和服务器之间传输文件，可以使用 FileZilla 等 SFTP 客户端，或者使用 SCP 命令：

```bash
# 从本地上传文件到服务器
scp 本地文件路径 用户名@服务器IP:服务器路径

# 从服务器下载文件到本地
scp 用户名@服务器IP:服务器文件路径 本地路径
```

## 小贴士

- 始终保持系统更新：定期运行 `sudo apt update && sudo apt upgrade -y`
- 注意安全：设置强密码，考虑启用 SSH 密钥认证代替密码登录
- 做好备份：定期备份你的配置文件和数据
- 学习基础命令：掌握 `ls`、`cd`、`mkdir`、`rm`、`cat` 等基本命令会让你的操作更顺畅

希望这份指南能帮助你成功部署 MaiBot！如果遇到问题，不要害怕尝试，Linux 的学习曲线可能有些陡峭，但掌握它会非常有价值。