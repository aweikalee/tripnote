<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Tag from '@/components/Tag.vue'
import Field from '@/components/Field.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

@Component({
    components: {
        Tag,
        Field,
        ErrorMessage
    }
})
export default class Tags extends Vue {
    @Prop({ type: Array, default: () => [] })
    value!: string[]
    @Prop()
    errorMessage!: string
    @Prop()
    maxLength!: number
    inputValue = ''
    inputError = ''

    add() {
        const value = this.inputValue
        if (value) {
            if (this.maxLength && value.length > this.maxLength) {
                this.inputError = `不能超过${this.maxLength}个字符`
                return
            }
            if (this.value.filter((item) => item === value).length === 0) {
                this.value.push(value)
                this.$emit('input', this.value)
            } else {
                this.inputError = '存在重复'
                return
            }
        }
        this.inputError = ''
        this.inputValue = ''
    }
    remove(tag: string) {
        this.value.splice(this.value.indexOf(tag), 1)
        this.$emit('input', this.value)
    }
}
</script>

<template>
    <div class="cmpt-tags">
        <ErrorMessage :error-message="errorMessage || inputError"></ErrorMessage>
        <Tag
            v-for="item in value"
            :key="JSON.stringify(item)"
            icon
            icon-text="&#xe60b;"
            @click="remove(item)"
        >
            <slot :item="item">{{item}}</slot>
        </Tag>
        <Field
            class="cmpt-tags__input"
            v-model="inputValue"
            type="text"
            @keyup.enter="add"
            placeholder="请输入"
            width="mini"
        />
    </div>
</template>

<style lang="scss">
@import '../style.scss';
.cmpt-tags {
    &__error-message {
        font-size: 0.8em;
        color: $c-danger;
    }
    &__input {
        font-size: 0.8em;
        color: $c-333;
        border-radius: 0.6rem;
        display: inline-block;
        font-size: 1.4rem;
        line-height: 1.5;
        vertical-align: middle;
        margin: 0.6rem 0;
        .cmpt-field__input {
            padding-top: 0.6rem;
            padding-bottom: 0.6rem;
        }
    }
}
</style>
