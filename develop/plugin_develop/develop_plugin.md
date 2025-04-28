# Adapter 开发指南

首先，你应该安装与麦麦的标准通信库：[maim_message](https://github.com/MaiM-with-u/maim_message)

```shell
pip install maim_message
```

详细的maim_message库解析在[maim_message 文档](/develop/maim_message/index)中

你的Adapter应该实现上游消息的接收，处理与下游消息的构建。即实现 外部程序&harr;Adapter 与 Adapter&harr;MaiBot Core 的消息传递和处理。本指南将会介绍如何实现Adapter和MaiBot Core的通信部分。

*注：实际上，不同的Adapter之间的通信也可以使用maim_message库进行通信并进行消息处理，但本指南不涉及这部分内容。具体请参考[maimbot_tts_adapter](https://github.com/tcmofashi/maimbot_tts_adapter)和[MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter)的实现。*

Adapter的工作流程如下：
1. 接收上游消息（本指南不涉及）
2. 处理上游消息，构造下游消息的元数据
3. 处理上游消息，构造下游消息的内容
4. 构造最终消息体并发送
5. 解析返回的消息

接下来，本指南将会介绍如何实现Adapter与MaiBot Core的通信部分。

## 构造下游消息元数据

这部分将会使用`maim_message`库中的`MessageBaseInfo`类来构造下游消息的元数据。

`platform`字段，你应该用这个字段标识消息的来源平台，同时作为adapter的标识符号。

`message_id`字段，这个id可以是你生成的，也可以是从其他平台所返回的。本字段的目的主要是告诉MaiBot Core你的消息编号，使得MaiBot Core发出Seg为reply的消息时便于Adapter进行定位。

`time`字段，这部分为了保证消息的顺序，应该使用float类型的Unix时间戳。

`group_info`和`user_info`字段，这两个字段分别表示群组信息和用户信息。本部分将在下面进行详细介绍。

`format_info`字段，这部分用于标识Adapter可以发送和接受的消息格式。

`template_info`字段，可选。

`additional_config`字段，这部分用于传递一些额外的配置。详细参考 [maim_message 文档的相关部分](/develop/maim_message/message_base#class-basemessageinfo)。

构造示例：
```python
message_info = BaseMessageInfo(
        platform="my_platform_instance_1",
        message_id="12345678",
        time=1234567.001,
        group_info=group_info,
        user_info=user_info,
        format_info=format_info,
        template_info=None,
        additional_config=None
    )
```

下面详细介绍部分字段的构造

### group_info字段的构造
**对于私聊消息**，`MessageBaseInfo`的`group_info`字段应该设置为`None`。

**对于群聊消息**，`group_info`字段应该进行如下构建：

`platform`字段的值应该与`MessageBaseInfo`类中的`platform`字段一致。

`group_id`字段的值应该是消息所在的群组的ID。

`group_name`字段的值应该是消息所在的群组的名称。这部分是可选的。

随后将`group_info`字段传入`MessageBaseInfo`类中。

构建示例：
```python
# 当为群聊时
group_info = GroupInfo(
    platform = "my_platform_instance_1",
    group_id = "123456",
    group_name = "测试群组"
)
# 当为私聊时
group_info = None
```

### user_info字段的构造
这部分无论私聊还是群聊都应该进行构造

`platform`字段的值应该与`MessageBaseInfo`类中的`platform`字段一致。

`user_id`字段的值应该是消息发送者的ID。

`user_nickname`字段的值应该是消息发送者的昵称/用户名。这部分是可选的。

`user_cardname`字段的值应该是消息发送者的备注名/群昵称。这部分是可选的。

构造示例：
```python
user_info = UserInfo(
    platform = "my_platform_instance_1",
    user_id = "123456",
    user_nickname = "测试用户",
    user_cardname = "测试用户的群昵称"
)
```

### format_info字段的构造
这部分标识Adapter可以发送和接受的消息格式。实际内容请参考[maim_message 文档的相关部分](/develop/maim_message/message_base#class-formatinfo)。

构造示例：
```python
format_info = FormatInfo(
    content_format=["text", "image"],  # 可发送的格式
    accept_format=["text", "image"]   # 可接收的格式
)
```


## 构造下游消息的内容

本部分是必填的部分，是一个Seg包装的消息体。

在本部分进行构造时候，你应该将对应的消息转换为 maim_message 可以使用的格式后进行传参，详细参考[maim_message 文档的相关部分](/develop/maim_message/message_base#class-seg)

这一部分的消息可以使用`Seg`类的`seglist`类型进行递归构造，在 MaiBot Core 解析时会进行扁平化处理。

构造示例：
```python
submit_seg = Seg(
    type = "seglist",
    data = [
        Seg(
            type = "text",
            data = "测试文本"
        ),
        Seg(
            type = "image",
            data = "base64://some_base64_string"
        )
    ]
)
```

## 构造最终发送的消息
本部分使用`MessageBase`类进行构造。
构造示例：
```python
message = MessageBase(
    message_info=message_info,  # 上面构造的消息元数据
    message_segment=submit_seg,  # 上面构造的消息体
    raw_message=None
)
```

## 构造路由进行消息的发送和接收
本部分使用`maim_message`库中的`Router`类进行路由的构造和消息的发送和接收。

1. 首先构造一个`RouteConfig`类的实例，传入你需要连接的所有平台的配置。

构造示例：
```python
route_config = RouteConfig(
    route_config={
        # "platform_name" 是自定义的标识符，用于区分不同连接
        "my_platform_instance_1": TargetConfig(
            url="ws://127.0.0.1:8000/ws", # MaimCore 或目标服务器的地址
            token=None, # 如果服务器需要 Token 认证，填写此字段
        ),
        # 可以配置多个连接
        # "another_platform": TargetConfig(...)
    }
)
```
2. 然后使用刚刚构建的route_config,从类Router创建路由器实例router
```python
router = Router(route_config)
```
3. 首先实现你的消息处理器，它应该是一个异步函数，详细请参考[maim_message-messagebase](/develop/maim_message/message_base#class-messagebase)，此函数可以通过调用`from_dict`方法将字典格式的消息转换为`MessageBase`对象。
4. 然后使用`router.register_class_handler()`方法注册你的消息处理器。
```python
router.register_class_handler(message_handler)
```
5. 运行路由器，开始接收消息。

## 解析返回的消息
你的消息处理器应该是一个异步函数，接收一个字典作为参数。

你可以使用 MessageBase 的 from_dict 方法将对应的字典转换为 MessageBase 对象后进行解析。

解析完成后，你应该将消息发送到对应的平台。

## 完整的示例
```python
import asyncio
import time
from maim_message import (
    BaseMessageInfo, UserInfo, GroupInfo, MessageBase, Seg,
    Router, RouteConfig, TargetConfig
)

# 1. 定义连接目标 (例如 MaimCore)
route_config = RouteConfig(
    route_config={
        # "platform_name" 是自定义的标识符，用于区分不同连接
        "my_platform_instance_1": TargetConfig(
            url="ws://127.0.0.1:8000/ws", # MaimCore 或目标服务器的地址
            token=None, # 如果服务器需要 Token 认证
        ),
        # 可以配置多个连接
        # "another_platform": TargetConfig(...)
    }
)

# 2. 创建 Router 实例
router = Router(route_config)

# 3. 定义如何处理从 MaimCore 收到的消息
async def handle_response_from_maimcore(message: MessageBase):
    """处理 MaimCore 回复的消息"""
    print(f"收到来自 MaimCore ({message.message_info.platform}) 的回复: {message.message_segment}")
    # 在这里添加将消息发送回原始平台（如QQ、Discord等）的逻辑
    # ...

# 4. 注册消息处理器
# Router 会自动将从对应 platform 收到的消息传递给注册的处理器
router.register_class_handler(handle_response_from_maimcore)

# 5. 构造要发送给 MaimCore 的消息
def construct_message_to_maimcore(platform_name: str, user_id: int, group_id: int, text_content: str) -> MessageBase:
    """根据平台事件构造标准 MessageBase"""
    user_info = UserInfo(platform=platform_name, user_id=user_id)
    group_info = GroupInfo(platform=platform_name, group_id=group_id)
    message_info = BaseMessageInfo(
        platform=platform_name,
        message_id="some_unique_id_from_platform", # 平台消息的原始ID
        time=time.time(), # 当前时间戳
        user_info=user_info,
        group_info=group_info,
    )
    message_segment = Seg("seglist", [
        Seg("text", text_content),
        # 可以添加其他 Seg, 如 Seg("image", "base64data...")
    ])
    return MessageBase(message_info=message_info, message_segment=message_segment)

# 6. 运行并发送消息
async def run_client():
    # 启动 Router (它会自动尝试连接所有配置的目标，并开始接收消息)
    # run() 通常是异步阻塞的，需要 create_task
    router_task = asyncio.create_task(router.run())
    print("Router 正在启动并尝试连接...")

    # 等待连接成功 (实际应用中需要更健壮的连接状态检查)
    await asyncio.sleep(2)
    print("连接应该已建立...")

    # 构造并发送消息
    platform_id = "my_platform_instance_1"
    msg_to_send = construct_message_to_maimcore(
        platform_name=platform_id,
        user_id=12345,
        group_id=98765,
        text_content="你好 MaimCore！"
    )
    print(f"向 {platform_id} 发送消息...")
    await router.send_message(msg_to_send)
    print("消息已发送。")

    # 让 Router 持续运行 (或者根据需要停止)
    # await router_task # 这会阻塞直到 router 停止

    # 示例：运行一段时间后停止
    await asyncio.sleep(5)
    print("准备停止 Router...")
    await router.stop()
    print("Router 已停止。")
    # 等待任务完成
    try:
        await router_task
    except asyncio.CancelledError:
        print("Router 任务已被取消。")


if __name__ == "__main__":
    try:
        asyncio.run(run_client())
    except KeyboardInterrupt:
        print("用户中断。")
    # 注意：实际适配器中，Router 的启动和消息发送/接收会集成到适配器的主事件循环中。
```