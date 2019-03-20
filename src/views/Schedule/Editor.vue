<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import Label from '@/components/Label.vue'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import IconButton from '@/components/IconButton.vue'
import TagList, { ITagEditMode } from '@/components/TagList.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Tags from '@/components/Tags.vue'
import { ISchedule } from '@/views'

import * as api from '@/api'
import { focusField } from '@/plugins/VeeValidate'
import { isMobile } from '@/utils/navigator'

@Component({
    components: {
        Body,
        Label,
        Field,
        Button,
        HeaderBar,
        IconButton,
        TagList,
        ErrorMessage,
        Tags
    }
})
export default class ScheduleEditor extends Vue {
    @State isMobile!: boolean
    @Prop({ type: Boolean, default: false })
    edit!: boolean
    ready = false

    form: ISchedule = {
        pid: 0,
        title: '',
        description: '',
        type: 1,
        sort: 0,
        tag: [],
        departure_time: '08:00'
    }

    tag: ITagEditMode<string> = {
        defaultStage: '',
        stage: '',
        index: -1,
        show: false
    }

    save() {
        this.$validator.validateAll().then((res) => {
            if (res) {
                api.schedule[this.edit ? 'update' : 'create'](this.form, true)
                    .then(() => {
                        this.$store.commit('schedule', {})
                        this.$notify.success(
                            `${this.edit ? '修改' : '增加'}成功`
                        )
                        this.$router.push(
                            this.form.id
                                ? `/schedule/${this.form.id}`
                                : `/itinerary/${this.form.pid}`
                        )
                    })
                    .catch((err) => {
                        this.$notify.error({
                            title: '',
                            message: err.message,
                            duration: 0
                        })
                    })
            } else {
                focusField(
                    this.$el,
                    this.$validator.errors.items[0].field,
                    window
                )
            }
        })
    }
    remove() {
        if (!this.edit || !this.$route.params.id) {
            return
        }
        this.$confirm('确定要删除吗？').then(() => {
            api.schedule
                .delete(Number(this.$route.params.id), true)
                .then(() => {
                    this.$store.commit('schedule', {})
                    this.$notify.success('删除成功')
                    this.$router.push(`/itinerary/${this.form.pid}`)
                })
                .catch((err) => {
                    this.$notify.error({
                        title: '',
                        message: err.message,
                        duration: 0
                    })
                })
        })
    }

    isEdit() {
        api.schedule
            .read(Number(this.$route.params.id))
            .then((res) => {
                this.form = Object.assign({}, this.form, res)
            })
            .finally(() => {
                this.ready = true
            })
    }
    isAdd() {
        /* 设置默认值 */
        this.form.pid = Number(this.$route.params.id)
        this.ready = true
    }
    created() {
        if (this.edit) {
            this.isEdit()
        } else {
            this.isAdd()
        }
    }
}
</script>

<template>
    <Body padding v-if="ready">
        <template v-slot:prepend>
            <HeaderBar>
                <template v-slot>{{ edit ? '修改日程' : '新增日程' }}</template>
                <template v-slot:icon>
                    <!-- 删除 -->
                    <IconButton type="danger" title="删除" @click="remove" v-if="edit">&#xe616;</IconButton>
                    <!-- 保存 -->
                    <IconButton type="primary" title="保存" @click="save">&#xe608;</IconButton>
                </template>
            </HeaderBar>
        </template>

        <Label title="展示类型"/>
        <el-radio-group v-model="form.type" size="medium">
            <el-radio :label="1" border>日程卡片</el-radio>
            <el-radio :label="2" border>按钮</el-radio>
        </el-radio-group>

        <div v-show="form.type === 2">
            <Label title="标题"/>
            <ErrorMessage name="标题" :error-message="errors.first('标题')"/>
            <Field
                v-model="form.title"
                placeholder="30字以内"
                :error="!!errors.first('标题')"
                width="medium"
                name="标题"
                v-validate="'max:30'"
                data-vv-validate-on="blur"
            />
        </div>
        <Label title="描述" description="简单的内容介绍"/>
        <ErrorMessage name="描述" :error-message="errors.first('描述')"/>
        <Field
            v-model="form.description"
            type="textarea"
            placeholder="255字以内"
            :error="!!errors.first('描述')"
            name="描述"
            v-validate="'max:255'"
            data-vv-validate-on="blur"
        />

        <div v-show="form.type === 1">
            <Label title="标签"/>
            <Tags
                v-model="form.tag"
                :max-length="12"
                name="标签"
                :error-message="errors.first('标签')"
            />

            <Label title="出门时间" description="计划的出门时间"/>
            <ErrorMessage
                :value="form.departure_time"
                name="出门时间"
                :error-message="errors.first('出门时间')"
                v-validate="'required|min:5|max:5'"
            />
            <el-time-select
                v-model="form.departure_time"
                :picker-options="{
                step: '00:10',
                start: '00:00',
                end: '23:50'
            }"
                default-value="08:00"
                value-format="hh:mm"
                :editable="!isMobile"
                :clearable="!isMobile"
                placeholder="选择时间"
            ></el-time-select>
        </div>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style.scss';
</style>
