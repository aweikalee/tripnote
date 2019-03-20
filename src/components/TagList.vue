<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Tag from '@/components/Tag.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export interface ITagEditMode<A> {
    defaultStage: A
    stage: A
    index: number
    show: boolean
}
@Component({
    components: {
        Tag,
        ErrorMessage
    }
})
export default class TagList<A> extends Vue {
    @Prop()
    value!: A[] // 绑定一个stage 设为将要编辑的对象
    @Prop()
    defaultStage!: A
    @Prop()
    errorMessage!: string

    edit(item: A, index: number) {
        const stage = Object.assign({}, this.defaultStage, item)
        this.$emit('stage', stage)
        this.$emit('index', index)
        this.$emit('show', true)
        this.$emit('edit', stage, index)
    }
}
</script>

<template>
    <div>
        <ErrorMessage :error-message="errorMessage"/>
        <Tag
            v-for="(item, index) in value"
            :key="JSON.stringify(item)"
            icon
            @click="edit(item, index)"
        >
            <slot :item="item">{{item}}</slot>
        </Tag>
        <Tag add @click="edit({}, -1)"/>
    </div>
</template>
