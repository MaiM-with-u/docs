# 麦麦 GraphQL API 草案

## 概述

本草案是为了设计用于配置 / 监控 / 管理麦麦的 API。

## 设计原则

- 本API应该是基于 GraphQL 的
- 本API应该是简单的
- 本API应该是安全的
- 本API应该是易于维护的
- 本API应该是易于文档化的

## 认证

-  本API应该是基于Token的认证
-  除了公共 endpoint, 所有请求统一使用请求头 `Authorization: Bearer <token>` 进行认证

## 功能

### 状态概览

首先，我们需要一个接口来获取麦麦的状态概览，例如当前是否在正常运行,
当前的 Uptime, 当前的版本, 模型的 Token 消耗情况等。
