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
export default class Register extends Vue {
    form = {
        username: '',
        nickname: '',
        password: '',
        repeact_password: '',
        question: '',
        answer: ''
    }
    loading = false
    register() {
        this.$validator.validateAll().then((check) => {
            if (check) {
                this.loading = true
                api.user
                    .register(this.form)
                    .then((res) => {
                        this.$notify.success('注册成功，请联系管理员审核。')
                        this.$store.commit('username', this.form.username)
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
            <HeaderBar>注册</HeaderBar>
        </template>
        <Label title="用户名"/>
        <ErrorMessage :error-message="errors.first('用户名')"/>
        <Field
            v-model="form.username"
            placeholder="用户名"
            :error="!!errors.first('用户名')"
            width="small"
            tabindex="1"
            name="用户名"
            v-validate="'required|min:4|max:32'"
            data-vv-validate-on="blur"
        />

        <Label title="昵称"/>
        <ErrorMessage :error-message="errors.first('昵称')"/>
        <Field
            v-model="form.nickname"
            placeholder="昵称"
            :error="!!errors.first('昵称')"
            width="small"
            tabindex="2"
            name="昵称"
            v-validate="'required|max:32'"
            data-vv-validate-on="blur"
        />

        <Label title="密码"/>
        <ErrorMessage :error-message="errors.first('密码')"/>
        <Field
            v-model="form.password"
            type="password"
            placeholder="设置密码"
            :error="!!errors.first('密码')"
            width="small"
            tabindex="3"
            name="密码"
            v-validate="'required|min:6|max:32'"
            data-vv-validate-on="blur"
        />

        <Label title="确认密码"/>
        <ErrorMessage :error-message="errors.first('确认密码')"/>
        <Field
            v-model="form.repeact_password"
            type="password"
            placeholder="再次输入密码"
            :error="!!errors.first('确认密码')"
            width="small"
            tabindex="4"
            name="确认密码"
            v-validate="{ required: true, is: form.password }"
            data-vv-validate-on="blur"
        />

        <Label title="密保问题"/>
        <ErrorMessage :error-message="errors.first('密保问题')"/>
        <Field
            v-model="form.question"
            placeholder="密保问题"
            :error="!!errors.first('密保问题')"
            width="medium"
            tabindex="5"
            name="密保问题"
            v-validate="'required|max:64'"
            data-vv-validate-on="blur"
        />

        <Label title="密保答案"/>
        <ErrorMessage :error-message="errors.first('密保答案')"/>
        <Field
            v-model="form.answer"
            placeholder="密保问题的答案"
            :error="!!errors.first('密保答案')"
            width="medium"
            tabindex="6"
            name="密保答案"
            v-validate="'required|max:64'"
            data-vv-validate-on="blur"
        />

        <Button
            class="button"
            type="primary"
            :loading="loading"
            tabindex="7"
            @click="register"
            round
        >注册</Button>
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
