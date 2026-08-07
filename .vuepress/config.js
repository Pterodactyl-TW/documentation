module.exports = {
    base: '/',
    title: 'Pterodactyl',
    description: 'Pterodactyl 是一款採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板。Pterodactyl 以安全性為設計核心，將所有遊戲伺服器執行於隔離的 Docker 容器中，同時為使用者提供美觀且直覺的使用者介面。',
    locales: {
        '/': {
            lang: 'zh-TW',
        },
    },
    plugins: [
        ['@vuepress/search', {
            searchMaxSuggestions: 10
        }],
        ['zooming', {
            selector: '.content img',
            delay: 300,
            options: {
                bgColor: 'black',
                zIndex: 100,
            },
        }],
        ['vuepress-plugin-container', {
            type: 'warning',
        }],
        ['vuepress-plugin-container', {
            type: 'tip',
        }],
        ['vuepress-plugin-container', {
            type: 'danger',
        }],
        ['tabs'],
    ],
    configureWebpack: {
        serve: {
            hot: {
                port: 9091,
            },
        },
    },
    head: [
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' }],
        ['link', { rel: 'icon', type: 'image/png', href: '/favicons/favicon-32x32.png', sizes: '32x32' }],
        ['link', { rel: 'icon', type: 'image/png', href: '/favicons/favicon-16x16.png', sizes: '16x16' }],
        ['link', { rel: 'mask-icon', href: '/favicons/safari-pinned-tab.svg', color: '#0e4688' }],
        ['link', { rel: 'manifest', href: '/favicons/site.webmanifest' }],
        ['link', { rel: 'shortcut icon', href: '/favicons/favicon.ico' }],
        ['meta', { name: 'msapplication-config', content: '/favicons/browserconfig.xml' }],
        ['meta', { name: 'theme-color', content: '#0e4688' }],

        // Open Graph / social embed (Discord, Facebook, etc.)
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'Pterodactyl 繁體中文文件' }],
        ['meta', { property: 'og:title', content: 'Pterodactyl 繁體中文文件' }],
        ['meta', { property: 'og:description', content: 'Pterodactyl 是一款採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板，本站提供完整的繁體中文安裝、設定與疑難排解文件。' }],
        ['meta', { property: 'og:url', content: 'https://pterodactyl.tw/' }],
        ['meta', { property: 'og:image', content: 'https://pterodactyl.tw/og-image.png' }],
        ['meta', { property: 'og:image:width', content: '1200' }],
        ['meta', { property: 'og:image:height', content: '630' }],
        ['meta', { property: 'og:locale', content: 'zh_TW' }],

        // Twitter/X card (Discord also respects this as a fallback)
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: 'Pterodactyl 繁體中文文件' }],
        ['meta', { name: 'twitter:description', content: 'Pterodactyl 是一款採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板，本站提供完整的繁體中文安裝、設定與疑難排解文件。' }],
        ['meta', { name: 'twitter:image', content: 'https://pterodactyl.tw/og-image.png' }],
    ],
    themeConfig: {
        repo: 'Pterodactyl-TW/panel',
        docsRepo: 'Pterodactyl-TW/documentation',
        repoLabel: 'GitHub',
        editLinkText: '幫助我們改善此頁面',
        editLinks: true,
        logo: '/logos/pterry.svg',
        nav: [
            {
                text: 'Eggs',
                link: 'https://eggs.pterodactyl.tw/',
            },
            {
                text: '文件',
                link: '/project/introduction.md',
            },
            {
                text: '社群指南',
                link: '/community/about.md',
            },
            {
                text: '取得幫助',
                link: 'https://pterodactyl.tw/discord'
            },
            {
                text: 'API',
                link: 'https://dashflo.net/docs/api/pterodactyl/v1/'
            }
        ],
        sidebar: {
            '/community/': [
                {
                    title: '社群指南',
                    collapsable: false,
                    children: [
                        '/community/about.md',
                    ]
                },
                {
                    title: 'Panel 安裝',
                    collapsable: false,
                    children: [
                        '/community/installation-guides/panel/centos7.md',
                        '/community/installation-guides/panel/centos8.md',
                        '/community/installation-guides/panel/debian.md',
                    ]
                },
                {
                    title: 'Wings 安裝',
                    collapsable: false,
                    children: [
                        '/community/installation-guides/wings/centos7.md',
                        '/community/installation-guides/wings/centos8.md',
                    ]
                },
                {
                    title: '建立 Eggs',
                    collapsable: false,
                    children: [
                        '/community/config/eggs/creating_a_custom_egg.md',
                        '/community/config/eggs/creating_a_custom_image.md',
                    ],
                },
                {
                    title: '遊戲設定',
                    collapsable: false,
                    children: [
                        '/community/games/minecraft.md',
                    ],
                },
                {
                    title: '教學',
                    collapsable: false,
                    children: [
                        '/community/config/nodes/add_node.md',
                        '/community/tutorials/artisan.md',
                    ],
                },
                {
                    title: '自訂',
                    collapsable: false,
                    children: [
                        '/community/customization/panel.md',
                        '/community/customization/wings.md',
                    ],
                },
            ],
            '/': [
                {
                    title: '專案資訊',
                    collapsable: false,
                    children: [
                        '/project/introduction.md',
                        '/project/about.md',
                        '/project/release-signing.md',
                        '/project/terms.md',
                        '/project/community.md',
                    ]
                },
                {
                    title: 'Panel',
                    collapsable: false,
                    path: '/panel/',
                    currentVersion: '1.0',
                    versions: [
                        {
                            title: '1.12',
                            name: '1.0',
                            status: 'stable',
                            children: [
                                '/getting_started',
                                '/webserver_configuration',
                                '/additional_configuration',
                                '/updating',
                                '/troubleshooting',
                                '/legacy_upgrade',
                            ]
                        },
                        {
                            title: '0.7',
                            name: '0.7',
                            status: 'eol',
                            children: [
                                '/getting_started',
                                '/webserver_configuration',
                                '/configuration',
                                '/upgrading',
                                '/troubleshooting',
                            ]
                        }
                    ]
                },
                {
                    title: 'Wings',
                    collapsable: false,
                    path: '/wings/',
                    currentVersion: '1.0',
                    versions: [
                        {
                            title: '1.12',
                            name: '1.0',
                            status: 'stable',
                            children: [
                                '/installing',
                                '/upgrading',
                                '/migrating',
                                '/configuration',
                            ]
                        },
                        {
                            title: 'Daemon 0.6',
                            name: '0.6',
                            status: 'eol',
                            basePath: '/daemon/0.6',
                            children: [
                                '/installing',
                                '/configuration',
                                '/kernel_modifications',
                                '/standalone_sftp',
                                '/upgrading',
                            ]
                        }
                    ]
                },
                {
                    title: '教學',
                    collapsable: false,
                    children: [
                        '/tutorials/mysql_setup.md',
                        '/tutorials/creating_ssl_certificates.md',
                    ],
                },
                {
                    title: '指南',
                    collapsable: false,
                    children: [
                        '/guides/mounts.md',
                    ],
                },
            ],
        },
    },
    postcss: {
        plugins: [
            require('postcss-import'),
            require('tailwindcss')('./tailwind.js'),
            require('precss'),
            require('autoprefixer'),
            require('cssnano'),
        ]
    },
};