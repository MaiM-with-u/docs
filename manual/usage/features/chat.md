## HeartFChat 聊天系统：特点、流程与自定义指南

本文档围绕 `src/chat/chat_loop/heartFC_chat.py`（类 `HeartFChatting`）整理：系统特点、关键流程与涉及的信息，并提供完整的自定义扩展指南。

### 适用范围
- 了解麦麦核心聊天循环的整体工作方式
- 快速定位可扩展的“动作”“规划”“回复策略”等接入点
- 按需调整“活跃度/专注度/超时”等行为配置

---

## 系统特点

- **双模式循环（NORMAL/FOCUS）**：通过能量值 `energy_value` 与配置项 `chat.focus_value` 动态切换，FOCUS 模式下更密集地观察与回复，适合高强度对话场景。
- **可插拔动作体系**：依赖 `ActionManager` 与插件系统注册的动作（如 `reply`、`no_reply`、自定义动作），支持在回复前后或并行执行其他动作。
- **规划驱动**：`ActionPlanner` 根据当下可用动作、对话上下文与模板，规划本轮行动（回复/不回复/其他动作/并行）。
- **意愿管理与频率调度**：结合 `willing_manager` 与 `talk_frequency`，基于消息特征与时间段动态控制回复概率。
- **轻量计时与可观测性**：`Timer` 记录“动作修改/规划/生成/发送/执行”等阶段耗时，`CycleDetail` 留存循环轨迹。
- **S4U 联动**：在启用时展示“正在输入”等反馈，并在回复后进入“思考后处理”。
- **健壮的超时与降级**：对长耗时生成/规划进行超时控制（`chat.thinking_timeout`），必要时跳过或降级处理，避免阻塞。

---

## 关键流程概览

### 生命周期与主循环
- 入口：`HeartFChatting.start()` 创建并并发运行能量循环与主聊天循环。
- 主循环：`_main_chat_loop()` 不断调用 `_loopbody()`，控制 NORMAL/FOCUS 分支。
- 能量循环：`_energy_loop()` 周期性衰减能量，用于触发模式切换。

### NORMAL 模式
1. 读取新消息：按 `last_read_time` 窗口获取未读内容。
2. 判断是否需要切换到 FOCUS：
   - 新消息密度超过阈值（受 `chat.focus_value` 影响）或能量值达到上限时切换。
3. 命中消息时：调用 `normal_response(message_data)`，基于意愿系统计算回复概率，决定是否进入 `_observe()`。

### FOCUS 模式
- 在 `_loopbody()` 直接进入 `_observe()`：更密集地观察-规划-执行，消耗更多能量并维持连续对话。

### 观察-规划-执行（核心）
`_observe(message_data)` 完成一轮“思考”：
1. **动作修改**：`ActionModifier.modify_actions()` 调整当前可用动作；随后由 `ActionManager.get_using_actions()` 产出动作集合。
2. **是否直返（NORMAL 模式）**：若只剩“回复类”动作（`reply/no_reply/no_action`），跳过规划器，直接走回复链路。
3. **预生成回复（NORMAL 模式）**：未跳过规划器时，提前并发启动回复生成任务（减少总耗时）。
4. **规划器**：`ActionPlanner.plan(mode)` 综合上下文产出 `action_result`：
   - `action_type`：如 `reply`、`no_reply`、自定义动作名
   - `action_data`：动作参数（会追加 `loop_start_time`）
   - `is_parallel`：是否与回复并行
5. **执行策略**：
   - `reply`：等待生成结果→发送消息→存储动作上下文
   - 非 `reply` 且 `is_parallel=True`：并行等待“回复+动作”两个分支，并合并循环信息
   - 非 `reply` 且 `is_parallel=False`：取消预生成回复，只执行动作
6. **S4U 与思考后处理**：启用时在回复后停止“正在输入”，调用 `mai_thinking_manager` 后置思考。
7. **循环记录**：`CycleDetail` 存档本轮“规划结果 + 执行动作/回复 + 计时器”等信息，并打印摘要。

### 回复生成与发送
- 生成：`generator_api.generate_reply(...)`，可接受当前可用动作、工具开关、请求类型（NORMAL/FOCUS），返回结构化片段集。
- 发送：`_send_response(...)` 根据“思考→发送”期间新消息数量决定是否引用回复；首段不打字，后续片段带打字效果。

### 意愿系统与活跃度
- 入口：`normal_response(...)`
- 概念：
  - `willing_manager.get_reply_probability(...)` 基础回复意愿
  - `talk_frequency` 与 `talk_frequency_adjust`（按时间/会话粒度）对意愿进行缩放
  - 表情/图片消息强制设为不回复

### 计时与存档
- 计时点：
  - 动作修改（"动作修改"）
  - 规划（"规划器"）
  - 回复生成（"回复生成"）
  - 回复发送（"回复发送"）
  - 动作执行（"动作执行"）
- 存档：`database_api.store_action_info(...)` 记录“回复/动作”摘要、可视化提示文案、思考 ID 等。

---

## 关键参与对象与信息

- `ChatStream`：当前聊天流上下文，含 `stream_id`、`group_info`、模板名等。
- `message_data` 关键字段：
  - `chat_info_platform`、`user_id`、`user_platform`
  - `processed_plain_text`、`user_nickname`
  - `message_id`、`interest_value`
  - `is_emoji`、`is_picid`
  - `additional_config.maimcore_reply_probability_gain`
- `ActionManager`：提供 `create_action(...)` 工厂与 `get_using_actions()` 可用动作；内置如 `reply`、`no_reply` 等。
- `ActionPlanner`：`build_planner_prompt(...)` 生成规划提示，`plan(...)` 产出本轮行动方案。
- `willing_manager`：`before_generate_reply_handle(...)` 与 `after_generate_reply_handle(...)` 两阶段钩子。
- `expression_learner`/`relationship_builder`：在观察前触发，维护对话习惯与关系状态。
- `CycleDetail`：记录 `thinking_id`、计时器、规划与执行结果。
- `ENABLE_S4U`：启用时在输入与回复后提供更拟人的反馈。

---

## 配置项要点（`template/bot_config_template.toml`）

- `chat.focus_value`：专注能力（越高越易进入 FOCUS，能量消耗更快）
- `chat.talk_frequency`：基础活跃度（越高越频繁）
- `chat.talk_frequency_adjust`：按全局/会话维度、按时间段动态调整活跃度
- `chat.max_context_size`：上下文长度（影响提示组装）
- `chat.thinking_timeout`：单次思考最长时长（超时跳过）
- `chat.replyer_random_probability`：首选回复器被选中的概率
- `chat.mentioned_bot_inevitable_reply` / `chat.at_bot_inevitable_reply`：被提及/被@时提高回复 

所有配置最终由 `src/config/config.py` 的 `global_config` 注入到运行期。

---

## 自定义与扩展指南

本系统通过“插件 + 规划 + 动作”的方式实现强扩展性。下列路径与 API 文档可作为实现入口：

- 插件开发入口：`docs/plugins/index.md`
- 组件说明：`docs/plugins/action-components.md`、`docs/plugins/tool-components.md`、`docs/plugins/command-components.md`
- API 文档：
  - 规划/聊天：`docs/plugins/api/chat-api.md`、`docs/plugins/api/generator-api.md`
  - 动作/工具：`docs/plugins/api/tool-api.md`、`docs/plugins/api/component-manage-api.md`
  - 发送/消息：`docs/plugins/api/send-api.md`、`docs/plugins/api/message-api.md`

### 1) 新增一个“动作”（Action）
场景：在回复前后做额外事情（发图、查询、调用外部系统等）。

步骤要点：
1. 新建插件包（可参考 `src/plugins/built_in/core_actions`）。
2. 在插件中注册一个动作组件，提供处理器类（通常继承基础动作类，需实现 `handle_action()` 协程，返回 `(success: bool, reply_text: str)`）。
3. 通过 `ActionManager` 的注册机制（由插件系统在启动时完成）使之出现在可用动作集合中。
4. 在规划器 Prompt 或策略中让该动作被选择（可依据上下文/意图/权限）。

提示：系统会把 `action_data`（含 `loop_start_time` 等）与 `chat_stream`、`thinking_id` 一并传入处理器，便于回溯与存档。

### 2) 定制规划策略（Planner）
场景：改变“何时回复/选择哪个动作/是否并行”的策略。

方式：
- 修改/扩展 `ActionPlanner` 的 Prompt 组装逻辑（`build_planner_prompt(...)`）与 `plan(...)` 策略。
- 使用 `events_manager` 的 `EventType.ON_PLAN` 事件在规划前注入环境信息或日志。
- 结合可用动作集合的改写（`ActionModifier.modify_actions()`）实现“先裁剪再规划”。

### 3) 自定义回复生成（Replyer）
场景：替换/新增回复器模型、调整分片、控制工具调用。

方式：
- 通过 `generator_api.generate_reply(...)` 对接你自定义的生成器（参考 `docs/plugins/api/generator-api.md`）。
- 使用 `request_type` 区分 NORMAL / FOCUS 的不同策略/Prompt。
- 借助 `global_config.tool.enable_tool` 控制是否在生成阶段启用“工具调用”。

### 4) 调整回复概率与频率
场景：希望在不同时间/会话维度改变“能说会道”的程度。

方式：
- `chat.talk_frequency`：改基础活跃度
- `chat.talk_frequency_adjust`：对不同会话或全天时段做分段曲线
- `willing_manager`：按消息类型/上下文特征进一步修正意愿

### 5) 专注切换与能量曲线
场景：更早或更晚进入 FOCUS、更快或更慢耗能。

方式：
- `chat.focus_value`：增大更易进入 FOCUS，但能量消耗更快
- `_loopbody()` 中 NORMAL→FOCUS 切换逻辑可按需修改阈值与增长曲线
- `_energy_loop()` 中 NORMAL/FOCUS 的衰减速率可调整

### 6) 引用回复与打字体验
场景：控制什么时候“引用回复”、是否显示“正在输入”。

方式：
- `_send_response(...)` 中 `new_message_count` 与随机门限控制“引用回复”的开启
- 启用 S4U（`ENABLE_S4U`）后，在 `_observe()` 中自动显示/关闭“正在输入”，增强体验

### 7) 超时与容错
场景：
- 大模型响应慢导致超时
- 动作执行异常

方式：
- 配置 `chat.thinking_timeout`；系统在 `generate_reply` 和并行场景中进行 `asyncio.wait_for` 超时保护
- 若连续超时，系统会打印告警并建议排查 API 性能或提高超时阈值
- 异常均被捕获记录，保证主循环可恢复

---

## 最佳实践建议

- 将“动作修改 → 规划 → 执行/回复”保持解耦：动作尽量纯粹完成单一职责，避免耦合到规划器逻辑。
- 善用 `CycleDetail` 与计时器，持续观察时延分布，定位瓶颈（规划、生成、发送或动作）。
- 在插件中引入必要的结构化 `action_data`，便于 `store_action_info` 可视化与问题追踪。
- 对外部依赖（网络/存储/第三方 API）做好超时与错误处理，避免阻塞主循环。

---

## 相关文件与入口

- 主体实现：`src/chat/chat_loop/heartFC_chat.py`
- 规划器：`src/chat/planner_actions/planner.py`
- 动作管理：`src/chat/planner_actions/action_manager.py`、`src/chat/planner_actions/action_modifier.py`
- 愿意系统：`src/chat/willing/willing_manager.py`
- 生成与发送：`src/plugin_system/apis/generator_api.py`、`src/plugin_system/apis/send_api.py`
- 配置：`src/config/config.py`、`template/bot_config_template.toml`
- 插件文档：`docs/plugins/`

---

## 变更影响面

- 文档仅描述与定位扩展点，不改变任何运行逻辑。
- 若按本指南定制：请为新动作/生成器提供充分的异常/超时处理，并在测试环境验证耗时与正确性。


