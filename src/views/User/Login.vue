<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Card from '@/components/Card.vue'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import * as api from '@/api'

@Component({
    components: {
        Card,
        Field,
        Button,
        ErrorMessage
    }
})
export default class Login extends Vue {
    @Prop({ type: Boolean, default: true })
    show!: boolean
    loading = false

    username = this.$store.state.username
    password = ''
    login() {
        this.loading = true
        api.user
            .login(this.username, this.password)
            .then((res) => {
                this.$store.commit('login', {
                    username: res.username,
                    nickname: res.nickname
                })
                const path = this.$route.path
                if (res.username === 'test') {
                    this.$notify.info({
                        title: '',
                        message: '测试帐号，所有请求都会返回成功，但数据不会有任何改变。',
                        duration: 0
                    })
                }
                if (path === '/user/login' || path === '/login') {
                    this.$router.push('/user')
                } else {
                    this.$message('登录成功')
                    this.$emit('close')
                }
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
    }
    @Watch('$route.path')
    close() {
        this.$emit('close')
    }
    coming() {
        this.$message.error('Coming Soon')
    }
}
</script>

<template>
    <transition name="user-login-fade">
        <div class="user-login" @click.self="close">
            <div class="user-login__popup">
                <Field
                    class="input"
                    v-model="username"
                    placeholder="用户名"
                    @keypress.enter="login"
                    tabindex="1"
                    name="用户名"
                    v-validate="'required|max:32'"
                    data-vv-validate-on="blur"
                />
                <ErrorMessage
                    class="error-message"
                    name="用户名"
                    :error-message="errors.first('用户名')"
                    no-padding
                    center
                />

                <Field
                    class="input"
                    type="password"
                    v-model="password"
                    placeholder="密码"
                    :error="!!errors.first('密码')"
                    @keypress.enter="login"
                    tabindex="2"
                    name="密码"
                    v-validate="'required|max:32'"
                    data-vv-validate-on="blur"
                />
                <ErrorMessage
                    class="error-message"
                    name="密码"
                    :error-message="errors.first('密码')"
                    no-padding
                    center
                />

                <div class="button">
                    <Button type="primary" tabindex="3" @click="login" :loading="loading" round>登录</Button>
                </div>
                <div class="button">
                    <div class="register">
                        <Button type="danger" round to="/user/register">注册</Button>
                    </div>
                    <div class="findpassword">
                        <Button type="warning" round @click="coming">找回密码</Button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
@import '../../style.scss';
.user-login {
    background-color: $c-mask-white;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s;
    &__popup {
        background-color: $c-white;
        border-radius: 1rem;
        width: calc(100% - 2.4rem);
        max-width: 30rem;
        max-height: 90vh;
        box-shadow: box-shadow(5);
    }
    .input {
        border: none;
        border-bottom: 1px $c-primary solid;
        margin: 1.2rem;
        margin-bottom: 0;
    }
    .error-message {
        margin: 0 2.4rem;
    }
    .button {
        margin: 1.2rem;
        overflow: hidden;
        .register,
        .findpassword {
            width: 50%;
            float: left;
            box-sizing: border-box;
        }
        .register {
            padding-right: 0.6rem;
        }
        .findpassword {
            padding-left: 0.6rem;
        }
    }
}
.user-login-fade {
    &-enter,
    &-leave-to {
        opacity: 0;
    }
}
</style>
