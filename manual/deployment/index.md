# 📦 MaiBot 部署指南

## 你必须要准备好的

1. 电脑一台：Windows/Linux/Mac 任意
2. 一个QQ小号（请自行了解QQ机器人风险）（你也可以使用微信适配器或者桌宠适配器，但可能更新不及时）
3. AI大模型的可以使用的API Key

## 部署方式选择

本部署文档针对新的MaiCore (>=0.7.0) 进行部署。


- [Windows](mmc_deploy_windows)


- [Linux](mmc_deploy_linux)


- [Docker部署](mmc_deploy_docker)


- [使用旧版adapter的windows部署](./old/mmc_deploy_windows_old)

::: tip
高版本（0.6.3+）启用了新版知识库，使用说明在[这里](/manual/usage/lpmm)。
:::

---

::: details 点击查看0.5.x部署方式(旧版)

本部分需要使用MongoDB作为数据库，安装请自行探索。

### Docker 部署 (推荐)

[Docker 部署](./old/docker_deploy) 是最推荐的部署方式，它能够提供最一致的运行环境和最简单的更新流程。如果您熟悉 Docker，或愿意学习基本的 Docker 操作，这是首选方案。

**适合人群**：有一定技术基础，熟悉或愿意学习 Docker 的用户。

### 手动部署

如果您更喜欢直接在系统中运行 MaiBot，我们提供了多种手动部署的教程：

- [Linux 手动部署指南](./old/manual_deploy_linux)
- [Windows 手动部署指南](./old/manual_deploy_windows)

**适合人群**：有一定技术基础，更喜欢直接控制系统的用户。

### 特定环境部署

- [新手 Linux 服务器部署指南](./old/linux_deploy_guide_for_beginners) - 面向纯新手的详细教程
- [群晖 NAS 部署指南](./old/synology_deploy) - 专为群晖 NAS 用户设计的教程

**适合人群**：没有太多技术背景但想尝试部署的用户，或使用特定设备的用户。

:::

## 故障排除

如果您在部署过程中遇到问题，可以：

1. 参考 [常见问题](/faq/) 中的常见问题
2. 查看项目的 GitHub Issues
3. 加入用户交流群获取帮助
