<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Body from '@/components/Body.vue'
import Card from '@/components/Card.vue'
import Field from '@/components/Field.vue'
import Label from '@/components/Label.vue'
import Button from '@/components/Button.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { focusField } from '@/plugins/VeeValidate'
import * as api from '@/api'

@Component({
    components: {
        Body,
        Card,
        Field,
        Label,
        Button,
        HeaderBar,
        ErrorMessage
    }
})
export default class SetPassword extends Vue {
    form = {
        old_password: '',
        password: '',
        repeact_password: '',
    }
    loading = false
    register() {
        this.$validator.validateAll().then((check) => {
            if (check) {
                this.loading = true
                api.user
                    .setpassword(this.form)
                    .then((res) => {
                        this.$notify.success('密码修改成功，请重新登录')
                        this.$store.commit('logout')
                        this.$router.push('/login')
                    })
                    .catch((err) => {
                        this.$notify.error({
                            title: '',
                            message: err.message,
                            duration: 0
                        })
                    })
                    .finally(() => {
                        this.loading = false
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
}
</script>

<template>
    <Body padding class="user-register">
        <template v-slot:prepend>
            <HeaderBar>修改密码</HeaderBar>
        </template>

        <Label title="旧密码"/>
        <ErrorMessage :error-message="errors.first('旧密码')"/>
        <Field
            v-model="form.old_password"
            type="password"
            placeholder="请输入当前使用的密码"
            :error="!!errors.first('旧密码')"
            width="small"
            tabindex="1"
            name="旧密码"
            v-validate="'required|min:6|max:32'"
            data-vv-validate-on="blur"
        />

        <Label title="新密码"/>
        <ErrorMessage :error-message="errors.first('新密码')"/>
        <Field
            v-model="form.password"
            type="password"
            placeholder="请设置新密码"
            :error="!!errors.first('新密码')"
            width="small"
            tabindex="2"
            name="新密码"
            v-validate="'required|min:6|max:32'"
            data-vv-validate-on="blur"
        />

        <Label title="确认新密码"/>
        <ErrorMessage :error-message="errors.first('确认新密码')"/>
        <Field
            v-model="form.repeact_password"
            type="password"
            placeholder="再次输入新密码"
            :error="!!errors.first('确认新密码')"
            width="small"
            tabindex="3"
            name="确认新密码"
            v-validate="{ required: true, is: form.password }"
            data-vv-validate-on="blur"
        />

        <Button
            class="button"
            type="primary"
            :loading="loading"
            tabindex="4"
            @click="register"
            round
        >修改</Button>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';

.user-register {
    .button {
        margin-top: 2.4rem;
    }
}
</style>
