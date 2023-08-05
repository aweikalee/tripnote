/// <reference types="vite-plugin-pwa/client" />

declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare module 'vee-validate/dist/locale/zh_CN'
declare module 'marked'
declare module 'vue-virtual-scroller'
declare module 'element-ui/lib/*'
declare module 'register-service-worker'


declare interface ImportMeta {
    env: {
        VITE_FILE_PUBLIC: string
        VITE_FILE_SELF: string
        VITE_URL_BASE: string
        VITE_URL_SELF: string
    }
}

// declare module 'vue/types/vue' {
//     import { AxiosInstance } from 'axios'
//     interface Vue {
//         $http: AxiosInstance
//     }
// }
