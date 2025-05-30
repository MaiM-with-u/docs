# aiBot 配置与安装简介

## 配置文件

MaiBot 使用以下两个主要配置文件：

1. **`.env`** - 环境配置文件，包含 API 密钥信息。
2. **`bot_config.toml`** - 机器人行为配置文件，包含机器人的名称、性格设定及功能开关。

为了让MaiBot连接上qq等其他平台，你还需要编辑对应的适配器的配置文件

## 配置文件详细说明

[bot_config配置教程](./configuration_standard)

[.env配置教程](./configuration_env_standard.md)

## 知识库导入要求

MaiBot 支持通过 OpenIE 技术导入知识库。文件命名需以 `-openie.json` 结尾，具体要求请参考 [LPMM 知识库导入要求](./lpmm_knowledge_template)。

## 常见问题

如果在配置过程中遇到问题，请参考 [常见问题](/faq/) 寻求解决方案。
