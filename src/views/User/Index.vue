<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Body from '@/components/Body.vue'
import Card from '@/components/Card.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import Ripple from '@/components/Ripple'
import * as api from '@/api'

@Component({
    components: {
        Body,
        Card,
        Icon,
        Button,
        Ripple
    }
})
export default class UserIndex extends Vue {
    logout() {
        api.user.logout().then(() => {
            this.$router.push('/login')
        })
    }
}
</script>

<template>
    <Body class="user-index">
        <div class="header">
            <div class="username">{{ $store.state.nickname || $store.state.username }}</div>
            <div class="info">用户中心</div>
        </div>

        <card class="card">
            <div class="card-item disabled">
                <div class="text">设置</div>
                <Icon class="icon">&#xe61d;</Icon>
            </div>
            <Ripple class="card-item" to="/user/setpassword">
                <div class="text">修改密码</div>
                <Icon class="icon">&#xe61d;</Icon>
            </Ripple>
            <div class="card-item disabled">
                <div class="text">修改资料</div>
                <Icon class="icon">&#xe61d;</Icon>
            </div>
            <Ripple class="card-item" @click="logout">
                <div class="text">退出</div>
                <Icon class="icon">&#xe61d;</Icon>
            </Ripple>
        </card>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';

.user-index {
    .header {
        margin: 3.6rem;
        .username {
            font-size: 3.6rem;
            color: $c-333;
            overflow: hidden;
            word-break: break-all;
            word-wrap: break-word;
        }
        .info {
            font-size: 1.8rem;
            color: #ccc;
        }
    }
    .name {
        color: $c-primary-font;
    }
    .card {
        margin: 1.2rem;
    }
    .card-item {
        padding: 1.2rem;
        display: flex;
        justify-content: space-between;
        font-size: 1.6rem;
        line-height: 2.2rem;
        color: $c-666;
        position: relative;
        cursor: pointer;
        user-select: none;
        .icon {
            font-size: 1.6em;
        }
        &.disabled {
            color: $c-ccc;
            cursor: not-allowed;
        }
    }
    .card-item + .card-item {
        &::after {
            content: ' ';
            position: absolute;
            pointer-events: none;
            box-sizing: border-box;
            left: 1.2rem;
            right: 1.2rem;
            top: 0;
            transform: scaleY(0.5);
            border-bottom: 1px solid $c-primary;
        }
    }
}
</style>
