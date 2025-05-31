# Maim_Message Message Class
这是Maim_Message的消息基础类，是Adapter发送和接受的消息的基础数据结构。
## class Seg:
这是可以递归的消息基本单元，用于表示消息的不同部分与不同类型
```python
@dataclass
class Seg:
    type: str
    data: Union[str, List["Seg"]]

    @classmethod
    def from_dict(cls, data: Dict) -> "Seg":

    def to_dict(self) -> Dict:
```
`type`: 标记Seg消息段类型，MaiBot Core现在接受的类型有`[text, image, emoji, seglist]`

`data`: 具体的消息内容，根据`type`区分。

<div class="indent">

`type="text"`时`data`为字符串。

`type="image"`时`data`为图片的base64**无头编码**。

`type="emoji"`时`data`为表情图片的base64**无头编码**。

`type="voice"`时`data`为wav无压缩格式语音的base64无头编码。

`type="reply"`时`data`为被回复对象的message_id。

`type="seglist"`时`data`为一个Seg列表。

`type="command"`时，`data`为一个字典，包含命令的名称和参数。详细的参数列表在[Seg Command 列表](/develop/maim_message/command_args)
</div>

`from_dict`: 将字典转换为Seg对象，适用于从字典格式的数据中创建Seg对象，不必自行调用进行解析。

`to_dict`: 将Seg对象转换为字典，适用于将Seg对象转换为字典格式的数据进行传输或存储，不必自行调用。

## class GroupInfo:
这是群组消息元数据，用于表示群组名称，群组id，以及群组所在的平台。

```python
@dataclass
class GroupInfo:
    platform: str
    group_id: str
    group_name: Optional[str] = None  # 群名称

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "GroupInfo":
```

`platform`: 标记群组所在的平台

`group_id`: 标记群组的唯一id

`group_name`: 标记群组的名称，可选

`from_dict`: 将字典转换为GroupInfo对象，不必自行调用进行解析。

`to_dict`: 将GroupInfo对象转换为字典，不必自行调用。

## class UserInfo:
这是用户消息元数据，用于表示用户平台，用户id，用户昵称/用户名以及用户的群昵称。
```python
@dataclass
class UserInfo:
    platform: str
    user_id: str
    user_nickname: Optional[str] = None  # 用户昵称
    user_cardname: Optional[str] = None  # 用户群昵称

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "UserInfo":
```

`platform`: 标记用户所在的平台

`user_id`: 标记用户的唯一id

`user_nickname`: 用户的昵称/用户名，可选

`user_nickname`: 用户在群组内的群昵称，可选

`to_dict`: 将UserInfo对象转换为字典，不必自行调用。

`from_dict`: 将字典转换为UserInfo对象，不必自行调用进行解析。

## class FormatInfo:
这是格式信息元数据，用于表示Adapter可以发送和接受的格式信息。
```python
@dataclass
class FormatInfo:
    content_format: List["str"] = None
    accept_format: Optional[List["str"]] = None

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "FormatInfo":
```

`content_format`: 标记本条消息包含的内容类型，**必填**，默认为空，告诉MaiBot Core此条消息包含的内容的类型。

`accept_format`: 标记Adapter可以接受的格式信息，**必填**，默认为空，告诉MaiBot Core可以发送的格式信息。

**以上的format信息填写时应匹配Seg的合法type类型。**

`to_dict`: 将FormatInfo对象转换为字典，不必自行调用。

`from_dict`: 将字典转换为FormatInfo对象，不必自行调用进行解析。

## class TemplateInfo:
这是模板信息元数据。

```python
@dataclass
class TemplateInfo:
    template_items: Optional[Dict[str, str]] = None
    template_name: Optional[Dict[str, str]] = None
    template_default: bool = True

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "TemplateInfo":
```

`template_items`: 标记模板的内容，默认为空。

`template_name`: 标记模板的名称，默认为空。

`template_default`: 标记是否为默认模板，默认为True。

`to_dict`: 将TemplateInfo对象转换为字典，不必自行调用。

`from_dict`: 将字典转换为TemplateInfo对象，不必自行调用进行解析。

## class BaseMessageInfo
消息的全部元数据信息
```python
@dataclass
class BaseMessageInfo:
    platform: str
    message_id: str
    time: float
    group_info: Optional[GroupInfo] = None
    user_info: UserInfo
    format_info: FormatInfo
    template_info: Optional[TemplateInfo] = None
    additional_config: Optional[dict] = None

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "BaseMessageInfo":
```

`platform`: 标记消息所在的平台

`message_id`: 标记消息的唯一id

`time`: 标记消息的时间戳

`group_info`: 标记消息的群组信息，当为私聊的时候置为空，为群聊的时候应为GroupInfo对象

`user_info`: 标记消息的用户信息

`format_info`: 标记消息的格式信息，标记Adapter可以发送和接受的格式信息

`template_info`: 标记消息的模板信息，可选

`additional_config`: 标记消息的附加配置，可选。其配置应该基于下游可接受的配置进行填写。

| 现在可使用的配置项 | 可选值 | 说明 |
| --- | --- | ---|
| `maimcore_reply_probability_gain`* | 任意数值 | 回复概率增益（100%为1）|
| `allow_tts` | `True`/`False` | 是否允许使用TTS语音** |
| `original_text`*** | 任意字符串 | 从TTS Adapter返回的语音数据中携带的原始文字数据 |

>*: 由于代码开发，暂时停用
>
>**: 需要自行配置相应的TTS引擎，同时有对应的TTS Adapter
>
>***: 本项由[maimbot_tts_adapter](https://github.com/tcmofashi/maimbot_tts_adapter)返回，MaiBot Core本体不支持

`to_dict`: 将BaseMessageInfo对象转换为字典，不必自行调用。

`from_dict`: 将字典转换为BaseMessageInfo对象，不必自行调用进行解析。

## class MessageBase
发送和接受的完整消息对象
```python
@dataclass
class MessageBase:
    message_info: BaseMessageInfo
    message_segment: Seg
    raw_message: Optional[str] = None  # 原始消息，包含未解析的cq码

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "MessageBase":
```

`message_info`: 标记消息的元数据信息，为BaseMessageInfo对象

`message_segment`: 标记消息的内容，为Seg对象

`raw_message`: 标记消息的原始内容，包含未解析的cq码，可选

`to_dict`: 将MessageBase对象转换为字典，不必自行调用。

`from_dict`: 将字典转换为MessageBase对象，**收到消息后请调用来把字典转换为MessageBase对象。**