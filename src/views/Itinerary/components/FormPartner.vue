<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import TagEditor from '@/components/TagEditor'
import Field from '@/components/Field.vue'
import Label from '@/components/Label.vue'
import EditPopup from '@/components/EditPopup.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

@Component({
    components: {
        Field,
        Label,
        EditPopup,
        ErrorMessage
    }
})
export default class IndexFormPartnerEditor extends Mixins(TagEditor) {
    nickNameRepeat(a: any, b: any, zindex: number) {
        return a === b.nickname && zindex !== this.index
    }
    uidRepeat(a: any, b: any, zindex: number) {
        return a !== 0 && a === b.uid && zindex !== this.index
    }
}
</script>

<template>
    <EditPopup :value="true" @save="save" @remove="remove" @input="close" :remove="index !== -1">
        <Label title="昵称"/>
        <ErrorMessage
            name="昵称"
            :error-message="errors.first('昵称')"
        />
        <Field
            v-model="stage.nickname"
            placeholder="不可为空"
            :error="!!errors.first('昵称')"
            width="small"
            name="昵称"
            v-validate="{
                required: true,
                max: 12,
                array_repeat: {
                    data: value,
                    method: nickNameRepeat
                }
            }"
            data-vv-validate-on="blur"
        />

        <Label title="用户ID" description="不知道可为空"/>
        <ErrorMessage name="用户ID" :error-message="errors.first('用户ID')"/>
        <Field
            v-model.number="stage.uid"
            placeholder="选填"
            :error="!!errors.first('用户ID')"
            width="small"
            name="用户ID"
            v-validate="{
                max: 10,
                numeric: true,
                array_repeat: {
                    data: value,
                    method: uidRepeat
                }
            }"
            data-vv-validate-on="blur"
        />
    </EditPopup>
</template>
