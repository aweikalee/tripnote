<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import Card from '@/components/Card.vue'
import Label from '@/components/Label.vue'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Ripple from '@/components/Ripple'
import ErrorMessage from '@/components/ErrorMessage.vue'
import TagList, { ITagEditMode } from '@/components/TagList.vue'
import {
    IBill,
    IConsumptionType,
    ICurrencyText,
    ICurrency,
    IItinerary,
    IPayMode
} from '@/views'
import state from '@/store/state'

import * as api from '@/api'
import { focusField } from '@/plugins/VeeValidate'

@Component({
    components: {
        Body,
        Card,
        Label,
        Field,
        Button,
        IconButton,
        HeaderBar,
        Ripple,
        TagList,
        ErrorMessage
    }
})
export default class BillEditor extends Vue {
    @State consumptionType!: IConsumptionType
    @State itinerary!: IItinerary
    @Getter getCurrencyText!: (name: string) => string
    @Getter getPayModes!: (names: string[]) => IPayMode[]
    @Getter getCurrencyTexts!: (
        target: ICurrency[],
        needCNY: boolean
    ) => ICurrencyText[]

    @Prop({ type: Boolean, default: false })
    edit!: boolean
    @Prop({ type: Boolean, default: false })
    draft!: boolean

    form: IBill = {
        pid: 0,
        type: '',
        detail: '',
        currency: 'CNY',
        amount: '',
        pay_mode: 'cash',
        payer: [],
        participant: [],
        balance: [],
        create_time: 0,
        update_time: 0,
        count: 1,
        deletedAt: null
    }

    ready = false

    save() {
        this.$validator.validateAll().then((res) => {
            if (res) {
                const theApi = this.draft ? api.billDraft : api.bill
                const request = this.edit ? theApi.update : theApi.create
                request.call(theApi, this.form, !this.edit).then(() => {
                    this.$notify.success(`${this.edit ? '保存' : '添加'}成功`)
                    if (this.draft) {
                        this.$router.push(`/bill/${this.form.pid}/draft`)
                    } else {
                        this.$router.push(`/bill/${this.form.pid}`)
                    }
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
        if (!this.edit) {
            return
        }
        this.$confirm(
            `确定要从${this.draft ? '“草稿箱”中' : '“服务器”上'}删除该账单吗？`
        ).then(() => {
            const id = Number(this.$route.params.id)
            const request = this.draft
                ? api.billDraft.delete(id)
                : api.bill.delete(id, !this.edit)
            request
                .then(() => {
                    this.$notify.success('删除成功')
                    if (this.draft) {
                        this.$router.push(`/bill/${this.form.pid}/draft`)
                    } else {
                        this.$router.push(`/bill/${this.form.pid}`)
                    }
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
    getIncludedText(array: any[], name: string) {
        return Array.isArray(array) && array.map((item) => item[name]).join(',')
    }
    isEdit() {
        const id = Number(this.$route.params.id)
        const request = this.draft
            ? api.billDraft.read(id)
            : api.bill.read(id, true)

        request.then((res: IBill) => {
            this.$set(this, 'form', Object.assign({}, this.form, res))
            api.itinerary.read(Number(res.pid)).then(() => {
                this.ready = true
            })
        })
    }
    isAdd() {
        api.itinerary.read(Number(this.$route.params.pid)).then(() => {
            this.ready = true
        })
        this.form.pid = Number(this.$route.params.pid)
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
            <HeaderBar :grid="draft">
                <template v-slot>{{ edit ? '修改' : '新增' }}账单{{ draft ? '(草稿箱)' : '' }}</template>
                <template v-slot:icon>
                    <!-- 删除 -->
                    <IconButton
                        type="danger"
                        :title="draft ? '删除' :'从服务器上删除'"
                        @click="remove"
                        v-if="edit"
                    >&#xe616;</IconButton>
                    <!-- 保存 -->
                    <IconButton
                        type="primary"
                        :title="draft ? '保存到草稿箱' : '保存到服务器'"
                        @click="save"
                    >&#xe608;</IconButton>
                </template>
            </HeaderBar>
        </template>

        <Label title="金额" description="正数支出 负数收入"/>
        <ErrorMessage
            :value="form.currency"
            name="币种"
            :error-message="errors.first('币种')"
            v-validate="`required|included:${getIncludedText(getCurrencyTexts(itinerary.currency, true), 'name')}`"
        />
        <el-radio-group v-model="form.currency" size="medium">
            <el-radio
                v-for="item in getCurrencyTexts(itinerary.currency, true)"
                :key="item.name"
                :label="item.name"
                border
            >{{ getCurrencyText(item.name) }}</el-radio>
        </el-radio-group>
        <ErrorMessage name="金额" :error-message="errors.first('金额')"/>
        <Field
            v-model.number="form.amount"
            type="number"
            placeholder="总共花了多少？"
            width="small"
            :error="!!errors.first('金额')"
            name="金额"
            v-validate="{
                max: 30,
                decimal: 2,
            }"
            data-vv-validate-on="blur"
        />

        <Label title="详情"/>
        <ErrorMessage name="详情" :error-message="errors.first('详情')"/>
        <Field
            v-model="form.detail"
            placeholder="钱花哪儿了？"
            :error="!!errors.first('详情')"
            name="详情"
            v-validate="'required|max:128'"
            data-vv-validate-on="blur"
        />

        <Label title="类型"/>
        <ErrorMessage
            :value="form.type"
            name="类型"
            :error-message="errors.first('类型')"
            v-validate="`required|included:${getIncludedText($store.state.consumptionType, 'name')}`"
        />
        <el-radio-group v-model="form.type" size="medium">
            <el-radio
                v-for="item in consumptionType"
                :key="item.name"
                :label="item.name"
                border
            >{{ item.text }}</el-radio>
        </el-radio-group>

        <Label title="支付方式"/>
        <ErrorMessage
            :value="form.pay_mode"
            name="支付方式"
            :error-message="errors.first('支付方式')"
            v-validate="`required|included:${getIncludedText(getPayModes(itinerary.pay_mode), 'name')}`"
        />
        <el-radio-group v-model="form.pay_mode" size="medium">
            <el-radio
                v-for="item in getPayModes(itinerary.pay_mode)"
                :key="item.name"
                :label="item.name"
                border
            >{{ item.text }}</el-radio>
        </el-radio-group>

        <Label title="支付方"/>
        <ErrorMessage
            :value="form.payer"
            name="支付方"
            :error-message="errors.first('支付方')"
            v-validate="`required|included:${getIncludedText($store.state.itinerary.partner, 'id')}`"
        />
        <el-checkbox-group
            v-model="form.payer"
            v-if="form.payer && Array.isArray(form.payer)"
            size="medium"
        >
            <el-checkbox
                v-for="item in itinerary.partner"
                :key="item.id"
                :label="item.id"
                border
            >{{ item.nickname }}</el-checkbox>
        </el-checkbox-group>

        <Label title="参与消费"/>
        <ErrorMessage
            :value="form.participant"
            name="参与消费"
            :error-message="errors.first('参与消费')"
            v-validate="`required|included:${getIncludedText($store.state.itinerary.partner, 'id')}`"
        />
        <el-checkbox-group
            v-model="form.participant"
            v-if="form.participant && Array.isArray(form.participant)"
            size="medium"
        >
            <el-checkbox
                v-for="item in itinerary.partner"
                :key="item.id"
                :label="item.id"
                border
            >{{ item.nickname }}</el-checkbox>
        </el-checkbox-group>

        <Label title="已计算" description="已经把钱付给支付方的"/>
        <ErrorMessage
            :value="form.balance"
            name="已计算"
            :error-message="errors.first('已计算')"
            v-validate="`included:${getIncludedText($store.state.itinerary.partner, 'id')}`"
        />
        <el-checkbox-group
            v-model="form.balance"
            v-if="form.balance && Array.isArray(form.balance)"
            size="medium"
        >
            <el-checkbox
                v-for="item in itinerary.partner"
                :key="item.id"
                :label="item.id"
                border
            >{{ item.nickname }}</el-checkbox>
        </el-checkbox-group>

        <Label title="统计"/>
        <ErrorMessage
            :value="form.count"
            name="统计"
            :error-message="errors.first('统计')"
            v-validate="`required|included:0,1`"
        />
        <div class="switch">
            <span class="switch__text">加入统计</span>
            <el-switch v-model="form.count" :active-value="1" :inactive-value="0"/>
        </div>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';
.switch {
    margin: 1.2rem 0;
    &__text {
        margin-right: 1.2rem;
    }
}
</style>
