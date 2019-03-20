<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
    components: {}
})
export default class Fold extends Vue {
    $refs!: {
        wrapper: HTMLElement
        content: HTMLElement
    }
    @Prop({ type: Boolean, default: false })
    value!: boolean
    show = false
    requestAnimationFrameId?: number

    @Watch('value')
    onChange(value: boolean) {
        if (value) {
            this.show = true
        }
        this.$nextTick(() => {
            const { content, wrapper } = this.$refs
            if (!content || !wrapper) {
                return
            }
            const contentHeight = `${content.clientHeight}px`
            wrapper.style.height = value ? '0px' : contentHeight
            requestAnimationFrame(() => {
                wrapper.style.height = value ? contentHeight : '0px'
            })
        })
    }
    mounted() {
        if (this.value) {
            this.onChange(this.value)
        }
    }

    onEnd() {
        if (this.value) {
            this.$refs.wrapper.style.height = null
        } else {
            this.show = false
        }
    }
}
</script>

<template>
    <div class="cmpt-fold" ref="wrapper" @transitionend="onEnd" style="height: 0px">
        <div ref="content" v-show="show">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
@import '../style';
.cmpt-fold {
    overflow: hidden;
    transition: height 0.3s ease;
}
</style>
