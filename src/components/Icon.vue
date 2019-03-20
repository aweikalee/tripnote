<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Icon extends Vue {
    @Prop({ default: '' })
    value!: string
}
</script>

<template>
    <span class="cmpt-iconfont">
        <slot><span v-html="value"></span></slot>
    </span>
</template>

<style lang="scss">
@font-face {
    font-family: 'cmpt-iconfont';
    src: url('../assets/font/iconfont.woff') format('woff'),
        url('../assets/font/iconfont.ttf') format('truetype');
}
.cmpt-iconfont {
    font-family: 'cmpt-iconfont' !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    font-size: inherit;
    user-select: none;
}
</style>
