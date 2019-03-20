<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Ripple from '@/components/Ripple'

@Component({
    components: {
        Ripple
    }
})
export default class Card extends Vue {
    $refs!: {
        label: HTMLElement
    }

    @Prop({ type: Boolean })
    label!: boolean
    @Prop({ type: String, default: 'primary' })
    labelColor!: string

    minHeight: string = 'auto'
    setMinHeight() {
        this.minHeight = this.label
            ? `${this.$refs.label.offsetWidth}px`
            : 'auto'
    }
    mounted() {
        this.setMinHeight()
    }
    updated() {
        this.setMinHeight()
    }
}
</script>

<template>
    <component
        :is="$attrs.to ? 'Ripple' : 'div'"
        v-bind="$attrs"
        v-on="$listeners"
        class="cmpt-card"
    >
        <div
            class="cmpt-card-box"
            :class="{'cmpt-card-box__with__label': label}"
            :style="`min-height: ${minHeight}`"
        >
            <div class="cmpt-card__label" v-if="label" :class="`cmpt-card__label--${labelColor}`">
                <div class="cmpt-card__label-text" ref="label">
                    <slot name="label"></slot>
                </div>
            </div>
            <slot></slot>
        </div>
    </component>
</template>

<style lang="scss">
@import '../style';

.cmpt-card {
    // position: relative;
    overflow: hidden;
    box-shadow: box-shadow(1);
    background-color: $c-white;
    &:hover {
        box-shadow: box-shadow(2);
    }
    transition: box-shadow 0.3s ease;
}
.cmpt-card-box {
    position: relative;
    width: 100%;
    box-sizing: border-box;
}
.cmpt-card-box__with__label {
    padding-left: 4.5rem;
}
.cmpt-card__label {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4.5rem;
    color: $c-white;
    font-size: 2.6rem;
    text-shadow: $text-shadow-normal;
    &-text {
        transform-origin: 0 0;
        transform: rotate(90deg) translate3D(0, -100%, 0);
        display: inline-block;
        line-height: 4.5rem;
        height: 4.5rem;
        white-space: nowrap;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 1.2rem;
    }
    &--primary {
        background-color: $c-primary;
    }
    &--pink {
        background-color: $c-pink;
    }
    &--orange {
        background-color: $c-orange;
    }
    &--gray {
        background-color: $c-f0;
    }
}
</style>
