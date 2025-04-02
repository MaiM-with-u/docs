# 在docker上部署麦麦（refactor分支preview版）

> - 本教程环境默认您已装好docker  
> - 系统要求最低2核2g内存5g磁盘空间 
> - 本教程环境为ubuntu server 24.04 LTS 

## 1.拉取docker-compose.yml

```bash
# 创建文件夹并进入
mkdir maim-bot && cd maim-bot
# 拉取docker-compose.yml
wget https://raw.githubusercontent.com/SengokuCola/MaiMBot/refactor/docker-compose.yml -O docker-compose.yml
```
> 下载失败可以使用下面的命令
> ```bash
> wget https://github.moeyy.xyz/https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml -O docker-compose.yml
> ```
## 2.获取和创建配置文件
创建配置文件目录
```bash
mkdir docker-config && cd docker-config
mkdir mmc adapters
```
获取mmc的env模板
```bash
# maimbot-core
wget https://raw.githubusercontent.com/MaiM-with-u/MaiBot/refactor/template/template.env -O mmc/.env
```
修改mmc/.env文件
```bash
vim mmc/.env
# 第1行HOST
HOST=0.0.0.0
# 第9行MONGODB_HOST改为
MONGODB_HOST=mongodb
# 底下填入你模型要用的key
```
创建adapters所需的env
```bash
# adapters
cat << EOF > adapters/.env

ENVIRONMENT=dev

DRIVER=~fastapi+~websockets

HOST=0.0.0.0

PORT=18002

ONEBOT_WS_URLS=["ws://napcat:8095"] #此处与Napcat端口相同

EOF
```
启动前目录结构如下
```bash
.
├── docker-compose.yml
└── docker-config
    ├── adapters
    │   └── .env
    └── mmc
        └── .env
```
回到mmc项目根目录，启动一次docker
```bash
cd ..
sudo docker compose up -d
# 等待一会（10-20s）
sudo docker compose down
```
然后修改bot_config
```bash
vim docker-config/mmc/bot_config.toml
# 修改此处的127.0.0.1为docker-compose.yml中adapters的HOST
[platforms] # 必填项目，填写每个平台适配器提供的链接
nonebot-qq="http://adapters:18002/api/message"
```
> 其余内容如不知道如何配置请前往 [🎀 新手配置指南](/manual/installation/installation_cute) 或 [⚙️ 标准配置指南](/manual/installation/installation_standard) 完成`.env`与`bot_config.toml`配置文件的编写

最后修改adapters的config.py
```bash
vim docker-config/adapters/plugins/nonebot_plugin_maibot_adapters/config.py
# 修改Fastapi_url : str = "http://localhost:8000/api/message"为
Fastapi_url : str = "http://core:8000/api/message"
```
## 3.启动docker-compose

```bash
# 启动麦麦
sudo docker compose up -d
# 检查状态
sudo docker compose ps
# 查看日志
sudo docker compose logs -f
# 停止麦麦
sudo docker compose down
```
> - 启动后请访问`http://你的ip:6099`对napcat进行进一步配置