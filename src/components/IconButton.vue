<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RedirectOption } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

@Component({
    components: {
        Button,
        Icon
    }
})
export default class IconButton extends Vue {
    /* 文本内容 */
    @Prop({ type: String, default: '' })
    text!: string

    /* 使用激活样式 */
    @Prop({ type: Boolean, default: false })
    active!: boolean

    /* 使用阴影样式 */
    @Prop({ type: Boolean, default: false })
    shadow!: boolean
}
</script>

<template>
    <Button
        class="cmpt-icon-button"
        :class="{'cmpt-icon-button__no-active': !active, 'cmpt-icon-button__no-shadow': !shadow}"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <Icon :value="text">
            <slot></slot>
        </Icon>
    </Button>
</template>

<style lang="scss">
@import '../style.scss';

.cmpt-icon-button {
    border: none;
    font-size: 2.8rem;
    border-radius: 50%;
    width: 1.6em;
    height: 1.6em;
    line-height: 1.6em;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    padding: 0;
    &__no-shadow {
        text-shadow: none;
    }
    &__no-active {
        background-color: $c-f0;
        background-color: transparent;
        &:hover {
            @include color-hover(color, $c-333);
            background-color: transparent;
        }
        &.cmpt-button {
            &--default {
                background-color: transparent;
                color: $c-aaa;
                &:hover {
                    @include color-hover(color, $c-ccc);
                    background-color: transparent;
                }
            }
            &--primary {
                background-color: transparent;
                color: $c-primary-font;
                &:hover {
                    @include color-hover(color, $c-primary);
                    background-color: transparent;
                }
            }
            &--warning {
                background-color: transparent;
                color: $c-warning;
                border-color: transparent;
                &:hover {
                    @include color-hover(color, $c-warning);
                    background-color: transparent;
                }
            }
            &--danger {
                background-color: transparent;
                color: $c-danger;
                &:hover {
                    @include color-hover(color, $c-danger);
                    background-color: transparent;
                }
            }
        }
    }
}
</style>
