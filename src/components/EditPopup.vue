<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Ripple from '@/components/Ripple'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'

@Component({
    components: {
        Ripple,
        Icon,
        Button,
        IconButton
    }
})
export default class EditPopup extends Vue {
    @Prop({ type: Boolean, default: false })
    value!: boolean
    @Prop()
    title!: string

    @Prop({ type: Boolean, default: true })
    save!: boolean
    @Prop({ type: Boolean, default: true })
    remove!: boolean
    @Prop({ type: Boolean, default: true })
    cancel!: boolean
    @Prop({ type: String, default: '保存' })
    saveText!: string
    @Prop({ type: String, default: '删除' })
    removeText!: string
    @Prop({ type: String, default: '取消' })
    cancelText!: string

    propValue = this.value
    @Watch('propValue')
    propValueChange() {
        this.$emit('input', this.propValue)
    }
    onInput(val: boolean) {
        this.$emit('input', val)
    }
    onSave() {
        this.$emit('save', () => {
            this.$emit('input', false)
        })
    }
    onRemove() {
        this.$confirm('确定要删除吗？').then(() => {
            this.$emit('remove')
            this.$emit('input', false)
        })
    }
    onCancel() {
        this.$emit('cancel')
        this.$emit('input', false)
    }
}
</script>

<template>
    <el-dialog
        class="cmpt-edit-popup"
        :title="title"
        :visible.sync="value"
        :close-on-click-modal="false"
    >
        <slot></slot>
        <template v-slot:footer>
            <span class="dialog-footer">
                <Button
                    class="cmpt-edit-popup__button"
                    type="primary"
                    round
                    @click="onSave"
                    v-if="save"
                >{{ saveText }}</Button>
                <Button
                    class="cmpt-edit-popup__button"
                    type="danger"
                    round
                    @click="onRemove"
                    v-if="remove"
                >{{ removeText }}</Button>
                <Button
                    class="cmpt-edit-popup__button"
                    type="default"
                    round
                    @click="onCancel"
                    v-if="cancel"
                >{{ cancelText }}</Button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="scss">
@import '../style';

.cmpt-edit-popup {
    word-break: break-all;
    word-wrap: break-word;
    &__button + &__button {
        margin-top: 1.2rem;
    }
}
</style>
