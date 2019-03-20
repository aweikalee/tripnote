<template>
    <!-- v-model="loading"
        :finished="finished"
        loading-text="努力加载中ヾ(≧▽≦*)o"
        finished-text="木有咯╮(╯▽╰)╭"
    @load="load"-->
    <div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// FIXME: 移除vant，正在寻找代替品
@Component
export default class List extends Vue {
    @Prop()
    value!: boolean
    loading = this.value
    @Prop()
    finished!: boolean
    load() {
        this.$emit('load')
    }
    @Watch('loading')
    onLoadingChange() {
        this.$emit('input', this.loading)
    }
    @Watch('value')
    onValueChange() {
        this.loading = this.value
    }
}
</script>
