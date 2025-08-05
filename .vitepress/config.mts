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
      { text: '常见问题', link: '/faq/' },
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
            { text: '介绍', link: '/manual/' }
          ]
        },
        {
          text: '部署方法',
          collapsed: false,
          items: [
            { text: '部署概览', link: '/manual/deployment/' },
            { text: 'Windows部署', link: '/manual/deployment/mmc_deploy_windows' },
            { text: 'Linux部署', link: '/manual/deployment/mmc_deploy_linux' },
            { text: 'Docker部署', link: '/manual/deployment/mmc_deploy_docker' },
            { text: 'Android部署', link: '/manual/deployment/mmc_deploy_android' },
            { text: 'Adapter部署(旧版)', link: '/manual/deployment/old/mmc_deploy_windows_old' },
            {
              text: '0.5.x旧版部署方法',
              collapsed: true,
              items: [
                { text: 'Docker部署(推荐)', link: '/manual/deployment/old/docker_deploy' },
                { text: 'Linux手动部署', link: '/manual/deployment/old/manual_deploy_linux' },
                { text: 'Windows手动部署', link: '/manual/deployment/old/manual_deploy_windows' },
                { text: '群晖NAS部署', link: '/manual/deployment/old/synology_deploy' },
                { text: '新手Linux部署', link: '/manual/deployment/old/linux_deploy_guide_for_beginners' },
              ]
            },
          ]
        },
        {
          text: 'Adapter 广场',
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
          text: '插件广场',
          collapsed: false,
          items: [
            { text: '插件概述', link: '/manual/plugins/' },
          ]
        },
        {
          text: '配置方法',
          collapsed: false,
          items: [
            { text: '配置指南',
              collapsed: true,
              items: [
                { text: '配置概览', link: '/manual/configuration/' },
                { text: '.env配置教程', link: '/manual/configuration/configuration_env_standard' },
                { text: 'bot_config.toml配置教程', link: '/manual/configuration/configuration_standard' },
                { text: 'bot_config.toml模型部分配置教程', link: '/manual/configuration/configuration_model_standard' },
              ]
            },
            { text: '标准配置教程', link: '/manual/configuration/configuration_standard' },
            { text: 'LPMM导入文件格式', link: '/manual/configuration/lpmm_knowledge_template' },
          ]
        },
        {
          text: '使用指南',
          collapsed: false,
          items: [
            { text: '麦麦使用说明', link: '/manual/usage/' },
            { text: 'LPMM使用说明', link: '/manual/usage/lpmm' },
            { text: 'LPMM手动编译说明', link: '/manual/usage/compile_and_install'},
            { text: '备份你的麦麦', link: '/manual/usage/backup.md' },
          ]
        },
        {
          text: '其他',
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
          text: '项目结构',
          collapsed: false,
          items: [
            { text: '架构概述', link: '/develop/structure/' },
            { text: '文件结构', link: '/develop/structure/file_structure' },
            { text: '消息处理流程', link: '/develop/structure/message_flow_direction' },
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
