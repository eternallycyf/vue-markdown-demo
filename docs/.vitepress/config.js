const base =
  process.env.NODE_ENV === 'production' ? '/vue-markdown-demo/' : '/';
const { resolve } = require('path');

module.exports = {
  title: 'vue-markdown-demo',
  description: '',
  // 扫描srcIncludes里面的 *.md文件
  srcIncludes: ['src'],
  alias: {
    // 为了能在demo中正确的使用  import { X } from 'vue-typical'
    [`vue-typical`]: resolve('./src'),
  },
  base,
  themeConfig: {
    logo: '/logo.svg',
    locales: {
      '/': {
        lang: 'en-US',
        title: 'VueTypical',
        description: '',
        label: 'English',
        selectText: 'Languages',
        nav: [
          { text: 'Guide', link: '/' },
          {
            text: 'react-demo',
            link: 'http://wangxince.site/my-demo-markdown/zh-CN/',
          },
        ],
        sidebar: [
          { text: 'Getting Started', link: '/' },
          {
            text: 'Demo',
            children: [
              { text: 'pinia', link: '/pinia/' },
              { text: 'HOC', link: '/hoc/' },
            ],
          },
        ],
      },
      '/zh/': {
        lang: 'zh-CN',
        title: 'VueTypical',
        description: '',
        label: '中文',
        selectText: '语言',
        nav: [
          { text: '入门指南', link: '/zh/' },
          {
            text: 'react-demo',
            link: 'http://wangxince.site/my-demo-markdown/zh-CN/',
          },
        ],
        sidebar: [
          { text: '快速开始', link: '/zh/' },
          {
            text: '示例',
            children: [
              { text: 'pinia', link: '/zh/pinia/' },
              { text: 'HOC', link: '/zh/hoc/' },
            ],
          },
        ],
      },
    },
    search: {
      searchMaxSuggestions: 10,
    },
    repo: 'eternallycyf/vue-markdown-demo',
    repoLabel: 'Github',
    lastUpdated: true,
    prevLink: true,
    nextLink: true,
  },
};
