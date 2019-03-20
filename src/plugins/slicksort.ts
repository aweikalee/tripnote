import { VueConstructor } from 'vue'
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort'

export default {
    install(vue: VueConstructor) {
        vue.component('slick-list', SlickList)
        vue.component('slick-item', SlickItem)
        vue.directive('slick-handle', HandleDirective)
    }
}
