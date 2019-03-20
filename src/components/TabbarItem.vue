<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { RedirectOption } from 'vue-router'

@Component({
    components: {
    }
})
export default class TabbarItem extends Vue {
    @Prop()
    to!: RedirectOption

    @Prop()
    value!: string

    @Prop()
    active!: string | string[]

    checkActive() {
        if (this.active === void 0 || this.value === void 0) {
            return false
        }
        const active =
            typeof this.active === 'string' ? [this.active] : this.active
        return active.includes(this.value)
    }
}
</script>

<template>
    <component :is="to ? 'router-link' : 'div'" :to="to" class="cmpt-tabbar-item" :class="{active: checkActive()}">
        <div class="cmpt-tabbar-item__icon" v-if="$slots.icon">
            <slot name="icon"></slot>
        </div>
        <div class="cmpt-tabbar-item__text" v-if="$slots.default">
            <slot></slot>
        </div>
    </component>
</template>

<style lang="scss" scoped>
@import '../style';

.cmpt-tabbar-item {
    user-select: none;
    line-height: 1;
    color: $c-ccc;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &.active {
        color: $c-primary-font;
    }
    &:active {
        @include color-active(color, $c-primary-font);
    }
}
.cmpt-tabbar-item__icon {
    font-size: 2.4rem;
}
.cmpt-tabbar-item__text {
    font-size: 1rem;
}
</style>
