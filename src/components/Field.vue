<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
import IconButton from '@/components/IconButton.vue'

@Component({
    components: {
        IconButton
    },
    props: {
        label: String,
        border: {
            type: Boolean,
            default: true
        },
        readonly: Boolean,
        clearable: Boolean,
        required: Boolean,
        isLink: Boolean,
        labelAlign: String,
        inputAlign: String,
        autosize: Boolean
    }
})
export default class Field extends Vue {
    $refs!: {
        input: HTMLInputElement
    }
    @Prop()
    value!: string

    @Prop({ type: String, default: 'text' })
    type!: string
    @Prop({ type: Boolean })
    error!: boolean
    @Prop({ type: Boolean })
    select!: boolean
    @Prop()
    tabindex!: string | number
    @Prop({ type: String, default: 'large' })
    width!: string

    focused = false
    isOnComposition = false

    onFocus() {
        this.focused = true
        this.$emit('focus')
    }
    onBlur() {
        this.focused = false
        this.$emit('blur')
    }
    onInput() {
        if (this.isOnComposition) {
            return
        }

        this.$emit('input', this.$refs.input.value)
        this.$nextTick(() => {
            this.$refs.input.value = this.value
        })
    }
    focus() {
        this.$refs.input.focus()
    }
    blur() {
        this.$refs.input.blur()
    }
    @Watch('value')
    onValue() {
        this.$nextTick(this.adjustSize)
    }
    adjustSize() {
        if (this.type !== 'textarea') {
            return
        }
        const { input } = this.$refs
        input.style.height = 'auto'
        const height = input.scrollHeight
        if (height) {
            input.style.height = height + 'px'
        }
    }
    onComposition(event: Event) {
        if (event.type === 'compositionstart') {
            this.isOnComposition = true
        }
        if (event.type === 'compositionend') {
            this.isOnComposition = false
            this.onInput()
        }
    }
    get listeners() {
        return {
            ...this.$listeners,
            input:
                this.type === 'number'
                    ? () => {
                          return
                      }
                    : this.onInput,
            focus: this.onFocus,
            blur:
                this.type === 'number'
                    ? () => {
                          this.onInput()
                          this.onBlur()
                      }
                    : this.onBlur,
            compositionstart: this.onComposition,
            compositionupdate: this.onComposition,
            compositionend: this.onComposition
        }
    }
    get attrs() {
        return {
            ...this.$attrs,
            value: this.value,
            type: this.type,
            tabindex: this.tabindex
        }
    }
    mounted() {
        this.$nextTick(this.adjustSize)
    }
}
</script>

<template>
    <div
        class="cmpt-field"
        :class="{
            'cmpt-field--focus': focused,
            'cmpt-field--error': error,
            [`cmpt-field--w-${width}`]: width
        }"
    >
        <div class="cmpt-field__prepend" v-if="$slots.prepend">
            <slot name="prepend"/>
        </div>
        <div class="cmpt-field__context">
            <textarea
                class="cmpt-field__input cmpt-field__textarea"
                ref="input"
                v-bind="attrs"
                v-on="listeners"
                rows="1"
                v-if="type === 'textarea'"
            />
            <input class="cmpt-field__input" ref="input" v-bind="attrs" v-on="listeners" v-else>
        </div>
        <div class="cmpt-field__append" v-if="$slots.append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<style lang="scss">
@import '../style.scss';

.cmpt-field {
    color: $c-666;
    position: relative;
    display: flex;
    align-items: center;
    border: 1px $c-ccc solid;
    border-radius: 0.6rem;
    overflow: hidden;
    &--w {
        &-mini {
            max-width: 10rem;
        }
        &-small {
            max-width: 20rem;
        }
        &-medium {
            max-width: 30rem;
        }
    }
    &--error {
        border-color: $c-danger;
    }
    &--focus {
        border-color: $c-primary;
    }
    &__context {
        flex: 1;
    }
    &__input {
        display: block;
        width: 100%;
        appearance: none;
        border: none;
        padding: 0.8rem 1.2rem;
        margin: 0;
        box-sizing: border-box;
        background-color: transparent;
        font: inherit;
        color: inherit;
        line-height: 1.5;
        height: 3.6rem;
        resize: none;
        // overflow: hidden;
        &:disabled {
            opacity: 0.8;
        }
        &::placeholder {
            color: $c-ccc;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            appearance: none;
        }
    }

    &__textarea {
        /* 隐藏滚动条 尽可能避免滚动条的突然出现 */
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
        }
        &::-webkit-scrollbar-track {
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: transparent;
            &:hover {
                background-color: transparent;
            }
        }
    }
    &__prepend,
    &__append {
        flex-grow: 0;
        .el-input__inner {
            border: none;
        }
    }
    &__prepend {
        border-right: 1px $c-ccc solid;
    }
    &__append {
        border-left: 1px $c-ccc solid;
    }
}
</style>
