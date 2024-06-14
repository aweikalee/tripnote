<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import { IPosition } from '@/views/index.d'
import { State } from 'vuex-class'

@Component({
    components: {
        Icon,
        Button
    }
})
export default class ScheduleCard extends Vue {
    @State systemOS!: string
    @Prop()
    value!: IPosition[]
    show = false

    openAdressLists() {
        this.show = !this.show
    }

    // TODO: 如果对方没有装百度地图APP 该如何处理？
    getMapUrl(value: IPosition) {
        const os = this.systemOS
        if (os === 'ios' || os === 'android') {
            switch (this.$store.state.mapType){
                case 'baidu':
                    return `baidumap://map/marker?location=${value.y},${value.x}&title=${value.title}&content=${value.address}`
                case 'google':
                    return `https://www.google.com/maps/search/?api=1&query=${value.y},${value.x}`
            }
            return 'baidumap://map/marker?' + parse
        } else {
            switch (this.$store.state.mapType){
                case 'baidu':
                    return `//api.map.baidu.com/marker?location=${value.y},${value.x}&title=${value.title}&content=${value.address}&output=html`
                case 'google':
                    return `https://www.google.com/maps/search/?api=1&query=${value.y},${value.x}`
            }
        }
    }
}
</script>

<template>
    <div class="schedule-list-item__address" v-if="value && value.length > 0">
        <span class="address-text" title="选择地址" @click="openAdressLists" v-if="value.length > 1">
            <Icon class="adress-icon">&#xe605;</Icon>
            <span>{{ value[0].address }}</span>
            <span class="adress-count" v-if="value.length > 1">{{ value.length }}</span>
        </span>
        <a :href="getMapUrl(value[0])" title="打开地图" target="_blank" class="address-text" v-else>
            <Icon class="adress-icon">&#xe605;</Icon>
            <span>{{ value[0].address }}</span>
        </a>
        <el-dialog title="选择地址" :visible.sync="show">
            <a
                class="adress-item"
                :href="getMapUrl(item)"
                target="_blank"
                v-for="item in value"
                :key="item.id"
                :title="item.address"
            >{{ item.address }}</a>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import '../../../style';

.schedule-list-item__address {
    .address-text {
        color: $c-aaa;
        font-size: 1.4rem;
        cursor: pointer;
    }
    .adress-icon {
        font-size: 1.8rem;
        user-select: none;
        margin-right: 0.6rem;
    }
    .adress-count {
        background-color: $c-orange;
        border-radius: 50%;
        color: $c-white;
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        text-align: center;
        line-height: 1.4rem;
        font-size: 1rem;
        user-select: none;
        margin-left: 0.6rem;
        transform: translateY(-10%);
    }
    .adress-item {
        padding: 1.2rem;
        font-size: 1.4rem;
        min-height: 2.1rem;
        background-color: $c-eee;
        border-radius: 0.6rem;
        display: block;
        color: $c-666;
        text-align: center;
        @include add-hover-active(background-color, $c-eee);
    }
    .adress-item + .adress-item {
        margin-top: 1.2rem;
    }
}
</style>
