# MaiBot GoCQ Adapter 文档

## 安装
猫猫觉得，安装这个适配器非常简单，只需要从 GitHub 上的[Repo](https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter)下载适配器文件，然后安装依赖，使用相应的环境启动即可。
```bash
git clone https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter
cd MaiBot-Gocq-Adapter
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
python main.py
```
## 配置
适配器的配置文件为 `config.toml`，你可以根据自己的需要进行修改。

```toml
[Nickname] # 现在没用
nickname = ""

[Napcat_Server] # gocq连接的ws服务设置
host = "localhost" # gocq设定的主机地址
port = 8080        # gocq设定的端口
heartbeat = 30     # 与gocq设置的心跳相同（按秒计）

[MaiBot_Server] # 连接麦麦的ws服务设置
platform_name = "qq" # 标识adapter的名称（必填）
host = "localhost"   # 麦麦在.env文件中设置的主机地址，即HOST字段
port = 8099          # 麦麦在.env文件中设置的端口，即PORT字段

[Chat] # 黑白名单功能
group_list_type = "blacklist" # 群组名单类型，可选为：whitelist, blacklist
group_list = [] # 群组名单
# 当group_list_type为whitelist时，只有群组名单中的群组可以聊天
# 当group_list_type为blacklist时，群组名单中的任何群组无法聊天
private_list_type = "blacklist" # 私聊名单类型，可选为：whitelist, blacklist
private_list = [] # 私聊名单
# 当private_list_type为whitelist时，只有私聊名单中的用户可以聊天
# 当private_list_type为blacklist时，私聊名单中的任何用户无法聊天
ban_user_id = [] # 全局禁止名单（全局禁止名单中的用户无法进行任何聊天）
enable_poke = true # 是否启用戳一戳功能

[Voice] # 发送语音设置
use_tts = false # 是否使用tts语音（请确保你配置了tts并有对应的adapter）

[Debug]
level = "INFO" # 日志等级（DEBUG, INFO, WARNING, ERROR）
```
看懂了吧？其实和Napcat差不多

猫猫给大家详细解释一下配置文件的每一项：
### Napcat_Server
- `host`：gocq 设定的主机地址，通常为 `localhost`。
- `port`：gocq 设定的端口，通常为 `8080`。
- `heartbeat`：与 gocq 设置的心跳相同（按秒计），通常为 `30`。

这部分的`host`和`port`组合起来，就是在Napcat中设置的ws服务地址，猫猫建议大家使用默认值。

### MaiBot_Server
- `platform_name`：标识 adapter 的名称，通常为 `qq`。
- `host`：麦麦在 `.env` 文件中设置的主机地址，即 `HOST` 字段。
- `port`：麦麦在 `.env` 文件中设置的端口，即 `PORT` 字段。

这个`platform_name`是用来标识适配器的，因为Napcat适配器是专门为QQ设计的，所以猫猫建议大家使用`qq`，当然你也可以使用其他的名称。

### Chat
- `group_list_type`：群组名单类型，可选为：`whitelist`（白名单），`blacklist`（黑名单）。
- `group_list`：群组名单。

当 `group_list_type` 为 `whitelist` 时，只有群组名单中的群组可以聊天。这意味着，只有在 `group_list` 中明确列出的群组才会被允许与机器人进行交互，其他所有未列出的群组都将被禁止。

当 `group_list_type` 为 `blacklist` 时，群组名单中的任何群组无法聊天。这意味着，`group_list` 中列出的群组将被禁止与机器人交互，而未列出的群组则可以正常使用聊天功能。

- `private_list_type`：私聊名单类型，可选为：`whitelist`（白名单），`blacklist`（黑名单）。
- `private_list`：私聊名单。

这部分的设置与 `group_list` 类似，只不过是针对私聊的设置。

- `ban_user_id`：全局禁止名单（全局禁止名单中的用户无法进行任何聊天）。

这部分的设置是一个全局禁止名单，任何在这个名单中的用户都无法与机器人进行任何聊天，无论他是不是在群聊中尝试与机器人交互。

- `enable_poke`：是否启用戳一戳功能。

字面意思喵~

### Voice
- `use_tts`：是否使用 TTS 语音。

如果你想使用 TTS 语音功能，请确保你已经配置了 TTS，并且有对应的适配器。然后把这个选项设置为 `true`。

### Debug
- `level`：日志等级（`DEBUG`，`INFO`，`WARNING`，`ERROR`）。
- `level`：日志等级，猫猫建议大家使用 `INFO`，这样可以避免过多的日志信息干扰。

# 最后！

还有gocq配置的时候，一定要选择`反向WS`，这样才是gocq去连接适配器
