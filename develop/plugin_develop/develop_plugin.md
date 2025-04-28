# Adapter 开发指南

首先，你应该安装与麦麦的标准通信库：[maim_message](https://github.com/MaiM-with-u/maim_message)

```shell
pip install maim_message
```

详细的maim_message库解析在[maim_message 文档](/develop/maim_message/index)中

你的Adapter应该实现上游消息的接收，处理与下游消息的构建。即实现外部程序&harr;Adapter与Adapter&harr;MaiBot Core的消息传递和处理。本指南将会介绍如何实现Adapter和MaiBot Core的通信部分。

*注：实际上，不同的Adapter之间的通信也可以使用maim_message库进行通信并进行消息处理，但本指南不涉及这部分内容。具体请参考[maimbot_tts_adapter](https://github.com/tcmofashi/maimbot_tts_adapter)和[MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter)的实现。*

Adapter的工作流程如下：
1. 接收上游消息（本指南不涉及）
2. 处理上游消息，构造下游消息的元数据
3. 处理上游消息，构造下游消息的内容
4. 构造最终消息体并发送
5. 解析返回的消息

接下来，本指南将会介绍如何实现Adapter与MaiBot Core的通信部分。

## 构造下游消息元数据



<!--
接收到上游（即其他程序）来的消息后，消息按照类型进行处理，进入构造消息部分

由于最后发送给 MaiBot Core 的为一个 [MessageBase](/develop/maim_message/message_base) 对象，因此我们首先进行分级构造

### MessageBaseInfo 构造

```python
message_info = BaseMessageInfo(
        # 必填
        platform=platform,
        message_id="12345678",  # 只会在reply和撤回消息等功能下启用，且可以不保证unique
        time=1234567.001,  # 时间戳
        group_info=group_info,
        user_info=user_info,
        # 选填和暂未启用
        format_info=format_info,
        template_info=None,
        additional_config={
            "maimcore_reply_probability_gain": 0.5  # 回复概率增益
        },
    )

```

MesageBaseInfo 中，必填的字段有`platform`，`message_id`，`time`，`group_info`，`user_info`，`format_info`。

`platform`为平台名称，`message_id`为消息ID，`time`为时间戳，`group_info`为群组信息，`user_info`为用户信息，`format_info`为格式信息。

其中`group_info`在私聊或者某些情况下可设置为`None`

### message_segment 构造

暂时略

### raw_message 构造

本部分是可选的部分，raw_message 是一个字符串，表示原始消息内容。（现在无效果）

## 构造消息客户端

maim_message使用内置的router作为路由类进行路由，负责下游消息的发送和接收

```python
# 配置路由config 
# 从RouteConfig类构建route_config实例
route_config = RouteConfig( 
    # 略
)
# 使用刚刚构建的route_config,从类Router创建路由器实例router
router = Router(route_config)

async def main():
    # 使用实例router的方法注册消息处理器
    router.register_class_handler(message_handler) #message_handler示例见下方

    try:
        # 启动路由器（会自动连接所有配置的平台）
        router_task = asyncio.create_task(router.run())

        # 等待连接建立
        await asyncio.sleep(2)

        # 使用router.send_message()方法发送消息
        await router.send_message(construct_message("test"))

        # 保持运行直到被中断
        await router_task

    finally:
        print("正在关闭连接...")
        await router.stop()
        print("已关闭所有连接")

async def message_handler(message):
    """
    一个作为示例的消息处理函数
    从mmc发来的消息将会进入此函数
    你需要解析消息，并且向指定平台捏造合适的消息发送
    如将mmc的MessageBase消息转换为onebotV11协议消息发送到QQ
    或者根据其他协议发送到其他平台
    """
    print(f"收到消息: {message}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass  # 让asyncio.run处理清理工作
```

从 MaiBot Core 发送过来的消息同样也是`MessageBase`类，你可以使用`MessageBase.from_dict(raw_message_base_dict)`方法将其转换为`MessageBase`对象

在上面的示例中，向 MaiBot Core 发送消息的方式是`router.send_message()`，函数的参数是你构造的`MessageBase`对象

而接收 MaiBot Core 发送过来的消息的方式是`router.register_class_handler()`，函数的参数是你定义的消息处理函数

你的消息处理函数应该是一个异步函数，接收一个`MessageBase`对象作为参数

-->