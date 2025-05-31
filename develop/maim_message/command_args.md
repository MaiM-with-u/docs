# MaiBot 支持发送的命令参数表

## 禁言某人
```python
Seg.data: Dict[str, Any] = {
    "name": "GROUP_BAN"
    "args": {
        "qq_id": "用户QQ号",
        "duration": "禁言时长（秒）"
    },
}
```

其中，群聊ID将会通过Group_Info.group_id自动获取。