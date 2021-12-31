const mocks = require('./mocks/server.js')
const tsImportPluginFactory = require('ts-import-plugin') // 按需引入组件库
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // 打包文件体积和依赖分析
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin') // 编辑器组件
const CompressionPlugin = require('compression-webpack-plugin') // Gzip

const env = process.env
env.VUE_APP_TITLE = '旅游手账 —— 毛呆'
env.VUE_APP_SHORT_TITLE = '旅游手账'
module.exports = {
    publicPath: env.VUE_APP_URL_BASE,
    assetsDir: `${env.VUE_APP_FILE_SELF}/vue`, // vue打包文件输出的路径
    outputDir: `dist/${env.VUE_APP_FILE_PUBLIC}`, // 定义打包输出的根路径
    indexPath: '../index.html',
    parallel: false, // 由于ts-import-plugin的问题 build时必须将该选项设为false
    productionSourceMap: false, // 关闭生成 Source Map
    pwa: {
        name: env.VUE_APP_SHORT_TITLE,
        themeColor: '#4DBA87',
        msTileColor: '#ffffff',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'default',
        workboxPluginMode: 'GenerateSW',
        manifestPath: env.VUE_APP_FILE_SELF + '/manifest.json',
        // 该设置是自行修改的@vue/cli-plugin-pwa所支持的属性
        // 用于生成manifest.json文件，但官方目前还没有通过这个PR
        // manifestOptions: {
        //     name: env.VUE_APP_TITLE,
        //     short_name: env.VUE_APP_SHORT_TITLE,
        //     start_url: '/pwa/tripnote',
        //     icons: (() => {
        //         const iconPaths = [
        //             {
        //                 src: './img/icons/android-chrome-192x192.png',
        //                 sizes: '32x32',
        //                 type: 'image/png'
        //             },
        //             {
        //                 src: './img/icons/android-chrome-192x192.png',
        //                 sizes: '192x192',
        //                 type: 'image/png'
        //             },
        //             {
        //                 src: './img/icons/android-chrome-512x512.png',
        //                 sizes: '512x512',
        //                 type: 'image/png'
        //             }
        //         ]
        //         return iconPaths
        //     })()
        // },
        iconPaths: (() => {
            const iconPaths = {
                favicon32: 'favicon-32x32.png',
                favicon16: 'favicon.ico',
                appleTouchIcon: 'apple-touch-icon.png',
                // maskIcon: 'img/icons/safari-pinned-tab.svg',
                msTileImage: 'android-chrome-192x192.png'
            }
            for (let i in iconPaths) {
                iconPaths[i] = env.VUE_APP_FILE_SELF + '/' + iconPaths[i]
            }
            return iconPaths
        })(),
        workboxOptions: {
            // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
            swDest: `../sw-${env.VUE_APP_FILE_SELF}.js`,
            precacheManifestFilename: `${
                env.VUE_APP_FILE_SELF
            }/precache-manifest.[manifestHash].js`,
            importWorkboxFrom: 'local',
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
                {
                    /* 缓存pwa文件夹下所有文件 */
                    urlPattern: new RegExp('/pwa/'),
                    handler: 'staleWhileRevalidate',
                    options: {
                        cacheName: 'html-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 24 * 60 * 60 * 30 // 有效期30天
                        }
                    }
                },
                {
                    urlPattern: new RegExp(
                        `/${
                            env.VUE_APP_FILE_SELF
                        }/v1/(itinerar(y|ies)|schedule|detail|position|config)`
                    ),
                    handler: 'networkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxEntries: 500,
                            maxAgeSeconds: 24 * 60 * 60 * 30 // 有效期30天
                        }
                    }
                },
                {
                    /* 缓存oss图片 */
                    urlPattern: new RegExp('^http(s?)://awwwk.oss-cn-hangzhou.aliyuncs.com/'),
                    handler: 'cacheFirst',
                    options: {
                        cacheName: 'img-cache',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 24 * 60 * 60 * 30 // 有效期30天
                        }
                    }
                }
            ]
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-plugin-px2rem')({
                        rootValue: 10,
                        minPixelValue: 3,
                        exclude: /(node_modules)|(src\\(App|views|components|style))/
                    }),
                    require('autoprefixer')
                ]
            }
        }
    },
    configureWebpack: {
        plugins: [
            // new BundleAnalyzerPlugin({ analyzerPort: 9000 }), // 打包文件体积和依赖分析
            new MonacoWebpackPlugin({
                output: 'js/monaco',
                languages: ['markdown'],
                features: [
                    // 'accessibilityHelp',
                    // 'bracketMatching', //括号匹配
                    // 'caretOperations',
                    'clipboard', // 右键复制粘贴
                    // 'codeAction',
                    // 'codelens',
                    'colorDetector', // 着色器
                    'comment', // 注释
                    'contextmenu', // 右键菜单替换
                    // 'coreCommands', // ？？？
                    // 'cursorUndo', // ？？？
                    'dnd', // 文本拖拽
                    'find', // 查找替换
                    // 'folding', // 代码折叠 markdown中几乎没用
                    // 'fontZoom', // 字体放大
                    // 'format',
                    // 'goToDefinitionCommands',
                    // 'goToDefinitionMouse',
                    // 'gotoError',
                    'gotoLine',
                    // 'hover',
                    // 'inPlaceReplace',
                    // 'inspectTokens',
                    // 'iPadShowKeyboard',
                    // 'linesOperations',
                    'links', // 打开链接
                    'multicursor', // 选中相同的内容
                    // 'parameterHints', // 参数提示
                    // 'quickCommand', // F1 文本命令
                    // 'quickOutline',
                    // 'referenceSearch',
                    // 'rename',
                    // 'smartSelect',
                    // 'snippets',
                    // 'suggest', // 智能提示
                    // 'toggleHighContrast',
                    // 'toggleTabFocusMode',
                    // 'transpose',
                    'wordHighlighter' // 高亮文本，multicursor的依赖
                    // 'wordOperations',
                    // 'wordPartOperations'
                ]
            }),
            // new CompressionPlugin({
            //     test: /\.js$|\.html$|\.css/,
            //     threshold: 10240,
            //     deleteOriginalAssets: false
            // })
        ]
    },
    chainWebpack: (config) => {
        /* 拦截请求 返回mock数据 */
        config.devServer.set('before', (app) => {
            app.use(
                '/',
                (req, res, next) => {
                    setTimeout(next, Math.random() * 700 + 100) // 模拟请求响应时间
                },
                mocks
            )
        })

        /* 压缩index.html */
        if (env.NODE_ENV === 'production') {
            config.plugin('html').tap((args) => {
                args[0].minify.minimize = true
                args[0].minify.minifyCSS = true
                args[0].minify.minifyJS = true
                return args
            })
        }
    }
}
