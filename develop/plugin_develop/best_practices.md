# 最佳实践

本文档提供了MaiBot插件开发的最佳实践，帮助你编写高质量、高性能、用户友好的插件。

## 代码组织

### 1. 清晰的描述和文档

```python
action_name = "search_action"
action_description = "搜索互联网获取信息，支持多种搜索引擎"

action_parameters = {
    "query": "搜索关键词",
    "engine": "搜索引擎（可选，默认为google）"
}

action_require = [
    "需要搜索信息时",
    "查询事实或数据时"
]
```

- 使用清晰的`action_description`描述功能
- 使用`action_parameters`定义所需参数
- 使用`action_require`描述使用场景

### 2. 模块化设计

```python
class SearchAction(PluginAction):
    # 配置和主要逻辑...
    
    async def _perform_search(self, query, engine):
        # 搜索逻辑封装在单独的方法中
        pass
        
    async def _format_results(self, results):
        # 结果格式化逻辑
        pass
```

- 将复杂逻辑拆分为多个方法
- 单一职责原则，每个方法只做一件事
- 便于测试和维护

### 3. 日志记录

```python
logger = get_logger("search_action")

async def process(self):
    logger.info(f"{self.log_prefix} 开始处理搜索请求")
    
    try:
        # 处理逻辑...
        logger.debug(f"{self.log_prefix} 搜索参数: {query}, 引擎: {engine}")
        
        # 更多处理...
        logger.info(f"{self.log_prefix} 搜索完成，找到 {len(results)} 条结果")
        return True, "搜索完成"
    except Exception as e:
        logger.error(f"{self.log_prefix} 搜索失败: {e}", exc_info=True)
        return False, f"搜索失败: {str(e)}"
```

- 使用适当的日志级别（debug, info, warning, error）
- 记录关键操作和参数
- 包含异常信息和上下文
- 使用`self.log_prefix`便于追踪

### 4. 错误处理

```python
async def process(self):
    try:
        # 参数验证
        query = self.action_data.get("query", "")
        if not query:
            return False, "搜索关键词不能为空"
            
        # 业务逻辑
        try:
            results = await self._perform_search(query, engine)
        except ConnectionError:
            return False, "网络连接失败，请稍后再试"
        except TimeoutError:
            return False, "搜索超时，请尝试简化关键词"
        
        return True, self._format_results(results)
    except Exception as e:
        logger.error(f"{self.log_prefix} 未预期的错误: {e}", exc_info=True)
        return False, "处理过程中发生错误"
```

- 进行参数验证
- 捕获并处理特定异常
- 提供友好的错误消息
- 最外层捕获未预期的异常

## 性能优化

### 1. 激活类型选择

```python
# 高性能配置
focus_activation_type = ActionActivationType.KEYWORD
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["搜索", "查找", "search"]

# 智能但性能较低的配置
focus_activation_type = ActionActivationType.LLM_JUDGE
normal_activation_type = ActionActivationType.KEYWORD
```

- **ALWAYS**：仅用于基础必需动作
- **KEYWORD**：明确的命令式动作，性能最佳
- **LLM_JUDGE**：复杂判断，仅在Focus模式使用
- **RANDOM**：娱乐功能，低概率触发

### 2. 异步处理

```python
async def process(self):
    # 并发执行多个异步操作
    results = await asyncio.gather(
        self._fetch_data_from_source_a(query),
        self._fetch_data_from_source_b(query),
        return_exceptions=True
    )
    
    # 处理结果...
    return True, "处理完成"
```

- 使用`asyncio.gather`并发执行多个操作
- 避免阻塞主事件循环
- 合理使用超时机制

### 3. 缓存机制

```python
class SearchAction(PluginAction):
    # 类级别缓存
    _cache = {}
    _cache_expiry = {}
    
    async def process(self):
        query = self.action_data.get("query", "")
        cache_key = f"{query}:{engine}"
        
        # 检查缓存
        current_time = time.time()
        if cache_key in self._cache and self._cache_expiry[cache_key] > current_time:
            logger.info(f"{self.log_prefix} 使用缓存结果")
            return True, self._cache[cache_key]
            
        # 执行搜索
        result = await self._perform_search(query, engine)
        
        # 更新缓存
        self._cache[cache_key] = result
        self._cache_expiry[cache_key] = current_time + 3600  # 1小时过期
        
        return True, result
```

- 实现简单的内存缓存
- 设置合理的过期时间
- 对频繁请求的数据进行缓存

### 4. 资源控制

```python
async def process(self):
    # 限制并发请求数
    async with self._semaphore:
        # 设置超时
        try:
            async with asyncio.timeout(10):  # Python 3.11+
                result = await self._perform_search(query)
                return True, result
        except asyncio.TimeoutError:
            return False, "搜索超时，请稍后再试"
```

- 使用信号量限制并发数
- 设置操作超时
- 避免资源耗尽

## 用户体验

### 1. 友好的消息

```python
async def process(self):
    # 开始搜索前发送状态
    await self.send_message_by_expressor(f"正在搜索「{query}」，请稍等...")
    
    # 执行搜索
    results = await self._perform_search(query, engine)
    
    if not results:
        return True, f"没有找到关于「{query}」的结果，请尝试其他关键词"
    
    # 格式化结果
    formatted_results = self._format_results(results)
    return True, formatted_results
```

- 提供操作状态反馈
- 处理空结果情况
- 使用引号突出关键词

### 2. 进度反馈

```python
async def process(self):
    # 长时间操作的进度反馈
    await self.send_message(type="text", data="开始处理图像...")
    
    # 第一阶段
    await self.send_message(type="text", data="(1/3) 下载图像中...")
    image_data = await self._download_image(url)
    
    # 第二阶段
    await self.send_message(type="text", data="(2/3) 处理图像中...")
    processed_image = await self._process_image(image_data)
    
    # 第三阶段
    await self.send_message(type="text", data="(3/3) 生成结果中...")
    result = await self._generate_result(processed_image)
    
    return True, "处理完成！"
```

- 分阶段提供进度反馈
- 对长时间操作尤为重要
- 避免用户等待无反馈

### 3. 参数验证和默认值

```python
async def process(self):
    # 获取参数并提供默认值
    query = self.action_data.get("query", "").strip()
    engine = self.action_data.get("engine", "google").lower()
    max_results = int(self.action_data.get("max_results", "5"))
    
    # 参数验证
    if not query:
        return False, "请提供搜索关键词"
        
    # 参数规范化
    if engine not in ["google", "bing", "baidu"]:
        engine = "google"  # 使用默认引擎
        
    if max_results > 10:
        max_results = 10  # 限制最大结果数
    
    # 处理逻辑...
```

- 提供合理的默认值
- 进行参数验证和规范化
- 限制参数范围，防止滥用

### 4. 适应不同场景

```python
async def process(self):
    # 检查聊天类型
    chat_type = self.get_chat_type()
    
    # 根据场景调整行为
    if chat_type == "group":
        # 群聊中简化输出
        max_results = 3
        include_details = False
    else:
        # 私聊中提供详细信息
        max_results = 5
        include_details = True
    
    # 处理逻辑...
    results = await self._perform_search(query, max_results)
    
    # 根据场景格式化结果
    if include_details:
        return True, self._format_detailed_results(results)
    else:
        return True, self._format_simple_results(results)
```

- 区分群聊和私聊场景
- 根据场景调整行为和输出
- 提供最适合当前环境的体验

## 安全性考虑

### 1. 输入验证

```python
async def process(self):
    # 获取并清理输入
    query = self.action_data.get("query", "")
    query = query.strip()
    
    # 基本验证
    if not query:
        return False, "搜索关键词不能为空"
    
    # 长度限制
    if len(query) > 100:
        return False, "搜索关键词过长，请简化后重试"
    
    # 敏感内容过滤（示例）
    if any(word in query.lower() for word in ["hack", "crack", "exploit"]):
        return False, "搜索内容包含敏感词，请修改后重试"
    
    # 处理逻辑...
```

- 清理和验证所有输入
- 实施长度限制
- 过滤敏感内容

### 2. 权限检查

```python
async def process(self):
    # 获取用户信息
    platform, user_id = await self.get_user_id_by_person_name(sender)
    
    # 检查权限（示例）
    if self._is_admin_command(command) and not await self._is_admin(platform, user_id):
        return False, "你没有执行此操作的权限"
    
    # 处理逻辑...
```

- 对敏感操作进行权限检查
- 区分管理员和普通用户
- 记录敏感操作的执行

## 测试与调试

### 1. 调试日志

```python
# 开发时启用详细日志
logger.debug(f"{self.log_prefix} 参数: {self.action_data}")
logger.debug(f"{self.log_prefix} 中间结果: {intermediate_result}")
```

- 使用debug级别记录详细信息
- 记录输入参数和中间结果
- 便于排查问题

### 2. 健壮性测试

```python
# 处理各种边缘情况
async def process(self):
    query = self.action_data.get("query", "")
    
    # 空输入
    if not query:
        return False, "请提供搜索关键词"
    
    # 极长输入
    if len(query) > 1000:
        return False, "搜索关键词过长"
    
    # 特殊字符
    query = self._sanitize_query(query)
    
    # 处理逻辑...
```

- 测试空输入、极长输入、特殊字符等
- 测试网络错误、超时等异常情况
- 确保插件在各种情况下都能优雅处理

通过遵循这些最佳实践，你可以开发出高质量、高性能、用户友好的MaiBot插件，提供更好的用户体验。 