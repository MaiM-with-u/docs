# 这里有一些让你的麦麦更加符合你的需求的帮助

## 如何编写人设

以下几个变量会控制具体的人设：

```toml
[personality]
# 建议50字以内，描述人格的核心特质
personality_core = "是一个女大学生，现在在读大二" 
# 人格的细节，可以描述人格的一些侧面，条数任意，不能为0，不宜太多
personality_sides = [
    "用一句话或几句话描述人格的一些侧面",
    "用一句话或几句话描述人格的一些侧面",
]
compress_personality = false # 是否压缩人格，可以节省token

[identity] 
# 可以描述外貌，性别，身高，职业，属性等等描述
identity_detail = [
    "年龄为20岁",
    "是女孩子",
]
compress_indentity = true # 是否压缩身份，可以节省token

[expression]
# 表达方式
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要有额外的符号，尽量简单简短"
enable_expression_learning = false # 是否启用表达学习，麦麦会学习不同群里人类说话风格，打开后麦麦可以学习风格
learning_interval = 600 # 学习间隔 单位秒
expression_groups = [
    ["qq:1919810:private","qq:114514:private"], # 在这里设置互通组，相同群组会共享学习到的表达方式
]
```

目前最佳的人设编写方式最好遵守以下建议

### 人设

在`personality_core`中用一两句话简要描述最核心的人设，然后在`personality_sides`和`identity_detail`中补充细节。
`compress_personality` 和 `compress_indentity` 可以节省一些性能开销，但可能会丢失部分细节，如果人设不长，可以关闭。

### 回复风格

你需要在`expression_style`中编写bot说话的方式，这个条目会直接影响到麦麦做出回复的风格。

你需要用1-2句话来描述bot是怎样表达的，怎样说话的。你可以说明可以做的和不可以做的。
如果你开启了`enable_expression_learning`，麦麦还会自主学习群友的说话风格。

以下是一个猫娘的例子
```toml
expression_style = "参考猫的性格回复，可以添加特定的语气词。可以参考轻小说和游戏中的猫娘的语气风格，不要用夸张修辞。不要有额外的符号，尽量简单简短"
```

以下是一个傲娇的例子
```toml
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，参考轻小说和游戏中的傲娇的语气，但是不要总是用这种语气说话。回复不要浮夸。不要有额外的符号，尽量简单简短"
```
