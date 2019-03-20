<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Ripple from '@/components/Ripple'
import { RedirectOption } from 'vue-router'

@Component({
    components: {
        Ripple
    }
})
export default class Button extends Vue {
    /* 文本内容 */
    @Prop({ type: String, default: '' })
    text!: string

    /* HTML标签 */
    @Prop({ type: String, default: 'button' })
    tag!: string

    /* 类型 控制样式 default, primary, warning, danger */
    @Prop({ type: String, default: 'default' })
    type!: string

    /* 标签原始的type属性 */
    @Prop({ type: String })
    nativeType!: string

    /* 禁用 */
    @Prop({ type: Boolean })
    disabled!: boolean

    /* 显示加载图标 */
    @Prop({ type: Boolean, default: false })
    loading!: boolean

    /* 圆角 */
    @Prop({ type: Boolean })
    round!: boolean

    /* 高度 */
    @Prop({ type: String, default: 'large' })
    height!: string

    onClick(event: MouseEvent | Touch) {
        if (!this.loading && !this.disabled) {
            this.$emit('click', event)
        }
    }
    get attrs() {
        return {
            ...this.$attrs,
            tag: this.tag,
            type: this.nativeType,
            disabled: this.disabled
        }
    }
}
</script>

<template>
    <component
        :is="(disabled || loading) ? tag : 'Ripple'"
        class="cmpt-button"
        :class="{'cmpt-button--round': round, 'cmpt-button--disabled': disabled, [`cmpt-button--${type}`]: type, [`cmpt-button--h-${height}`]: height, }"
        v-bind="attrs"
        v-on="$listeners"
        v-loading="loading"
    >
        <slot>{{ text }}</slot>
    </component>
</template>

<style lang="scss">
@import '../style.scss';

.cmpt-button {
    appearance: none;
    user-select: none;
    box-sizing: border-box;
    height: 4.5rem;
    line-height: 4.4rem;
    border: none;
    background-color: $c-white;
    color: $c-666;
    text-align: center;
    font-size: 1.4rem;
    cursor: pointer;
    overflow: hidden;
    padding: 0 0.6rem;
    display: block;
    width: 100%;
    text-shadow: $text-shadow-normal;

    &:hover,
    &:focus {
        background-color: $c-f5;
    }
    &--default {
        background-color: $c-eee;
        text-shadow: none;
    }
    &--primary {
        background-color: $c-primary;
        color: $c-white;
        border-color: transparent;
        &:hover,
        &:focus {
            @include color-hover(background-color, $c-primary);
        }
    }
    &--warning {
        background-color: $c-warning;
        color: $c-white;
        border-color: transparent;
        &:hover,
        &:focus {
            @include color-hover(background-color, $c-warning);
        }
    }
    &--danger {
        background-color: $c-danger;
        color: $c-white;
        border-color: transparent;
        &:hover,
        &:focus {
            @include color-hover(background-color, $c-danger);
        }
    }

    & &__loading {
        display: inline-block;
    }
    &--round {
        border-radius: 0.8rem;
    }
    &--disabled {
        filter: grayscale(0.5) brightness(0.9);
    }
    &--h {
        &-medium {
            height: 3.6rem;
            line-height: 3.5rem;
        }
        &-small {
            height: 3rem;
            line-height: 2.9rem;
        }
        &-mini {
            height: 2.4rem;
            line-height: 2.3rem;
        }
    }
}
</style>
