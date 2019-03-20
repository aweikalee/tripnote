<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Placeholder from '@/components/Placeholder.vue'
import IconButton from '@/components/IconButton.vue'

@Component({
    components: {
        Placeholder,
        IconButton
    }
})
export default class HeaderBar extends Vue {
    @Prop({ type: Boolean, default: false })
    placeholder!: boolean
    @Prop({ type: Boolean, default: true })
    shadow!: boolean
    @Prop({ type: Boolean, default: false })
    grid!: string
    @Prop()
    boxClass!: string
    get lineColor() {
        const colors = ['primary', 'pink', 'orange']
        const index = Math.floor(Math.random() * 3)
        return colors[index]
    }
}
</script>

<template>
    <header class="cmpt-headerbar">
        <div
            class="cmpt-headerbar__box"
            :class="{shadow, grid, [boxClass] : boxClass}"
            v-if="placeholder"
        >
            <div class="cmpt-headerbar__content">
                <div class="cmpt-headerbar__title">
                    <Placeholder class="block" :length="1"/>
                    <Placeholder :length="6"/>
                </div>
                <div class="cmpt-headerbar__icon">
                    <Placeholder type="image" class="cmpt-headerbar__icon__placeholder"/>
                    <Placeholder type="image" class="cmpt-headerbar__icon__placeholder"/>
                </div>
            </div>
        </div>
        <div class="cmpt-headerbar__box" :class="{shadow, grid, [boxClass] : boxClass}" v-else>
            <div class="cmpt-headerbar__content">
                <div class="cmpt-headerbar__title" v-if="$slots.default">
                    <span class="block">0</span>
                    <slot></slot>
                </div>
                <div class="cmpt-headerbar__icon" v-if="$slots.icon || $slots.more">
                    <slot name="icon"></slot>
                    <el-dropdown trigger="click" v-if="$slots.more">
                        <IconButton>&#xe618;</IconButton>
                        <el-dropdown-menu slot="dropdown" class="cmpt-headerbar__more">
                            <slot name="more"></slot>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="cmpt-headerbar__other">
                <slot name="other"></slot>
            </div>
        </div>
    </header>
</template>

<style lang="scss">
@import '../style.scss';

.cmpt-headerbar {
    display: flex;
    justify-content: center;
    padding-top: 0.6rem;
    &__box {
        border-radius: 0.6rem;
        background-color: $c-white;
        margin: 0 0.6rem;
        max-width: 720px;
        flex-basis: 100%;
        width: 100%;
        &.shadow {
            box-shadow: box-shadow(4);
        }
        &.grid {
            @include ins-grid();
        }
    }
    &__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4.5rem;
    }
    &__title {
        font-size: 1.8rem;
        color: $c-333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 1.2rem;
        & .block {
            background-color: $c-primary;
            color: $c-primary;
            margin-right: 0.6rem;
            user-select: none;
        }
    }
    &__icon {
        flex-shrink: 0;
        line-height: 1;
    }
    &__icon__placeholder {
        margin: 0.84rem;
        font-size: 2.8rem;
    }
    @media screen and (max-width: 375px) {
        &__row {
            flex-wrap: wrap;
        }
        &__icon {
            margin-left: -1.2rem;
        }
    }
    &__more {
        & .el-dropdown-menu__item .cmpt-iconfont {
            font-size: 2rem;
            vertical-align: middle;
            margin-right: 0.6rem;
        }
    }
}
</style>
