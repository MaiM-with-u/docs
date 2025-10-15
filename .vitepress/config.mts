import { defineConfig } from 'vitepress'
import { MermaidPlugin, MermaidMarkdown } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MaiBot 文档中心",
  description: "MaiBot 开发与使用的全方位指南",
  head: [
    ['link', { rel: 'icon', href: '/avatars/MaiM.png' }]
  ],
  themeConfig: {
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '用户手册', link: '/manual/' },
      { text: '开发文档', link: '/develop/' },
      {
        text: '官方Q群', items: [
          { text: '一群', link: 'https://qm.qq.com/q/VQ3XZrWgMs' },
          { text: '二群', link: 'https://qm.qq.com/q/RzmCiRtHEW' },
          { text: '三群', link: 'https://qm.qq.com/q/wlH5eT8OmQ' },
          { text: '四群', link: 'https://qm.qq.com/q/fRdCbMXkGY' },
          { text: '五群', link: 'https://qm.qq.com/q/JxvHZnxyec' },
        ]
      },
      {
        text: 'GitHub', items: [
          { text: 'MaiBot', link: 'https://github.com/MaiM-with-u/MaiBot' },
          { text: 'MaiBot Docs', link: 'https://github.com/MaiM-with-u/docs' }
        ]
      }
    ],
    outline: [1, 4],
    sidebar: {
      '/manual/': [
        {
          text: '用户手册',
          items: [
            { text: '主页', link: '/manual/' }
          ]
        },
        {
          text: '安装方法',
          collapsed: false,
          items: [
            { text: '部署概览', link: '/manual/deployment/' },
            { text: 'Windows部署', link: '/manual/deployment/mmc_deploy_windows' },
            { text: 'Linux部署', link: '/manual/deployment/mmc_deploy_linux' },
            { text: 'Docker部署', link: '/manual/deployment/mmc_deploy_docker' },
            { text: 'Android部署', link: '/manual/deployment/mmc_deploy_android' },
            { text: 'Kubernetes部署', link: '/manual/deployment/mmc_deploy_kubernetes' }
          ]
        },
        {
          text: '社区提供的部署方案',
          collapsed: false,
          items: [
            { text: '1Panel 部署', link: '/manual/deployment/community/1panel' },
            { text: 'Linux一键脚本部署', link: '/manual/deployment/community/linux_one_key' }
          ]
        },
        {
          text: '功能介绍',
          collapsed: false,
          items: [
            { text: '麦麦使用说明', link: '/manual/usage/' },
            { text: '聊天控制系统', link: '/manual/usage/features/chat' },
            { text: '表达学习', link: '/manual/usage/features/expression' },
            { text: '个性系统', link: '/manual/usage/features/personality' },
            { text: 'LPMM知识库', link: '/manual/usage/features/lpmm' },
            { text: 'LPMM手动编译说明', link: '/manual/usage/compile_and_install'},
            { text: '备份你的麦麦', link: '/manual/usage/backup.md' },
          ]
        },
        {
          text: '适配器列表',
          collapsed: false,
          items: [
            { text: 'Adapters 文档中心', link: '/manual/adapters' },
            { text: 'MaiBot Napcat Adapter', link: '/manual/adapters/napcat' },
            { text: 'GO-CQ Adapter', link: '/manual/adapters/gocq' },
            {
              text: 'MaiBot TTS Adapter', collapsed: true, items: [
                { text: '基本介绍', link: '/manual/adapters/tts/' },
                { text: 'GPT_Sovits TTS', link: '/manual/adapters/tts/gpt_sovits' },
                { text: '豆包 TTS', link: '/manual/adapters/tts/doubao_tts' },
                { text: '千问Omni TTS', link: '/manual/adapters/tts/qwen_omni' },
              ]
            },
          ]
        },
        {
          text: '插件',
          collapsed: false,
          items: [
            { text: '插件概述', link: '/manual/plugins/' },
          ]
        },
        {
          text: '配置详解',
          collapsed: false,
          items: [
            { text: '配置概览', link: '/manual/configuration/' },
            { text: '麦麦设置配置教程', link: '/manual/configuration/configuration_standard' },
            { text: '模型设置配置教程', link: '/manual/configuration/configuration_model_standard' },
            { text: 'LPMM导入文件格式', link: '/manual/configuration/lpmm_knowledge_template' },
          ]
        },
        {
          text: '常见问题',
          collapsed: false,
          items: [
            { text: '最终用户许可协议', link: '/manual/other/EULA' },
            { text: '如何高效提问', link: '/manual/other/how-to-ask-questions' },
            {
              text: '文章集', collapsed: true, items: [
                { text: '一篇小文', link: '/manual/other/ask_art'},
                { text: '如何避免0/1问题', link: '/manual/other/questions-with-yes-or-no-answers' },
              ]
            }
          ]
        }
      ],

      '/faq/': [
        {
          text: '常见问题',
          items: [
            { text: '介绍', link: '/faq/' },
          ]
        },
        {
          text: 'MaiBot相关',
          collapsed: false,
          items: [
            { text: '安装与运行', link: '/faq/maibot/install_running' },
            { text: '旧版更新', link: '/faq/maibot/update_to_07' },
            { text: 'LPMM说明', link: '/faq/maibot/lpmm' },
            { text: '麦麦部分配置详细说明', link: '/faq/maibot/settings'},
            { text: '一键包常见问题', link: '/faq/maibot/onekey_faq' },
          ]
        },
        {
          text: 'Adapter相关',
          collapsed: false,
          items: [
            { text: 'Napcat Adapter', link: '/faq/maibot-napcat-adapter/' },
            { text: 'TTS适配器常见问题', link: '/faq/maibot-tts-adapter/' },
          ]
        }
      ],

      '/develop/': [
        {
          text: '开发文档',
          items: [
            { text: '介绍', link: '/develop/' },
            { text: '开发者与代码规范', link: '/develop/develop_standard' },
          ]
        },
        {
          text: '适配器开发',
          collapsed: false,
          items: [
            { text: '开发综述', link: '/develop/adapter_develop/' },
            { text: 'Adapter 开发指南', link: '/develop/adapter_develop/develop_adapter' },
          ]
        },
        {
          text: '插件开发',
          collapsed: false,
          items: [
            { text: '开发指南', link: '/develop/plugin_develop/' },
            { text: '快速开始', link: '/develop/plugin_develop/quick-start'},
            { text: 'Manifest系统指南', link: '/develop/plugin_develop/manifest-guide' },
            { text: 'Actions系统', link: '/develop/plugin_develop/action-components' },
            { text: '命令处理系统', link: '/develop/plugin_develop/command-components' },
            { text: '工具系统', link: '/develop/plugin_develop/tool-components' },
            { text: '配置管理指南', link: '/develop/plugin_develop/configuration-guide' },
            { text: '依赖管理', link: '/develop/plugin_develop/dependency-management' },
            { text: 'API参考',
              collapsed: true,
              items: [
                { text: '发送API', link: '/develop/plugin_develop/api/send-api' },
                { text: '消息API', link: '/develop/plugin_develop/api/message-api' },
                { text: '聊天流API', link: '/develop/plugin_develop/api/chat-api' },
                { text: 'LLM API', link: '/develop/plugin_develop/api/llm-api' },
                { text: '回复生成器API', link: '/develop/plugin_develop/api/generator-api' },
                { text: '表情包API', link: '/develop/plugin_develop/api/emoji-api' },
                { text: '人物信息API', link: '/develop/plugin_develop/api/person-api' },
                { text: '数据库API', link: '/develop/plugin_develop/api/database-api' },
                { text: '配置API', link: '/develop/plugin_develop/api/config-api' },
                { text: '插件API', link: '/develop/plugin_develop/api/plugin-manage-api' },
                { text: '组件API', link: '/develop/plugin_develop/api/component-manage-api' },
                { text: '日志API', link: '/develop/plugin_develop/api/logging-api' },
                { text: '工具API', link: '/develop/plugin_develop/api/tool-api'}
              ]
            },

          ]
        },
        {
          text: 'Maim_Message参考',
          collapsed: false,
          items: [
            { text: 'Maim_Message 概述', link: '/develop/maim_message/' },
            { text: 'Message_Base', link: '/develop/maim_message/message_base' },
            { text: 'Router', link: '/develop/maim_message/router' },
            { text: '命令参数表', link: '/develop/maim_message/command_args'}
          ]
        }
        // {
        //   text: '开发指南',
        //   collapsed: false,
        //   items: [
        //     { text: 'AI辅助开发', link: '/develop/guide/ai-instruction' }
        //   ]
        // }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MaiM-with-u/MaiBot' }
    ],

    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },
  },
  markdown: {
    config(md) {
      md.use(MermaidMarkdown);
    },
  },
  vite: {
    plugins: [MermaidPlugin()],
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
  },
})
