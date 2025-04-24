# MaiBot 部署指南

本章节将介绍多种部署 MaiBot 的方法，您可以根据自己的需求和环境选择合适的方式。

## 安装前须知

### 你必须要准备好的

1. 电脑一台：windos/Linux/Mac 任意
2. 一个QQ小号（请自行了解QQ机器人风险）
3. 安装好的mongoDB数据库，关于怎么安装，请百度
4. AI大模型的可以使用的API Key

## 部署方式选择

本部署文档针对新的MaiCore (>=0.6.0) 进行部署

### 新版MaiCore部署

- [MaiCore版Windows部署](mmc_deploy_windows)
- [使用旧版adapter的windows部署](./old/mmc_deploy_windows_old)

### 新版MaiCore部署（Docker）

- [MaiCore版Docker部署(推荐)](mmc_docker_deploy)

### 新版MaiCore部署（Linux）

- [MaiCore版Linux部署](mmc_deploy_linux)

### （测试）新知识库系统测试

这个文档针对新的new_knowledge分支进行说明

- [new_knowledge版（LPMM版）说明](/manual/deployment/LPMM)

---

::: details 点击查看0.5.x部署方式(旧版)
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

1. 参考 [快速问答](/manual/usage/fast_q_a) 中的常见问题
2. 查看项目的 GitHub Issues
3. 加入用户交流群获取帮助
