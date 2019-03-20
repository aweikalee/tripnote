import Vue, { VueConstructor } from 'vue'
import PhotoSwipe from './PhotoSwipe.vue'
// import 'photoswipe/dist/photoswipe.css'
// import 'photoswipe/dist/default-skin/default-skin.css'
import './photoswipe.css'
import './default-skin/default-skin.css'

/*
 * 使用方法，在需要使用图片浏览的地方 在父级对象上使用v-preview指令
 * 然后在图片添加 标签属性 data-src="url"，
 * 如：
 * <div v-preview>
 *     <img src="photo.jpg" data-src="photo.jpg"/>
 * </div>
 *
 * 若当前使用的是缩略图 则再添加 data-msrc="url"
 * <div v-preview>
 *     <img src="mini-photo.jpg" data-src="photo.jpg" data-msrc="mini-photo.jpg"/>
 * </div>
 */

let instance: any
function mount() {
    if (instance) {
        return instance
    }
    instance = new (Vue.extend(PhotoSwipe))().$mount()
    document.body.appendChild(instance.$el)

    return instance
}

export default {
    install(vue: VueConstructor) {
        vue.directive('preview', {
            bind(parent) {
                /* 在使用了指令的父对象上绑定事件 */
                parent.addEventListener('click', (e) => {
                    /* 判断点击的对象似乎否存在 data-src 属性 */
                    const target = e.target as HTMLElement
                    if (!target.dataset.src) {
                        return
                    }
                    /* 获取父对象下所有存在 data-src 属性的元素 */
                    const lists = parent.querySelectorAll('[data-src]')
                    const index = Array.prototype.indexOf.call(lists, target)

                    const swipe = mount()
                    swipe.init(lists, index)
                })
            }
        })
    }
}
