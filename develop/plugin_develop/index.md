# MaiBot 开发指南

## MaiBot 外部Adapter开发
本条目针对的是想让MaiBot与外部其他软件通信的开发
在现有的MaiBot框架下，你的插件与MaiBot的通信应该使用规范MaiBot通信库[maim_message](https://github.com/MaiM-with-u/maim_message)进行通信


## MaiBot 新Willing模块开发
本条目针对的是想让MaiBot回复意愿更加自定义与个性化的开发
在现有的MaiBot框架下，你的willing模块应该继承--------------基类，并实现---------方法