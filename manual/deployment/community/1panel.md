# 1Panel 部署

作者：梦归云帆

## 安装 curl

::: code-group

```bash [apt]
sudo apt update
sudo apt install -y curl
```

```bash [yum]
sudo yum install -y curl
```

```bash [dnf]
sudo dnf install -y curl
```

```bash [pacman]
sudo pacman -S --noconfirm curl
```

```bash [zypper]
sudo zypper install -y curl
```

:::

## 一行命令安装

```bash
curl -fsSL -o install_MaiBot_1Panel.bash https://raw.githubusercontent.com/Puiching-Memory/appstore/MaiBot/apps/maibot/install.bash
bash install_MaiBot_1Panel.bash
```

1panel提供的Docker镜像在拉取napcat镜像时会出现问题，建议添加更多镜像源，参考：https://status.anye.xyz/

## 在1Panel面板中完成后续部署

> [!WARNING]  
> 该应用中**已经包含**NapCat镜像,你不需要另外安装NapCat

> [!NOTE]
> 相关项目： https://github.com/Fahaxikiii/napcat-1panel
>
> 该第三方项目允许将 NapCat 部署为独立 1Panel 应用。它默认连接到`Host network`，而本项目的 MaiBot 镜像默认连接到 `1panel-network` 的自定义Docker网络(符合规范)。
>
> 因此，两者在默认配置下网络隔离：使用宿主机网络的容器无法通过 Docker 自定义网络名称解析（service name）直接与 `1panel-network` 内的容器互通。

#### 安装后，NapCat需要调整配置：
1. 打开`应用日志`，找到NapCat WebUI 临时token
2. 打开web UI，使用临时token登录
3. 在`网络配置`中，添加新的webSocket客户端
4. (可选)，添加新的http服务器，地址填写 0.0.0.0:<端口号>

#### 安装后，MaiBot需要调整配置：
1. 进入`应用安装目录`
2. ./docker-config/adapters/config.toml 调整群聊白名单
3. ./docker-config/mmc/model_config.toml 调整模型和API Key等配置
4. ./docker-config/mmc/bot_config.toml 调整机器人设置
5. 点击`重启应用`以生效

#### 示例配置文件
- [model_config_qwen.toml](https://github.com/Puiching-Memory/MaiBot-1Panel/blob/MaiBot/model_config_qwen.toml) - 全部使用阿里云百炼 Qwen 模型的配置文件
- Qwen 模型价格查询：[价格表](https://bailian.console.aliyun.com/?tab=doc#/doc/?type=model&url=2840914)
- Qwen VL 系列模型回复较慢，请延长超时时间，至少30~60秒

## 安装插件

插件路径位于：
```bash
/opt/1panel/apps/local/maibot/localmaibot/data/MaiMBot/plugins
```

## Docker DNS 解析

所有容器均加入 `1panel-network`，因此可以通过服务名直接解析并互通：
- `napcat` → NapCat 服务容器
- `adapters` → MaiBot 适配器容器
- `core` → MaiBot 核心容器

## 代办事项

- [ ] 1Panel 目前不接受小于1w星的应用上架

## EULA
- 安装默认同意MaiBot EULA（不确定该策略是否合理，请在issue中反馈）

## 参考

- https://github.com/1Panel-dev/appstore/wiki/%E5%A6%82%E4%BD%95%E6%8F%90%E4%BA%A4%E8%87%AA%E5%B7%B1%E6%83%B3%E8%A6%81%E7%9A%84%E5%BA%94%E7%94%A8
- https://docs.mai-mai.org/manual/deployment/mmc_deploy_docker.html
- https://docs.mai-mai.org/