import Vue from 'vue'
import 'normalize.css'
import router from './router'
import store from './store'
import App from './App.vue'
import elementUI from './plugins/element'
import VeeValidate from '@/plugins/VeeValidate'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import slicksort from './plugins/slicksort'
import PhotoSwipe from './plugins/PhotoSwipe'


Vue.use(elementUI)
Vue.use(VeeValidate, {
    locale: 'zh_CN',
    delay: 150
})
Vue.use(VueVirtualScroller)
Vue.use(slicksort)
Vue.use(PhotoSwipe)

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
