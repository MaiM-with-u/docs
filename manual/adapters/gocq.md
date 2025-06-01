# MaiBot GoCQ Adapter 文档

这个适配器不容易被腾讯制裁！

## 安装
首先，你需要安装 GoCQ 本身，以下列出了一些不同的GoCQ版本：  
[AstralGocq](https://github.com/ProtocolScience/AstralGocq)  
[gocq-http(New)](https://github.com/LagrangeDev/go-cqhttp)  
[gocq-http(Old)(可用性不保证)](https://github.com/Mrs4s/go-cqhttp)  
在这些项目中的release页面下载对应的版本，这里只提供Windows版本的安装教程。  

## 配置
下载完成后，解压到一个文件夹中，例如`D:\gocq`。  

双击打开gocq本体，会弹出一个提示框，要求你生成安全启动脚本，无脑点是。  

关闭gocq本体，使用安全启动脚本启动gocq，这时会叫你选择连接方式，选择`反向WebSocket`。  

打开`config.yml`，修改以下配置：
```yaml
# 连接服务列表
servers:
  # 添加方式，同一连接方式可添加多个，具体配置说明请查看文档
  #- http: # http 通信
  #- ws:   # 正向 Websocket
  #- ws-reverse: # 反向 Websocket
  #- pprof: #性能分析服务器
  # 反向WS设置
  - ws-reverse:
      # 反向WS Universal 地址
      # 注意 设置了此项地址后下面两项将会被忽略
      universal: ws://127.0.0.1:8080 # 主要修改这里，把8080改成你的端口，默认是8095，我习惯使用8080，所以改成了8080
      # 反向WS API 地址
      api: ws://your_websocket_api.server
      # 反向WS Event 地址
      event: ws://your_websocket_event.server
      # 重连间隔 单位毫秒
      reconnect-interval: 3000
      middlewares:
        <<: *default # 引用默认中间件
```
重新启动gocq，进行扫码登录，如果要求验证，请使用浏览器打开提供的链接，然后按下F12，打开网络(或Network)选项卡，正常进行验证，验证完成后等待几秒，会弹出验证成功的消息，这时看到你的开发人员工具，点击最下面那个请求，打开响应，复制`ticket`字段的值，粘贴到gocq的输入框中，按回车。  

验证好后，你基本就登陆上了  

## 安装适配器
使用你的git克隆https://github.com/LOGIC-SC/MaiBot-Gocq-Adapter.git，打开这个目录，创建一个Python虚拟环境，然后激活，再然后就执行  
```bash
pip install -r requirements.txt
```
直接运行main.py
```bash
python main.py
```
这时他会复制`template`目录中的`template_config.toml`到`根目录`，然后你可以修改`config.toml`中的配置。
## 配置适配器
由于Gocq适配器是基于Napcat适配器修改的，所以配置和Napcat适配器类似，这里就不再赘述。
