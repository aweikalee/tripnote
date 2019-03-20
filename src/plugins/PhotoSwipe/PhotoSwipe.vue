<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import PSWP from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

@Component({
    components: {}
})
export default class PhotoSwipe extends Vue {
    $refs!: {
        pswp: HTMLElement
    }
    show = false

    init(lists: Element[] = [], index: number = 0) {
        if (!lists.length) {
            return
        }
        this.show = true
        this.$nextTick(() => {
            this.open(lists, index)
        })
    }
    open(lists: Element[] = [], index: number = 0) {
        /* 将Element[]转化成pswp所需要的数组 */
        const items = Array.prototype.map.call(lists, (item: HTMLElement) => {
            return {
                src: item.dataset.src,
                msrc: item.dataset.msrc || item.dataset.src,
                w: item.offsetWidth || 0,
                h: item.offsetHeight || 0
            }
        }) as PSWP.Item[]
        const options = {
            index,
            history: false,
            barsSize: { top: 0, bottom: 'auto' },
            getThumbBoundsFn() {
                /* 获取目标位置 用于打开和关闭时的图片特效 */
                const thumbnail = lists[index]
                const pageYScroll =
                    window.pageYOffset || document.documentElement.scrollTop
                const rect = thumbnail.getBoundingClientRect()
                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                }
            }
        }

        /* 实例化 */
        const instance = new PSWP(
            this.$refs.pswp,
            PhotoSwipeUI_Default, // UI控件
            items,
            options
        )

        /* 获取图片真实长宽 */
        instance.listen('imageLoadComplete', (i, item) => {
            const img = new Image()
            img.src = item.src
            img.onload = () => {
                item.w = img.width
                item.h = img.height
                instance.updateSize(true)
            }
        })

        /* 销毁dom */
        instance.listen('close', () => {
            this.show = false
        })
        instance.init()
    }
}
</script>

<template>
    <div class="cmpt-photoswipe" v-if="show">
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref="pswp">
            <div class="pswp__bg"></div>
            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <div class="pswp__counter"></div>
                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                        <!-- <button class="pswp__button pswp__button--share" title="Share"></button> -->
                        <!-- <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> -->
                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>-->
                    <button
                        class="pswp__button pswp__button--arrow--left"
                        title="Previous (arrow left)"
                    ></button>
                    <button
                        class="pswp__button pswp__button--arrow--right"
                        title="Next (arrow right)"
                    ></button>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../style.scss';

// .pswp__zoom-wrap {
//     transition:  none !important;
// }
// .pswp__img {
//     opacity: 0;
//     transition: opacity 3s ease !important;
// }
// .pswp--animated-in .pswp__img {
//     opacity: 1;
// }
</style>
