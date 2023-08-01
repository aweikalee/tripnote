<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import Card from '@/components/Card.vue'
import Label from '@/components/Label.vue'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import IconButton from '@/components/IconButton.vue'
import TagList, { ITagEditMode } from '@/components/TagList.vue'
import Editor from '@/components/Editor'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FormPosition from './components/FormPosition.vue'
import {
    IDetail,
    IPosition,
    IConsumptionType,
    ICurrencyText,
    ICurrency,
    IItinerary,
    ISchedule
} from '@/views'

import * as api from '@/api'
import { focusField } from '@/plugins/VeeValidate'

@Component({
    components: {
        Body,
        Card,
        Label,
        Field,
        Button,
        HeaderBar,
        IconButton,
        TagList,
        FormPosition,
        Editor,
        ErrorMessage
    }
})
export default class DetailEditor extends Vue {
    @State itinerary!: IItinerary
    @State isMobile!: boolean
    @State consumptionType!: IConsumptionType
    @Getter getCurrencyTexts!: (
        target: ICurrency[],
        needCNY: boolean
    ) => ICurrencyText[]

    @Prop({ type: Boolean, default: false })
    edit!: boolean
    ready = false
    currency: ICurrency[] = []
    scheduleLists: ISchedule[] = []

    form: IDetail = {
        pid: 0,
        title: '',
        description: '',
        content: '',
        type: 'play',
        sort: 0,
        position: [],
        currency: 'CNY',
        amount: '',
        count: 1
    }

    position: ITagEditMode<IPosition> = {
        defaultStage: {
            title: '',
            address: '',
            x: '',
            y: ''
        },
        stage: {
            title: '',
            address: '',
            x: '',
            y: ''
        },
        index: -1,
        show: false
    }
    showPid = false
    loadingPid = false
    showPidHandler() {
        if (!this.itinerary.id) {
            return
        }
        this.loadingPid = true
        api.schedule
            .lists(this.itinerary.id)
            .then((res) => {
                if (!res) {
                    return
                }
                res.sort((a, b) => {
                    return a.type - b.type || a.sort - b.sort
                })
                this.$set(this, 'scheduleLists', res)
                this.showPid = true
            })
            .finally(() => {
                this.loadingPid = false
            })
    }

    save() {
        this.$validator.validateAll().then((res) => {
            if (res) {
                api.detail[this.edit ? 'update' : 'create'](this.form, true)
                    .then(() => {
                        this.$notify.success(
                            `${this.edit ? '修改' : '增加'}成功`
                        )
                        this.$router.push(`/schedule/${this.form.pid}`)
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
            api.detail
                .delete(Number(this.$route.params.id), true)
                .then(() => {
                    this.$notify.success('删除成功')
                    this.$router.push(`/schedule/${this.form.pid}`)
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
    init() {
        if (this.form.pid === 0) {
            return
        }
        api.schedule.read(Number(this.form.pid)).then((res) => {
            api.itinerary.read(res.pid).then((zres) => {
                if (zres) {
                    this.currency = zres.currency
                }
            })
        })
    }
    isEdit() {
        api.detail
            .read(Number(this.$route.params.id))
            .then((res) => {
                this.form = Object.assign({}, this.form, res)
                this.init()
            })
            .finally(() => {
                this.ready = true
            })
    }
    isAdd() {
        /* 设置默认值 */
        this.form.pid = Number(this.$route.params.id)
        this.ready = true
        this.init()
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
                <template v-slot>{{ edit ? '修改详情' : '新增详情' }}</template>
                <template v-slot:icon>
                    <!-- 删除 -->
                    <IconButton type="danger" title="删除" @click="remove" v-if="edit">&#xe616;</IconButton>
                    <!-- 保存 -->
                    <IconButton type="primary" title="保存" @click="save">&#xe608;</IconButton>
                </template>
            </HeaderBar>
        </template>
        <div v-if="edit">
            <Label title="上级"/>
            <ErrorMessage
                :value="form.pid"
                name="上级"
                :error-message="errors.first('上级')"
                v-validate="'required|integer'"
            />
            <el-select value-key="id" v-model="form.pid" placeholder="请选择" v-if="showPid">
                <el-option
                    v-for="item in scheduleLists"
                    :key="item.id"
                    :label="item.type === 1 ? `第${item.sort}天` : item.title"
                    :value="item.id"
                ></el-option>
            </el-select>
            <Button @click="showPidHandler" :loading="loadingPid" v-else>点击修改上级</Button>
        </div>

        <Label title="标题"/>
        <ErrorMessage name="标题" :error-message="errors.first('标题')"/>
        <Field
            v-model="form.title"
            placeholder="30字以内"
            :error="!!errors.first('标题')"
            width="medium"
            name="标题"
            v-validate="'required|max:30'"
            data-vv-validate-on="blur"
        />

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

        <Label title="类型"/>
        <el-radio-group v-model="form.type" size="medium">
            <el-radio
                v-for="item in consumptionType"
                :key="item.name"
                :label="item.name"
                border
            >{{ item.text }}</el-radio>
        </el-radio-group>

        <Label title="地址" description="坐标"/>
        <TagList
            v-model="form.position"
            :defaultStage="position.defaultStage"
            @stage="(stage) => { position.stage = stage}"
            @index="(index) => { position.index = index }"
            @show="(show) => { position.show = show }"
        >
            <template slot-scope="{ item }">{{ item.address }}</template>
        </TagList>
        <FormPosition
            v-model="form.position"
            :stage="position.stage"
            :index="position.index"
            @close="position.show = false"
            v-if="position.show"
        />

        <Label title="消费" description="预计人均消费"/>
        <ErrorMessage
            :value="form.currency"
            name="货币种类"
            :error-message="errors.first('货币种类')"
            v-validate="'required|length:3,3'"
        />
        <ErrorMessage name="消费金额" :error-message="errors.first('消费金额')"/>
        <Field
            v-model.number="form.amount"
            type="number"
            placeholder="预计人均多少钱？"
            :error="!!errors.first('消费金额')"
            name="消费金额"
            v-validate="{
                max: 30,
                decimal: 2,
                min_value: 0
            }"
            data-vv-validate-on="blur"
        >
            <template v-slot:prepend>
                <el-select
                    style="width: 10rem !important"
                    value-key="name"
                    v-model="form.currency"
                    :filterable="!isMobile"
                    placeholder="请选择货币种类"
                >
                    <el-option
                        v-for="item in getCurrencyTexts(currency, true)"
                        :key="item.name"
                        :label="item.text"
                        :value="item.name"
                    ></el-option>
                </el-select>
            </template>
        </Field>
        <Label title="统计"/>
        <ErrorMessage
            :value="form.count"
            name="统计"
            :error-message="errors.first('统计')"
            v-validate="`required|included:0,1`"
        />
        <div class="switch">
            <span class="switch__text">加入日程内的总人均统计</span>
            <el-switch v-model="form.count" :active-value="1" :inactive-value="0"/>
        </div>

        <Label title="详细内容"/>
        <div class="schedule-form__editor__card" v-if="!isMobile">
            <Editor class="schedule-form__editor" v-model="form.content" ref="editor"/>
        </div>
        <Field v-model="form.content" type="textarea" v-else/>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style.scss';

.schedule-form__editor__card {
    margin: 1.2rem 0;
}
.schedule-form__editor {
    margin: 0 auto;
    max-width: 800px;
    height: calc(100vh - 6.9rem); /* 可以考虑改成12.6rem 这样不会挡住顶部的保存按钮 */
    min-height: 400px;
    border: 1px $c-ccc solid;
    box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.switch {
    margin: 1.2rem 0;
    &__text {
        margin-right: 1.2rem;
    }
}
</style>
