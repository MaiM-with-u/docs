# 🔧 LPMM知识库导入文件要求


## OpenIE文件命名要求

进行提取完的OpenIE文件会命名为`月-日-时-分-openie.json`，存放在`data/openie`目录下。

此时，你可以进行改名，例如增加对内容的说明

但是，文件尾部的`-openie.json`后缀必须保留。

例子：

合法的文件名称：

- `千恋万花剧情-openie.json`
- `明日方舟全剧情-openie.json`
- `网络热梗(截止到2023年10月)-openie.json`

非法的文件名称：
- `贴吧热梗-openie.txt`（非json格式）
- `明日方舟全剧情.json`（没有openie标识）
- `114514-openie.json`（对内容描述不精确）


## 一、OpenIE 技术概述
**Open Information Extraction (OpenIE)** 是一种开放域信息抽取技术，旨在从非结构化文本中自动提取结构化关系三元组（`主语-谓语-宾语`），无需预定义关系类型。其核心特点包括：
- **无监督性**：不依赖预定义的领域本体或关系库。
- **灵活性**：可处理多样化的语言表达（如"苹果由乔布斯创立"和"乔布斯是苹果的创始人"）。
- **冗余容忍**：允许同一关系不同表述的多次提取。

## 二、OpenIE 数据格式规范
### 1. 整体结构
```json
{
    "docs": [
        {
            "idx": "文档的唯一标识符（通常是文本的SHA256哈希值）",
            "passage": "文档的原始文本",
            "extracted_entities": ["实体1", "实体2", ...],
            "extracted_triples": [["主语", "谓语", "宾语"], ...]
        },
        ...
    ],
    "avg_ent_chars": "实体平均字符数",
    "avg_ent_words": "实体平均词数"
}
```

### 2. 字段说明
| 字段                | 类型       | 描述                                                                 |
|---------------------|------------|----------------------------------------------------------------------|
| `docs`              | 数组       | 包含所有文档的抽取结果                                               |
| `idx`               | 字符串     | 文档唯一标识符（通常用SHA256哈希值保证文本唯一性）                   |
| `passage`           | 字符串     | 原始文本内容                                                         |
| `extracted_entities`| 字符串数组 | 从文本中识别出的所有实体（去重）                                     |
| `extracted_triples` | 三元组数组 | 抽取的结构化关系，每个三元组格式为 `["主语", "谓语", "宾语"]`        |
| `avg_ent_chars`     | 数值       | 实体的平均字符长度（统计所有`extracted_entities`）                   |
| `avg_ent_words`     | 数值       | 实体的平均单词数（按空格分词计算）                                   |

### 3. 示例
```json
{
    "docs": [
        {
            "idx": "a1b2c3...",
            "passage": "Steve Jobs founded Apple in 1976.",
            "extracted_entities": ["Steve Jobs", "Apple", "1976"],
            "extracted_triples": [
                ["Steve Jobs", "founded", "Apple"],
                ["Apple", "founded in", "1976"]
            ]
        }
    ],
    "avg_ent_chars": 8.3,
    "avg_ent_words": 1.7
}
```

