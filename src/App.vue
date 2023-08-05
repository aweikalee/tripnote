<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import * as api from '@/api'
import { isMobile, systemOS } from '@/utils/navigator'
import PWAPrompt from './PWAPrompt.vue'

@Component({
    components: {
        PWAPrompt
    }
})
export default class App extends Vue {
    ready = false
    mounted() {
        Promise.all([api.config.currencyText(), api.config.payMode()])
            .then(() => {
                this.ready = true
            })
            .catch((e) => {
                this.$notify.error({
                    title: '',
                    message: e.message,
                    duration: 0
                })
            })
            .finally(() => {
                const loading = document.getElementById('loading-wrapper')
                if (loading) {
                    document.body.removeChild(loading)
                }
            })

        this.$store.commit('setState', {
            key: 'isMobile',
            value: isMobile()
        })
        this.$store.commit('setState', {
            key: 'systemOS',
            value: systemOS()
        })
    }
}
</script>

<template>
    <div id="app">
        <router-view v-if="ready"/>
        <PWAPrompt />
    </div>
</template>

<style lang="scss">
@import './style';

html {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}
body {
    min-width: 320px;
    font-family: $font-default;
}
a {
    text-decoration: none;
}
a,
input,
button,
textarea {
    &:focus {
        outline: none;
    }
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    font-size: 1.4rem;
    font-style: normal;
    color: $c-333;
    line-height: 1.5;
}

/* 百度地图版权信息 */
.BMap_cpyCtrl {
    display: none;
}
</style>
