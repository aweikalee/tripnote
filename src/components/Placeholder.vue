<template>
    <span class="cmpt-placeholder__image" v-if="type === 'image'"></span>
    <span class="cmpt-placeholder__text" v-else>
        <slot>{{ createText() }}</slot>
    </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Placeholder extends Vue {
    /* 占位符类型 text, image */
    @Prop({ type: String, default: 'text' })
    type?: string

    /* 占位符字数 仅在text时有效 */
    @Prop({ type: Number, default: 5 })
    length?: number

    /* 占位符字数（随机）， 仅在text时有效 如果设置了该值则会忽略length */
    @Prop({ type: Array })
    random?: number[]

    createText() {
        const arr: string[] = []
        if (this.random && this.random.length >= 2) {
            arr.length = Math.floor(
                Math.random() * (this.random[1] - this.random[0] + 1) +
                    this.random[0]
            )
        } else {
            arr.length = (this.length || 0) + 1
        }
        return arr.join('a')
    }
}
</script>

<style lang="scss">
@import '../style';

.cmpt-placeholder__text {
    color: transparent !important;
    word-break: break-all;
}

.cmpt-placeholder__image {
    display: inline-block;
    width: 1em;
    height: 1em;
}
@keyframes cmpt-placeholder__shimmer {
    0% {
        background-position: -300px 0;
    }
    100% {
        background-position: 300px 0;
    }
}

.cmpt-placeholder__text,
.cmpt-placeholder__image {
    user-select: none;
    background-color: $c-f0 !important;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: cmpt-placeholder__shimmer;
    animation-timing-function: linear;
    background: linear-gradient(to right, $c-f0 30%, #e5e5e5 50%, $c-f0 70%);
    background-size: 600px 104px;
}
</style>
