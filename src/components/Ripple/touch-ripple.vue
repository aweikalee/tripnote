<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import CircleRipple from './circle-ripple.vue'

interface ICircle {
    key: number
    styles: any
}

@Component({
    components: {
        CircleRipple
    }
})
export default class Ripple extends Vue {
    $refs!: {
        wrapper: Element
    }

    nextKey: number = 0
    ripples: ICircle[] = []
    ignoreNextMouseDown: boolean = false
    handleMove!: any
    firstTouchX!: number
    firstTouchY!: number

    @Prop({ type: String, default: 'div' })
    tag!: string
    @Prop({ default: false })
    center!: boolean
    @Prop({ default: '#666' })
    color!: string
    @Prop({ default: 0.1 })
    opacity!: number
    @Prop()
    circleStyle!: string
    start(event: MouseEvent | Touch, isRippleTouchGenerated: boolean) {
        if (this.ignoreNextMouseDown && !isRippleTouchGenerated) {
            this.ignoreNextMouseDown = false
            return
        }
        const wrapper = this.getClientRect(this.$refs.wrapper)
        let x
        let y
        let size
        if (!this.center) {
            x = event.clientX - wrapper.left
            y = event.clientY - wrapper.top
            size = Math.sqrt(
                Math.pow(Math.max(x, wrapper.width - x), 2) +
                    Math.pow(Math.max(y, wrapper.height - y), 2)
            ) // 计算圆的半径
        } else {
            x = wrapper.width * 0.5
            y = wrapper.height * 0.5
            size = Math.sqrt(
                Math.pow(wrapper.width * 0.5, 2) +
                    Math.pow(wrapper.height * 0.5, 2)
            ) // 计算圆的半径
        }
        const styles = {
            left: x + 'px',
            top: y + 'px',
            width: size * 2 + 'px',
            height: size * 2 + 'px',
            marginLeft: -size + 'px',
            marginTop: -size + 'px',
            opacity: this.opacity,
            backgroundColor: this.color
        }
        this.ripples.push({
            key: this.nextKey++,
            styles
        })
        this.ignoreNextMouseDown = isRippleTouchGenerated
    }
    end() {
        if (this.ripples.length === 0) {
            return
        }
        this.ripples.splice(0, 1)
        this.stopListeningForScrollAbort()
    }
    handleTouchStart(event: TouchEvent) {
        if (event.touches) {
            this.startListeningForScrollAbort(event)
            this.start(event.touches[0], true)
        }
    }
    handleMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.start(event, false)
        }
    }
    getClientRect(el: Element) {
        const box = el.getBoundingClientRect()
        return {
            top: box.top,
            left: box.left,
            width: box.width,
            height: box.height
        }
    }
    stopListeningForScrollAbort() {
        if (!this.handleMove) {
            this.handleMove = this.handleTouchMove.bind(this)
        }
        removeEventListener('touchmove', this.handleMove, false)
    }
    startListeningForScrollAbort(event: TouchEvent) {
        this.firstTouchX = event.touches[0].clientX
        this.firstTouchY = event.touches[0].clientY
        addEventListener('touchmove', this.handleMove, false)
    }
    handleTouchMove(event: TouchEvent) {
        const deltaY = Math.abs(event.touches[0].clientY - this.firstTouchY)
        const deltaX = Math.abs(event.touches[0].clientX - this.firstTouchX)
        if (deltaY > 6 || deltaX > 6) {
            this.end()
        }
    }
}
</script>


<template>
    <component
        :is="$attrs.to ? 'router-link' : tag"
        v-bind="$attrs"
        v-on="$listeners"
        class="cmpt-ripple-box"
        @mousedown.native="handleMouseDown"
        @mouseup.native="end()"
        @mouseleave.native="end()"
        @touchstart.native="handleTouchStart"
        @touchend.native="end()"
        @touchcancel.native="end()"
        @mousedown.exact="handleMouseDown"
        @mouseup.exact="end()"
        @mouseleave.exact="end()"
        @touchstart.exact="handleTouchStart"
        @touchend.exact="end()"
        @touchcancel.exact="end()"
        ref="box"
    >
        <div class="cmpt-ripple-wrapper" ref="wrapper">
            <circleRipple
                :key="ripple.key"
                :styles="ripple.styles"
                :style="circleStyle"
                v-for="ripple in ripples"
            ></circleRipple>
        </div>
        <slot></slot>
    </component>
</template>

<style lang="scss">
.cmpt-ripple-box {
    display: block;
    position: relative;
}
.cmpt-ripple-wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}
</style>
