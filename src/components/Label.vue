<template>
    <div class="cmpt-label" :class="{'margin-top': marginTop}">
        <div class="cmpt-label__title" :title="title">
            <slot>{{ title }}</slot>
        </div>
        <div class="cmpt-label__description" v-if="description || $slots.description">
            <slot name="description">{{ description }}</slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Label extends Vue {
    @Prop()
    title!: string
    @Prop()
    description!: string
    @Prop({type: Boolean, default: true})
    marginTop!: boolean
}
</script>

<style lang="scss">
@import '../style.scss';

.cmpt-label {
    font-size: 1.6rem;
    color: $c-333;
    margin-bottom: 0.6rem;
    word-wrap: normal;
    word-break: keep-all;
    overflow: hidden;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    word-wrap: break-word;
    word-break: break-all;
    &.margin-top {
        margin-top: 1.8rem;
    }
    &__title {
        font-weight: bold;
        margin-right: 1.2rem;
        vertical-align: middle;
    }
    &__description {
        font-size: 0.8em;
        margin-right: 1.2rem;
        vertical-align: middle;
        color: $c-999;
    }
}
</style>
