import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import { VitePWA } from "vite-plugin-pwa"
import px2rem from "postcss-plugin-px2rem"
import autoprefixer from "autoprefixer"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          "element-ui": ["element-ui"],
          "monaco-editor": ["monaco-editor"],
          echarts: ["echarts"],
          "vee-validate": ["vee-validate"],
        },
      },
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },

  resolve: {
    alias: {
      "@": "/src",
      "vue-class-component": "vue-class-component/lib",
    },
  },

  css: {
    postcss: {
      plugins: [
        px2rem({
          rootValue: 10,
          minPixelValue: 3,
          exclude:
            /(node_modules)|(index\.html)|(src\/(App|views|components|style))/,
        }),
        autoprefixer,
      ],
    },
  },

  plugins: [
    vue(),

    VitePWA({
      registerType: "prompt",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              if (!url.pathname.startsWith("/assets/")) return false

              return /\.(js|css|html|ico|jpg|jpeg|png|svg|ttf|woff|woff2)$/.test(
                url.pathname
              )
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 24 * 60 * 60 * 30, // 有效期30天
              },
            },
          },

          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 24 * 60 * 60 * 30, // 有效期30天
              },
            },
          },

          {
            /* 缓存oss图片 */
            urlPattern: ({ url }) =>
              url.hostname === "awwwk.oss-cn-hangzhou.aliyuncs.com",
            handler: "CacheFirst",
            options: {
              cacheName: "oss-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 * 30, // 有效期30天
              },
            },
          },
        ],
      },
      manifest: {
        name: "旅游手账 —— 毛呆",
        short_name: "旅游手账",
        display: "standalone",
        theme_color: "#4DBA87",
        background_color: "#000000",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        lang: "zh-CN",
      },
    }),

    // visualizer({
    //   open: true,
    //   gzipSize: true,
    // }),
  ],
})
