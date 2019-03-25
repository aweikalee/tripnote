import Vue, { VueConstructor } from 'vue'
import VPreviews from 'v-previews'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
// import 'photoswipe/dist/photoswipe.css'
// import 'photoswipe/dist/default-skin/default-skin.css'
import './photoswipe.css'
import './default-skin/default-skin.css'

export default {
    install(vue: VueConstructor) {
        vue.use<VPreviews.Options>(VPreviews, {
            photoswipe: PhotoSwipe,
            ui: PhotoSwipeUI_Default,
            options: {
                barsSize: { top: 0, bottom: 'auto' }
            }
        })
    }
}
