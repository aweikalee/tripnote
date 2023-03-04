<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import Tabbar from '@/components/Tabbar.vue'
import TabbarItem from '@/components/TabbarItem.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import Login from './User/Login.vue'
import { State } from 'vuex-class'

@Component({
    components: {
        Tabbar,
        TabbarItem,
        Icon,
        Button,
        Login
    }
})
export default class Entry extends Vue {
    @State loggedin!: boolean
    @State loginShow!: boolean
    @Prop()
    routeModule!: string
    @Watch('$route')
    onRouteChange(route: Route) {
        const path = route.path
        if (/(\/)(\w+\/\d+\/?)?$/.test(path)) {
            this.$store.commit('lastRoute', route)
        }
    }
    get itineraryID() {
        const target = this.$store.state.itinerary
        return target && target.id ? `${target.id}` : ''
    }
    get scheduleID() {
        const target = this.$store.state.schedule
        return target && target.id ? `${target.id}` : ''
    }

    openLogin() {
        if (this.routeModule === 'user') {
            this.$router.push('/login')
        } else {
            this.toggleLoginShow()
        }
    }
    toggleLoginShow() {
        this.$store.commit('loginShow', !this.loginShow)
    }
    created() {
        if (this.$store.state.lastRoute && this.$route.path === '/') {
            this.$router.replace(this.$store.state.lastRoute)
        } else {
            this.onRouteChange(this.$route)
        }
    }
}
</script>

<template>
    <div>
        <router-view/>
        <nav>
            <Tabbar class="nav">
                <!-- 返回 -->
                <Button class="nav-back" type="default" @click="$router.back()">
                    <Icon class="nav-back__icon">&#xe60d;</Icon>
                    <span class="nav-back__text">返回</span>
                </Button>

                <!-- 首页 -->
                <TabbarItem to="/" :value="routeModule" :active="['index']">
                    <span>首页</span>
                    <template v-slot:icon>
                        <Icon>&#xe677;</Icon>
                    </template>
                </TabbarItem>

                <!-- 行程单 -->
                <TabbarItem
                    :to="`/itinerary/${itineraryID}`"
                    :value="routeModule"
                    :active="['itinerary']"
                    v-if="['itinerary', 'schedule', 'detail', 'bill'].includes(routeModule) && $store.state.itinerary.id"
                >
                    <span>行程</span>
                    <template v-slot:icon>
                        <Icon>&#xe612;</Icon>
                    </template>
                </TabbarItem>

                <!-- 日程 -->
                <TabbarItem
                    :to="`/schedule/${scheduleID}`"
                    :value="routeModule"
                    :active="['schedule', 'detail']"
                    v-if="['schedule', 'detail'].includes(routeModule) && $store.state.schedule.id"
                >
                    <span>日程</span>
                    <template v-slot:icon>
                        <Icon>&#xe606;</Icon>
                    </template>
                </TabbarItem>

                <!-- 账单 -->
                <TabbarItem
                    :to="`/bill/${itineraryID}`"
                    :value="routeModule"
                    active="bill"
                    v-if="['itinerary', 'schedule', 'bill'].includes(routeModule) && $store.state.itinerary.id"
                >
                    <span>账单</span>
                    <template v-slot:icon>
                        <Icon>&#xe607;</Icon>
                    </template>
                </TabbarItem>

                <!-- 登录 -->
                <TabbarItem
                    @click.native="openLogin"
                    :value="routeModule"
                    active="user"
                    v-if="!$store.state.loggedin"
                >
                    <span>登录</span>
                    <template v-slot:icon>
                        <Icon>&#xe604;</Icon>
                    </template>
                </TabbarItem>

                <!-- 用户中心 -->
                <TabbarItem to="/user" :value="routeModule" active="user" v-else>
                    <span>我的</span>
                    <template v-slot:icon>
                        <Icon>&#xe604;</Icon>
                    </template>
                </TabbarItem>
            </Tabbar>
        </nav>
        <Login @close="toggleLoginShow" :show="loginShow" v-if="loginShow"/>
    </div>
</template>

<style lang="scss" scoped>
@import '../style';

.nav {
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 50%;
    width: 100%;
    height: 4.5rem;
    max-width: 750px;
    transform: translateX(-50%);
    box-shadow: box-shadow(4);
    overflow: hidden;
    transition: box-shadow 0.3s ease, max-width 0.6s ease;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
@media screen and (min-width: 750px) {
    .nav {
        max-width: 720px;
        border-radius: 1.2rem 1.2rem 0 0;
    }
}

/* 返回 */
.nav-back {
    width: 25%;
    height: 100%;
    border: none;
    background-color: $c-eee;
    color: $c-999;
    text-shadow: none;
}
.nav-back__icon {
    font-size: 2rem;
    vertical-align: middle;
}
.nav-back__text {
    font-size: 1.4rem;
    margin-left: 0.2rem;
}
@media screen and (max-width: 275px) {
    .nav-back__text {
        display: none;
    }
}
</style>
