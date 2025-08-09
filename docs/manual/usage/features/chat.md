---
title: 聊天系统
---

# 聊天系统

本页介绍麦麦的聊天系统特性、配置要点与常见问题。

## 功能概览

- 触发机制：支持基于关键词、@、上下文记忆等多种方式触发回复。
- 频率控制：结合发言间隔、群聊活跃度、节流与去重策略，避免刷屏。
- 上下文管理：结合对话窗口与记忆系统，提供连续对话体验。
- 表情与扩展：可结合表情/表情包与插件能力增强互动性。

## 基本配置

以下为常见的与聊天系统相关的配置入口与文档：

- 记忆系统：参见 [`/manual/usage/features/memory`](../features/memory.md)
- 个性化人格：参见 [`/manual/usage/features/personality`](../features/personality.md)
- 表情与 Emoji：参见 [`/manual/usage/features/emoji`](../features/emoji.md)
- 表达行为：参见 [`/manual/usage/features/expression`](../features/expression.md)
- LPMM 能力：参见 [`/manual/usage/features/lpmm`](../features/lpmm.md)

## 使用建议

- 根据群聊规模调整触发阈值与冷却时间，避免过度发言。
- 开启必要的去重与节流策略，减少无效触发。
- 结合人格与记忆配置，确保回复风格一致、信息准确。

## 常见问题

1. 无响应或响应过多：检查触发规则、冷却时间与关键词是否冲突。
2. 语境错乱：确认记忆开关与上下文长度是否合适，避免上下文过长或过短。
3. 表情不生效：确保对应表情/插件已启用且权限正确。

如需更深入的开发与调优，请参考：

- 开发指南：`/docs/develop/index`
- 插件能力：`/docs/develop/plugin_develop/index`


