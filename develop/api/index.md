# MaiBot API 参考

MaiBot提供了GraphQL API，允许开发者以编程方式与机器人交互，获取信息，并控制机器人的行为。本文档提供了API的完整参考。

## API 概述

MaiBot API 使用GraphQL，这是一种灵活的API查询语言，允许客户端精确指定所需的数据。与传统的REST API相比，GraphQL提供了更高的效率和灵活性。

### 基本概念

- **查询(Query)**: 用于获取数据
- **变更(Mutation)**: 用于修改数据
- **订阅(Subscription)**: 用于实时获取数据更新

## 身份验证

所有API请求都需要身份验证。MaiBot使用基于令牌的身份验证系统。

```bash
Authorization: Bearer YOUR_API_TOKEN
```

您可以在机器人管理页面生成API令牌。

## API端点

GraphQL API的主要端点是:

```
https://your-maimbot-instance.com/api/graphql
```

## 常用查询

### 获取机器人状态

```graphql
query {
  botStatus {
    name
    status
    uptime
    memory {
      total
      used
    }
    groups {
      count
      active
    }
  }
}
```

### 获取历史对话

```graphql
query {
  conversations(groupId: "123456789", limit: 10) {
    id
    timestamp
    sender {
      id
      name
    }
    content
    type
  }
}
```

### 获取表情包集合

```graphql
query {
  emojis(limit: 20, offset: 0) {
    id
    url
    tags
    usageCount
    addedDate
  }
}
```

## 常用变更

### 发送消息

```graphql
mutation {
  sendMessage(
    groupId: "123456789", 
    content: "Hello from API!", 
    type: "TEXT"
  ) {
    success
    messageId
    timestamp
  }
}
```

### 更新机器人配置

```graphql
mutation {
  updateConfig(
    config: {
      name: "MaiM",
      personality: "FRIENDLY",
      responseLength: "MEDIUM"
    }
  ) {
    success
    message
  }
}
```

### 清除记忆

```graphql
mutation {
  clearMemory(
    type: "CONVERSATION",
    groupId: "123456789"
  ) {
    success
    message
  }
}
```

## 订阅

### 新消息订阅

```graphql
subscription {
  newMessage(groupIds: ["123456789"]) {
    id
    groupId
    sender {
      id
      name
    }
    content
    timestamp
  }
}
```

### 状态变更订阅

```graphql
subscription {
  botStatusChange {
    status
    timestamp
    reason
  }
}
```

## 错误处理

API错误将返回标准的GraphQL错误格式：

```json
{
  "errors": [
    {
      "message": "错误描述",
      "locations": [{"line": 2, "column": 3}],
      "path": ["conversations", 0, "content"],
      "extensions": {
        "code": "ERROR_CODE",
        "details": "详细错误信息"
      }
    }
  ]
}
```

## 限流政策

API使用基于令牌桶的限流机制：

- 每分钟60个请求
- 每小时1000个请求
- 每天10000个请求

超过限制会返回429错误。

## SDK和客户端

我们提供以下语言的官方SDK：

- JavaScript/TypeScript
- Python
- Java
- Go

有关使用SDK的更多信息，请参阅[开发者指南](/develop/guide/ai-instruction)。

## API变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2023-01-15 | 初始API发布 |
| v1.1 | 2023-03-22 | 添加表情包管理API |
| v1.2 | 2023-06-10 | 添加实时订阅支持 |
| v1.3 | 2023-09-05 | 改进错误处理和文档 |