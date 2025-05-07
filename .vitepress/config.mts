import { defineConfig } from 'vitepress'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MaiMBot 文档中心",
  description: "MaiMBot 开发与使用的全方位指南",
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
      // { text: '开发文档', link: '/develop/' },
      { text: 'GitHub', link: 'https://github.com/MaiM-with-u/MaiBot' }
    ],

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
            { text: 'MaimCore版Windows部署', link: '/manual/deployment/mmc_deploy_windows'},
            { text: 'MaimCore版Linux部署', link: '/manual/deployment/mmc_deploy_linux' },
            { text: 'MaimCore版Docker部署(推荐)', link: '/manual/deployment/mmc_docker_deploy' },
            { text: '新版知识库LPMM说明', link: '/manual/deployment/lpmm'},
            { text: '旧版Adapter的Windows部署', link: '/manual/deployment/old/mmc_deploy_windows_old'},
            {
              text:'0.5.x 部署方法（旧版）',
              collapsed: true,
              items: [
                { text: 'Docker部署（推荐）', link: '/manual/deployment/old/docker_deploy' },
                { text: 'Linux手动部署', link: '/manual/deployment/old/manual_deploy_linux' },
                { text: 'Windows手动部署', link: '/manual/deployment/old/manual_deploy_windows' },
                { text: '群晖NAS部署', link: '/manual/deployment/old/synology_deploy' },
                { text: '新手Linux部署', link: '/manual/deployment/old/linux_deploy_guide_for_beginners' },
              ]
            },
          ]
        },
        {
          text: '配置方法',
          collapsed: false,
          items: [
            { text: '配置指南', link: '/manual/configuration/' },
            { text: '标准配置教程', link: '/manual/configuration/configuration_standard' }
          ]
        },
        {
          text: '使用指南',
          collapsed: false,
          items: [
            { text: '使用说明', link: '/manual/usage/' },
            { text: '快速问答', link: '/manual/usage/fast_q_a' },
            { text: '0.6.0版本更新Q&A', link: '/manual/usage/mmc_q_a' }
          ]
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            { text: '常见问题', link: '/manual/other/' },
            { text: '如何避免提出0/1问题', link: '/manual/other/questions-with-yes-or-no-answers' },
            { text: '提问的艺术(麦麦版本)', link: '/manual/other/ask_art' },

          ]
        }
      ],
      '/develop/': [
        {
          text: '开发文档',
          items: [
            { text: '介绍', link: '/develop/' }
          ]
        },
        // {
        //   text: 'API参考',
        //   collapsed: false,
        //   items: [
        //     { text: 'API概览', link: '/develop/api/' },
        //     { text: 'API草案', link: '/develop/api/draft' }
        //   ]
        // },
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
          text: '插件开发',
          collapsed: false,
          items: [
            { text: '开发综述', link: '/develop/plugin_develop/'},
            { text: 'Adapter 开发指南', link: '/develop/plugin_develop/develop_plugin'},
          ]
        },
        {
          text: 'Maim_Message参考',
          collapsed: false,
          items: [
            { text: 'Maim_Message 概述', link: '/develop/maim_message/' },
            { text: 'Message_Base', link: '/develop/maim_message/message_base' },
            { text: 'Router', link: '/develop/maim_message/router'}
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
  }
})



