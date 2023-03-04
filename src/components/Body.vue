<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Body extends Vue {
    @Prop({ type: Boolean, default: false })
    padding!: boolean
    @Prop({ type: Boolean, default: false })
    background!: boolean
}
</script>

<template>
    <div class="cmpt-body" :class="{ padding, background }">
        <div class="cmpt-body__prepend" v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </div>
        <div class="cmpt-body_content">
            <slot></slot>
        </div>
        <div class="safe-area-inset-bottom"></div>
    </div>
</template>

<style lang="scss">
@import '../style';

$c-body-background: #fafafa;
.cmpt-body {
    max-width: 800px;
    margin: 0 auto;
    min-height: 100vh;
    padding-bottom: 5.7rem;
    box-sizing: border-box;
    &.padding &_content {
        padding-left: 1.2rem;
        padding-right: 1.2rem;
    }
    &.background {
        background: $c-body-background;
        box-shadow: -10rem -10rem 10rem $c-body-background,
            -10rem 10rem 10rem $c-body-background,
            10rem -10rem 10rem $c-body-background,
            10rem 10rem 10rem $c-body-background;
    }
    &__prepend {
        position: sticky;
        top: 0;
        z-index: 3;
        @media screen and (max-height: 585px) and (orientation: landscape) {
            /* 横屏取消固定 */
            position: static;
        }
    }
    .safe-area-inset-bottom {
        height: constant(safe-area-inset-bottom);
        height: env(safe-area-inset-bottom);
    }
}
</style>
