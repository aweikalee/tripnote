<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Tag from '@/components/Tag.vue'
import { debounce } from '@/utils/timeInterval'

@Component({
    components: {
        Tag
    }
})
export default class ErrorMessage extends Vue {
    @Prop()
    value!: string | number
    @Prop({ default: '' })
    errorMessage!: string
    @Prop({ type: Boolean, default: false })
    noPadding!: boolean
    @Prop({ type: Boolean, default: false })
    center!: boolean

    @Watch('value')
    onInput() {
        debounce(this.emitInput, this, 500)
    }
    emitInput() {
        this.$emit('input', this.value)
    }
}
</script>

<template>
    <!-- 用v-show代替v-if 目的是为了让绑定在ErrorMessage上的valid能起作用 -->
    <div
        class="cmpt-error-message"
        :class="{padding: !noPadding, center: center}"
        v-show="errorMessage || $slots.default"
    >
        <slot>
            <span v-html="errorMessage"></span>
        </slot>
        <input type="hidden" v-bind="$attrs" v-on="$listeners" :value="value">
    </div>
</template>

<style lang="scss">
@import '../style';
.cmpt-error-message {
    font-size: 0.8em;
    color: $c-danger;
    &.padding {
        padding: 0.6rem 1.2rem;
    }
    &.center {
        text-align: center;
    }
}
</style>
