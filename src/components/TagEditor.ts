import { Component, Vue, Prop } from 'vue-property-decorator'
import { focusField } from '@/plugins/VeeValidate'

@Component
export default class TagEditor extends Vue {
    @Prop()
    value!: any[]
    @Prop()
    stage!: any
    @Prop()
    index!: number

    save() {
        const stage = this.stage
        const index = this.index
        const value = this.value
        this.$validator.validateAll().then((res) => {
            if (res) {
                value.splice(
                    index === -1 ? value.length : index,
                    index === -1 ? 0 : 1,
                    Object.assign({}, stage)
                )
                this.close()
            } else {
                focusField(this.$el, (this as any).errors.items[0].field)
            }
        })
    }
    remove() {
        const index = this.index
        const value = this.value
        value.splice(index, 1)
        this.close()
    }
    close() {
        this.$emit('close')
    }
}
