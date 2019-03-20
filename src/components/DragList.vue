<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'

// FIXME: 拖拽时自动滚动无效，源码级别的问题，有空再去提一个PR
@Component
export default class DragList extends Vue {
    @State loggedin!: boolean
    @Prop()
    value?: any[]
    @Prop({ type: Boolean, default: false })
    useDragHandle?: boolean
    @Prop({ type: Number, default: 0 })
    pressDelay?: number
    check() {
        return !this.loggedin
    }
}
</script>

<template>
    <slick-list
        class="cmpt-draglist"
        :value="value"
        v-on="$listeners"
        v-bind="$attrs"
        helperClass="cmpt-draglist__active"
        :pressDelay="pressDelay"
        :pressThreshold="3"
        :shouldCancelStart="check"
        :useDragHandle="useDragHandle"
    >
        <slot></slot>
    </slick-list>
</template>

<style lang="scss">
@import '../style.scss';

@keyframes shake {
    0% {
        transform: translate3d(1px, 0, 0) rotate(-0.5deg);
    }
    25% {
        transform: translate3d(0, -1px, 0) rotate(0deg);
    }
    75% {
        transform: translate3d(-1px, 0, 0) rotate(0.5deg);
    }
    100% {
        transform: translate3d(0, 1px, 0) rotate(0deg);
    }
}
.cmpt-draglist {
    &__active {
        cursor: pointer;
        & > * {
            animation: shake 0.1s infinite;
        }
    }
}
</style>
