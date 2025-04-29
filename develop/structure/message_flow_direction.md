# 麦麦消息流向流程图  
本图旨在帮助新的开发者迅速的理解麦麦的消息处理流程  
## 从websocket开始的消息处理  
![message_flow_direction1.png](/images/message_flow_direction1.png)

- api.py 在maim-message包中，适配器和麦麦本体maimai core（以下简称mmc）均使用的本包  
- main.py 根目录下的程序入口文件  
- bot.py src/plugins/chat/bot.py 具体的消息分发在message_process函数中
  
## 进入message_process后的消息处理
![message_flow_direction2.png](/images/message_flow_direction2.png)

- 该函数会对数据进行一定的预处理（具体详见代码）后按照配置信息和数据类型，将数据分发到不同的处理器中

## 进入心流和PFC后的消息处理逻辑
### 心流处理逻辑
- 请参照src/hartflow/README.md 其中有非常详细的逻辑解释
### PFC处理逻辑
- <del>（PFC的逻辑，下次再来探索吧（x）</del>
- 自己看源码（√）