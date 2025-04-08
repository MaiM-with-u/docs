# 📂 文件及功能介绍 (2025年更新)

## 根目录
- **README.md**: 项目的概述和基本说明。
- **requirements.txt**: 项目所需的Python依赖包列表。
- **bot.py**: 主启动文件。
- **docker-compose.yml** 和 **Dockerfile**: Docker配置文件，用于容器化部署。
- **pyproject.toml**: Python项目配置文件。
- **PRIVACY.md**: 隐私政策
- **EULA.md**: EULA文件
- **LICENSE**: LICENSE文件

## `changelogs/` 目录
- 记录MaiBot项目的Changelog

## `depends-data/` 目录

## `scripts/` 目录
-  一些MaiBot项目的快捷脚本

## `src/` 目录结构
- **common**: 通用模块，包括日志、数据库等工具
  - **database.py**: 数据库模块
- **heart_flow**: 心流功能模块
- **individuality**: 人格模块
- **plugins**: 插件模块，包含聊天、记忆、知识库等功能
  - **chat**: 聊天相关功能模块
  - **chat_module**: 聊天模块子模块，包含prompt构建等
  - **config**: 配置模块
  - **config_reload**: 配置重载模块（未完成）
  - **knowledge**: （仅new_knowledge分支）:麦麦新的记忆库模块
  - **memory_system**: 记忆系统模块，处理记忆存储与压缩
  - **message**: 消息收发与解析模块
  - **models**: 大模型通信模块
  - **moods**: 情绪处理模块
  - **person_info**: 用户信息管理模块
  - **PFC**: PFC模块
  - **remote**: 本体信息上报模块
  - **schedule**: 日程管理模块
  - **storage**: 消息与数据储存模块
  - **topic_identifier**: 主题识别模块
  - **utils**: 日志模块，统计模块，错别字生成模块
  - **willing**: 意愿计算模块
  - **zhishi**: 知识库模块，处理知识的存储与检索
- **main.py**: 主程序

### `template`
- 存放模板文件的目录。
- 项目文档目录。