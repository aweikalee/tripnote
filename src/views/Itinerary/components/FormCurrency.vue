<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import TagEditor from '@/components/TagEditor'
import Field from '@/components/Field.vue'
import Label from '@/components/Label.vue'
import EditPopup from '@/components/EditPopup.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { ICurrency, ICurrencyText } from '@/views/index.d'
import { isMobile } from '@/utils/navigator'

interface ICurrencyM extends ICurrency {
    [index: string]: any
}
@Component({
    components: {
        Field,
        Label,
        EditPopup,
        ErrorMessage
    }
})
export default class IndexFormCurrencyEditor extends Mixins(TagEditor) {
    @State currencyText!: ICurrency[]
    @State isMobile!: boolean
    @Getter getCurrencyTexts!: (
        target: ICurrencyText[],
        needCNY: boolean
    ) => ICurrencyText[]

    /* picker start */
    pickerShow = false
    confirm(value: ICurrencyText) {
        this.stage.name = value.name
        this.pickerShow = false
        this.$validator.validateAll({
            货币种类: value.name
        })
    }
    cancel() {
        this.pickerShow = false
    }
    /* picker end */

    currencyRepeat(a: any, b: any, zindex: number) {
        return a === b.name && zindex !== this.index
    }
}
</script>

<template>
    <EditPopup :value="true" @save="save" @remove="remove" @input="close" :remove="index !== -1">
        <Label title="货币种类"/>

        <ErrorMessage
            :value="stage.name"
            name="货币种类"
            :error-message="errors.first('货币种类')"
            v-validate="{
                    required: true,
                    length: [3, 3],
                    array_repeat: {
                        data: value,
                        method: currencyRepeat
                    }
                }"
        />
        <el-select value-key="name" v-model="stage.name" :filterable="!isMobile" placeholder="请选择">
            <el-option
                v-for="item in getCurrencyTexts(currencyText, false)"
                :key="item.name"
                :label="item.text"
                :value="item.name"
            ></el-option>
        </el-select>

        <Label title="汇率" description="当时/当前的汇率，填入1元人民币能兑换该货币的数量"/>
        <ErrorMessage
            name="汇率"
            :error-message="errors.first('汇率')"
        />
        <Field
            v-model="stage.rate"
            placeholder="请输入正数"
            :error="!!errors.first('汇率')"
            width="small"
            name="汇率"
            v-validate="{
                required: true,
                max: 16,
                decimal: true,
                greater: 0
            }"
            data-vv-validate-on="blur"
        />
    </EditPopup>
</template>
