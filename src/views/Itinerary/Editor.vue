<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import Label from '@/components/Label.vue'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import TagList, { ITagEditMode } from '@/components/TagList.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { IItinerary, IPartner, ICurrency, IPayMode } from '@/views'

import FormPartner from './components/FormPartner.vue'
import FormCurrency from './components/FormCurrency.vue'
import * as api from '@/api'
import { focusField } from '@/plugins/VeeValidate'

@Component({
    components: {
        Body,
        Label,
        Field,
        Button,
        IconButton,
        HeaderBar,
        TagList,
        ErrorMessage,
        FormPartner,
        FormCurrency
    }
})
export default class ItineraryEditor extends Vue {
    @State payMode!: IPayMode[]
    @State isMobile!: boolean
    @Getter getCurrencyText!: (name: string) => string

    @Prop({ type: Boolean, default: false })
    edit!: boolean
    ready = false

    form: IItinerary = {
        sort: 0,
        start_time: 0,
        title: '',
        description: '',
        currency: [],
        pay_mode: [],
        partner: []
    }

    partner: ITagEditMode<IPartner> = {
        defaultStage: {
            uid: 0,
            nickname: ''
        },
        stage: {
            uid: 0,
            nickname: ''
        },
        index: -1,
        show: false
    }

    currency: ITagEditMode<ICurrency> = {
        defaultStage: {
            name: '',
            rate: 1
        },
        stage: {
            name: '',
            rate: 1
        },
        index: -1,
        show: false
    }

    save() {
        this.$validator.validateAll().then((res) => {
            if (res) {
                api.itinerary[this.edit ? 'update' : 'create'](this.form, true)
                    .then(() => {
                        this.$store.commit('itinerary', {})

                        this.$notify.success(
                            `${this.edit ? '修改' : '增加'}成功`
                        )
                        this.$router.push(
                            this.form.id ? `/itinerary/${this.form.id}` : '/'
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
            api.itinerary
                .delete(Number(this.$route.params.id), true)
                .then(() => {
                    this.$store.commit('itinerary', {})
                    this.$notify.success('删除成功')
                    this.$router.push('/')
                })
        })
    }

    isEdit() {
        api.itinerary
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
        this.form.start_time = new Date().getTime()
        this.form.pay_mode = this.payMode
            .filter((item, index) => {
                return index < 4
            })
            .map((item) => {
                return item.name
            })
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
                <template v-slot>{{ edit ? '修改行程' : '新增行程' }}</template>
                <template v-slot:icon>
                    <!-- 删除 -->
                    <IconButton type="danger" title="删除" @click="remove" v-if="edit">&#xe616;</IconButton>
                    <!-- 保存 -->
                    <IconButton type="primary" title="保存" @click="save">&#xe608;</IconButton>
                </template>
            </HeaderBar>
        </template>

        <Label title="目的地/标题" description="Where"/>
        <ErrorMessage :error-message="errors.first('目的地/标题')"/>
        <Field
            v-model="form.title"
            placeholder="30字以内"
            :error="!!errors.first('目的地/标题')"
            width="medium"
            name="目的地/标题"
            v-validate="'required|max:30'"
            data-vv-validate-on="blur"
        />

        <Label title="描述"/>
        <ErrorMessage :error-message="errors.first('描述')"/>
        <Field
            v-model="form.description"
            placeholder="255字以内"
            :error="!!errors.first('描述')"
            name="描述"
            type="textarea"
            v-validate="'max:255'"
            data-vv-validate-on="blur"
        />

        <Label title="出发日期" description="When"/>
        <ErrorMessage
            :value="form.start_time"
            name="出发日期"
            :error-message="errors.first('出发日期')"
            v-validate="'required|numeric'"
        />
        <el-date-picker
            v-model="form.start_time"
            type="date"
            value-format="timestamp"
            :editable="!isMobile"
            :clearable="!isMobile"
            placeholder="选择日期"
        ></el-date-picker>

        <Label title="Who" description="参与者"/>
        <TagList
            v-model="form.partner"
            :defaultStage="partner.defaultStage"
            @stage="(stage) => { partner.stage = stage}"
            @index="(index) => { partner.index = index }"
            @show="(show) => { partner.show = show }"
            name="Who"
            :error-message="errors.first('Who')"
            v-validate="'required|array_required'"
        >
            <template slot-scope="{ item }">{{ item.nickname }}</template>
        </TagList>
        <FormPartner
            v-model="form.partner"
            :stage="partner.stage"
            :index="partner.index"
            @close="partner.show = false"
            v-if="partner.show"
        />

        <Label title="货币" description="将会涉及到的货币种类"/>
        <TagList
            v-model="form.currency"
            :defaultStage="currency.defaultStage"
            @stage="(stage) => { currency.stage = stage}"
            @index="(index) => { currency.index = index }"
            @show="(show) => { currency.show = show }"
            name="货币"
        >
            <template slot-scope="{ item }">{{ getCurrencyText(item.name) }}</template>
        </TagList>
        <FormCurrency
            v-model="form.currency"
            :stage="currency.stage"
            :index="currency.index"
            @close="currency.show = false"
            v-if="currency.show"
        />

        <Label title="支付方式" description="可能用到的支付方式"/>
        <el-checkbox-group v-model="form.pay_mode" size="medium">
            <el-checkbox
                v-for="item in payMode"
                :key="item.name"
                :label="item.name"
                border
            >{{ item.text }}</el-checkbox>
        </el-checkbox-group>
        <ErrorMessage
            :value="form.pay_mode"
            name="支付方式"
            :error-message="errors.first('支付方式')"
            v-validate="'required'"
        />
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';
</style>
