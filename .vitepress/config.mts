import { defineConfig } from 'vitepress'

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
      { text: 'GitHub', link: 'https://github.com/SengokuCola/MaiMBot' }
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
          text: '安装配置',
          collapsed: false,
          items: [
            { text: '安装指南', link: '/manual/installation/' },
            { text: '标准安装教程', link: '/manual/installation/installation_standard' },
            { text: '萌新安装教程', link: '/manual/installation/installation_cute' }
          ]
        },
        {
          text: '部署方法',
          collapsed: false,
          items: [
            { text: '部署概览', link: '/manual/deployment/' },
            { text: 'MaimCore版windows部署', link: '/manual/deployment/mmc_deploy'},
            { text: 'MaimCore版docker部署(推荐)', link: '/manual/deployment/docker_deploy_mmc' },
            { text: 'MaimCore版linux部署', link: '/manual/deployment/mmc_deploy_linux' },
            { text: 'new_knowledge版（LPMM版）说明', link: '/manual/deployment/LPMM'},
            {
              text:'0.5.x 部署方法（旧版）',
              collapsed: true,
              items: [
                { text: 'Docker部署（推荐）', link: '/manual/deployment/docker_deploy' },
                { text: 'Linux手动部署', link: '/manual/deployment/manual_deploy_linux' },
                { text: 'Windows手动部署', link: '/manual/deployment/manual_deploy_windows' },
                { text: '群晖NAS部署', link: '/manual/deployment/synology_deploy' },
                { text: '新手Linux部署', link: '/manual/deployment/linux_deploy_guide_for_beginners' },
              ]
            },
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
        }
      ],
      // '/develop/': [
      //   {
      //     text: '开发文档',
      //     items: [
      //       { text: '介绍', link: '/develop/' }
      //     ]
      //   },
      //   {
      //     text: 'API参考',
      //     collapsed: false,
      //     items: [
      //       { text: 'API概览', link: '/develop/api/' },
      //       { text: 'API草案', link: '/develop/api/draft' }
      //     ]
      //   },
      //   {
      //     text: '项目结构',
      //     collapsed: false,
      //     items: [
      //       { text: '架构概述', link: '/develop/structure/' },
      //       { text: '文件结构', link: '/develop/structure/file_structure' }
      //     ]
      //   },
      //   {
      //     text: '开发指南',
      //     collapsed: false,
      //     items: [
      //       { text: 'AI辅助开发', link: '/develop/guide/ai-instruction' }
      //     ]
      //   }
      // ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/SengokuCola/MaiMBot' }
    ]
  }
})
