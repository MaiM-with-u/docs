# 旧版Adapters部署(0.6.0)

## ⚠️ 注意事项
**本教程基于nonebot部署到QQ平台，不代表其他平台的部署方式相同**

## 系统要求
python >= 3.10

OS: Windows10 或 Windows11

## 部署步骤

### 一、环境配置
两种方式任选其一

#### Conda 版
假定你已经安装好了Conda，只需要创建一个虚拟环境即可
然后我们创建一个安装麦麦的文件夹（以MaiM-with-u为例）
```shell
conda create -n MaiBotEnv python=3.11
conda activate MaiBotEnv
```

#### 虚拟环境版
假定你已经安装好了python并添加了系统变量
1. 新建一个你想要安装麦麦的文件夹（以MaiM-with-u为例）
2. 进入文件夹，创建python虚拟环境并激活
```shell
mkdir MaiM-with-u
cd MaiM-with-u
python -m venv MaiBotEnv
.\\MaiBotEnv\\Scripts\\activate
```

### 二、获取必要的文件

1. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地

2. 通过 git clone 将 [maim_message 包](https://github.com/MaiM-with-u/maim_message) clone 到本地

3. 通过 git clone 将 [nonebot-plugin-maibot-adapters](https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters) clone 到本地
```shell
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/maim_message.git
git clone https://github.com/MaiM-with-u/nonebot-plugin-maibot-adapters.git
```

### 三、依赖安装

1. 进入下载的麦麦repo文件夹
2. pip安装所需依赖
```shell
cd MaiBot
pip install -i https://mirrors.aliyun.com/pypi/simple -r .\\requirements.txt
pip install -i https://mirrors.aliyun.com/pypi/simple nb-cli
```
3. 随后回到上一级文件夹（此处为MaiM-with-u），再进入maim_message文件夹，安装这个包
```shell
cd ..
cd maim_message
pip install -e .
```

### 四、Nonebot adapter 部署

- 如果你按照上面的进行且没有关闭窗口，那么你应该在python环境/conda环境中，如果没有，请手动进入

1. 回到`MaiM-with-u`文件夹，在`MaiM-with-u`文件夹下面运行`nb`命令
2. 用选择`创建一个NoneBot项目`并回车
3. 选择`simple（插件开发者）`
4. 项目名称任意，我们以`mainonebot-adapter`为例输入（这与你后来生成的文件夹名称相同）
5. 选中`OneBot V11（OneBot V11 协议）`，回车
6. 驱动器选择`FastAPI（FastAPI 驱动器）`和`websockets（websockets 驱动器）`，回车
7. 插件安装位置选择`在 "src" 文件夹中`，回车
8. 立即安装依赖输入`Y`（即安装依赖）
9. 创建虚拟环境选择`n`（因为我们本身就在虚拟环境，没必要再套一个）
10. 选择内置插件时**不选择任何内置插件**，直接回车

```shell
cd ..
nb
```

此时打开你的文件夹（这里是`Maim-with-u`文件夹下的`mainonebot-adapter`文件夹），手动把下载的的`nonebot-plugin-maibot-adapters`文件夹下的`nonebot_plugin_maibot_adapters`文件夹复制到`Maim-with-u\mainonebot-adapter\src\plugins`文件夹下。

到这里，nonebot adapter部署完成

最终的文件夹结构应该类似这样：
```
Maim-with-u
├── MaiBot
│   ├── changelogs
│   ├── config
│   ├── data
│   ├── depends-data
│   ├── src
│   │   └── ...
│   └── template
├── maim_messages
└── mainonebot-adapter
    └── src
        └── plugins
            └── nonebot_plugin_maibot_adapters
```

### 五、Napcat 部署

- 请参考NapCatQQ文档：[Shell版](https://www.napcat.wiki/guide/boot/Shell)、[Framework版](https://www.napcat.wiki/guide/boot/Framework),任选一种即可

> [!IMPORTANT]
> 配置示例：
> ![](/images/napcat_websocket.png) 

### 六、配置 MaiBot 和 Nonebot adapter

#### MaiBot配置
1. 在`MaiBot`文件夹中新建一个`config`文件夹，手动复制`template`文件夹中的`bot_config_template.toml`到`config`目录下并改名为`bot_config.toml`
2. 然后手动复制`template`文件夹中的`template.env`到根目录并重命名为`.env`
3. 打开`.env`并修改PORT为8000
> <details>
> <summary>如果你想修改这个PORT为其他，点开这里</summary>
> 找到 nonebot_plugin_maibot_adapters 下的 config.py ，打开，修改第六行的 Fastapi_url 中的端口号为你想要的端口号
>
> ```python
> Fastapi_url : str = "http://localhost:8000/api/message"  # 你的FastAPI地址 / 与maimcore的服务器（端口）相同
> ```
> </details>
4. 剩余的内容与原来的配置方法相同

#### Nonebot adapter 配置
<!-- - 这里提供两种方式连接napcat：正向与反向，**二者选其一即可** -->
##### 正向连接
1. 在Napcat中新建`websocket服务端`并设置端口为你想要的端口（这里以`8095`为例），`Host`设置为`0.0.0.0`
2. 打开`mainonebot-adapter`文件夹下的`.env`文件，配置如下：
```ini
ENVIRONMENT=dev
DRIVER=~fastapi+~websockets
PORT=18002
ONEBOT_WS_URLS=["ws://127.0.0.1:8095"] #此处与Napcat端口相同
```
> <details>
> <summary>如果你想修改这里的 PORT=18002 配置，看这里</summary>
> 找到MaiBot下的 bot_config.toml ，打开找到 platform
>
> ```ini
> [platforms] # 必填项目，填写每个平台适配器提供的链接
> qq="http://127.0.0.1:18002/api/message"
> ```
> 
> 然后把这里的18002修改为你设置的PORT
> </details>

<!-- ##### 反向代理连接
1. 在Napcat中新建`websocket客户端`并设置反向代理的url（这里以`ws://localhost:8096/onebot/v11/ws`为例）
2. 打开`mainonebot-adapter`文件夹下的`.env`文件，配置如下：
```ini
ENVIRONMENT=dev
DRIVER=~fastapi+~websockets
PORT=18002
PORT=8096 # 此处与Napcat端口相同
```
> 如果你想修改这里的 PORT=18002 配置，看上面的折叠部分 -->

### 七、运行
**如果你是正向连接的方式，那么先启动Napcat**，然后进入`mainonebot-adapter`文件夹，在你的虚拟环境中运行
```shell
nb run --reload
```
随后进入麦麦本体的文件夹，运行
```shell
python ./bot.py
```
<!-- 反向代理连接方式则是先运行adapter，再运行Napcat，最后是麦麦本体 -->
