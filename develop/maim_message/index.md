# maim_message 文档

`maim_message` 是一个为 [MaiBot](https://github.com/MaiM-with-u/MaiBot) 生态系统设计的 Python 库，旨在提供一套标准化的消息格式定义和基于 WebSocket 的通信机制。它的核心目标是解耦 MaiBot 的各个组件（如核心服务 `maimcore`、平台适配器 `Adapter`、插件 `Plugin` 等），使得它们可以通过统一的接口进行交互，从而简化开发、增强可扩展性并支持多平台接入。

## 目录
- [message_base](./message_base) Maim_Message 的基础消息格式定义
- [router](./router) Maim_Message的消息路由
- 暂时略