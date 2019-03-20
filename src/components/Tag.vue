<!--
 * 简化表单的显示，仅显示一个标签，点击标签可以编辑。边上并附有新增按钮。
 * 编辑或新增时以popup的形式弹出
 -->
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Icon from '@/components/Icon.vue'
import Ripple from '@/components/Ripple'
import IconButton from '@/components/IconButton.vue'

@Component({
    components: {
        Icon,
        Ripple,
        IconButton
    }
})
export default class Tag extends Vue {
    @Prop({ type: Boolean, default: false })
    icon!: boolean
    @Prop()
    iconText!: string
    @Prop({ type: Boolean, default: false })
    add!: boolean
}
</script>

<template>
    <transition name="tag">
        <div class="cmpt-tag" :class="{'cmpt-tag__with-icon': icon}" v-if="!add">
            <slot></slot>
            <IconButton
                class="cmpt-tag__icon"
                v-if="icon"
                v-on="$listeners"
                :text="iconText || '&#xe601;'"
            >
                <slot name="icon"></slot>
            </IconButton>
        </div>
        <Ripple class="cmpt-tag cmpt-tag__add" v-on="$listeners" v-else>
            <Icon :value="iconText || '&#xe60a;'">
                <slot></slot>
            </Icon>
        </Ripple>
    </transition>
</template>

<style lang="scss">
@import '../style';
.cmpt-tag {
    display: inline-block;
    padding: 0.6rem 1.2rem;
    color: $c-primary-font;
    font-size: 1.4rem;
    border-radius: 0.6rem;
    border: 1px $c-primary-font solid;
    margin: 0.6rem 1.2rem 0.6rem 0;
    position: relative;
    line-height: 1.5;
    min-height: 1.5em;
    vertical-align: middle;
    &:last-child {
        margin-right: 0;
    }
}
.cmpt-tag__with-icon {
    padding-right: 2.5em;
}
.cmpt-tag__icon {
    font-size: 1.6rem;
    position: absolute;
    right: 0.6rem;
    top: 50%;
    color: inherit;
    transform: translateY(-52%);
    &:hover {
        color: inherit;
    }
}
.cmpt-tag__add {
    cursor: pointer;
}

.tag-enter-active,
.tag-leave-active {
    transition: all 0.3s;
}
.tag-enter,
.tag-leave-to {
    opacity: 0;
    transform: scaleX(0);
}
</style>
