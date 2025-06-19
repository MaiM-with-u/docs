# MaiBot插件开发文档

> 欢迎来到MaiBot插件系统开发文档！这里是你开始插件开发旅程的最佳起点。

## 新手入门

- [📖 快速开始指南](quick-start.md) - 5分钟创建你的第一个插件

## 组件功能详解

- [🧱 Action组件详解](action-components.md) - 掌握最核心的Action组件
- [💻 Command组件详解](command-components.md) - 学习直接响应命令的组件
- [⚙️ 配置管理指南](configuration-guide.md) - 学会使用自动生成的插件配置文件
- [📄 Manifest系统指南](manifest-guide.md) - 了解插件元数据管理和配置架构

## API浏览

### 消息发送与处理API
- [📤 发送API](api/send-api.md) - 各种类型消息发送接口
- [消息API](api/message-api.md) - 消息获取，消息构建，消息查询接口
- [聊天流API](api/chat-api.md) - 聊天流管理和查询接口

### AI与生成API  
- [LLM API](api/llm-api.md) - 大语言模型交互接口，可以使用内置LLM生成内容
- [✨ 回复生成器API](api/generator-api.md) - 智能回复生成接口，可以使用内置风格化生成器

### 表情包api
- [😊 表情包API](api/emoji-api.md) - 表情包选择和管理接口

### 关系系统api
- [人物信息API](api/person-api.md) - 用户信息，处理麦麦认识的人和关系的接口

### 数据与配置API
- [🗄️ 数据库API](api/database-api.md) - 数据库操作接口
- [⚙️ 配置API](api/config-api.md) - 配置读取和用户信息接口

### 工具API
- [工具API](api/utils-api.md) - 文件操作、时间处理等工具函数


## 实验性

这些功能将在未来重构或移除
- [🔧 工具系统详解](tool-system.md) - 工具系统的使用和开发



## 支持

> 如果你在文档中发现错误或需要补充，请：

1. 检查最新的文档版本
2. 查看相关示例代码
3. 参考其他类似插件
4. 提交文档仓库issue
