# Maim_Message Router
这是Maim_Message的消息路由器，负责将消息从一个平台转发到另一个平台。

## class TargetConfig
这部分是路由配置的基本单元
```python
@dataclass
class TargetConfig:
    url: str
    token: Optional[str] = None

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "TargetConfig":
```
`url`: 路由目标地址

`token`: 鉴权密钥

## class RouteConfig
这部分是路由配置类，负责指出路由的方向
```python
@dataclass
class RouteConfig:
    route_config: Dict[str, TargetConfig] = None

    def to_dict(self) -> Dict:

    @classmethod
    def from_dict(cls, data: Dict) -> "RouteConfig":
```

`route_config`: 为多个路由单元组成的字典

## class Router
路由器类，负责管理所有的路由配置和连接 **（此处仅展示插件开发必要部分）**
```python
class Router:
    def __init__(self, config: RouteConfig):

    async def connect(self, platform: str):
        """连接指定平台"""

    async def run(self):
        """运行所有客户端连接"""

    async def stop(self):
        """停止所有客户端"""

    def register_class_handler(self, handler):

    async def send_message(self, message: MessageBase)
```
`__init__`: 初始化路由器实例，传入路由配置

`connect`: 连接指定平台，运行`run()`方法后会自动调用以连接所有配置的平台。

`run`: 运行所有客户端连接，自动连接所有配置的平台。

`stop`: 停止所有客户端连接，自动断开所有配置的平台。