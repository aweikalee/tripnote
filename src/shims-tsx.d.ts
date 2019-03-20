import Vue, { VNode } from 'vue'
import { BMap } from './config'

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {}
        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {}
        interface IntrinsicElements {
            [elem: string]: any
        }
    }
    interface Window {
        BMap: any
        BMAP_ANIMATION_BOUNCE: any
        BMapLoader: any
    }
}
