<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as api from '@/api'
import { BMap as config } from '@/config'
import { IPosition } from '@/views'

@Component({
    components: {}
})
export default class Map extends Vue {
    $refs!: {
        map: HTMLElement
    }
    @Prop()
    routeModule!: string
    ready = false
    bmapPromise?: Promise<{}>
    map!: any
    x = 0
    y = 0
    count = 0
    lists: IPosition[] = []
    getBmap() {
        /* 加载百度地图插件 */
        if (!this.bmapPromise) {
            this.bmapPromise = new Promise((resolve, reject) => {
                window[config.callbackName] = resolve

                const script = document.createElement('script')
                script.src = [
                    `https://api.map.baidu.com/api?v=${config.version ||
                        '3.0'}`,
                    `ak=${config.ak}`,
                    `callback=${config.callbackName}`
                ].join('&')

                document.body.appendChild(script)
            })
        }
        return this.bmapPromise
    }
    init() {
        const BMap = window.BMap
        const map = new BMap.Map('map')
        this.map = map
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())
        // map.addControl(new BMap.OverviewMapControl())
        // map.addControl(new BMap.MapTypeControl()) // 地图 卫星 三维
        map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    }
    getData() {
        const id = Number(this.$route.params.id)
        return this.routeModule === 'schedule'
            ? api.position.schedule(id)
            : api.position.itinerary(id)
    }
    appendPoint(value: IPosition) {
        // TODO: 图标分类
        const BMap = window.BMap
        const point = new BMap.Point(value.x, value.y)
        const marker = new BMap.Marker(point) // 创建标注
        this.map.addOverlay(marker) // 将标注添加到地图中
        marker.setAnimation(window.BMAP_ANIMATION_BOUNCE) // 跳动的动画
        const label = new BMap.Label(value.title, {
            offset: new BMap.Size(23, -10)
        }) // 创建标签
        marker.setLabel(label) // 设置标签

        this.x += Number(value.x || 0)
        this.y += Number(value.y || 0)
        this.count += 1
        this.lists.push(value)
    }
    average(arr: number[]) {
        let count = 0
        let sum = 0
        arr.forEach((item) => {
            count += 1
            sum += item
        })
        return sum / (count || 1)
    }
    needReverse() {
        /* 条件1： 平均经度 < 90 */
        const arr = this.lists.map((item) => Number(item.x))
        if (this.average(arr) > 90) {
            return false
        }

        /* 条件2：平均经度绝对值 > 90 */
        const arrAbs = arr.map((item) => Math.abs(item))
        if (this.average(arrAbs) < 90) {
            return false
        }

        return true
    }
    getPoints(reverse: boolean) {
        /* 两个极点 用于算距离 */
        /* 一个中心点确定位置 */
        const BMap = window.BMap
        let xArr = this.lists.map((item) => Number(item.x))
        const yArr = this.lists.map((item) => Number(item.y))
        if (reverse) {
            /* 将经度180 换作0度经线，E170就变成W10 然后再去计算极值 */
            xArr = xArr.map((item) => (item > 0 ? 180 - item : -180 - item))
        }
        const maxPoint = {
            x: Math.max(-180, ...xArr),
            y: Math.max(-90, ...yArr)
        }
        const minPoint = {
            x: Math.min(180, ...xArr),
            y: Math.min(90, ...yArr)
        }

        let x = this.average(xArr)
        const y = this.average(yArr)
        if (reverse) {
            /* xArr如果没有进行反转，这个x就是average(xArr)的经度 + 180度 */
            /* 但由于前面反转了，这次要镜像反转再+180 */
            x = x > 0 ? 180 - x : -180 - x
        }

        return {
            max: new BMap.Point(maxPoint.x, maxPoint.y),
            min: new BMap.Point(minPoint.x, minPoint.y),
            center: new BMap.Point(x || 116.404, y || 39.915)
        }
    }
    getLevel(distance: number) {
        const zoom = [
            10000000,
            5000000,
            2000000,
            1000000,
            500000,
            200000,
            100000,
            50000,
            25000,
            10000,
            5000,
            2000,
            1000,
            500
        ]
        const width = this.$refs.map.clientWidth
        let level = 3
        zoom.forEach((item, index) => {
            const distancePX = (distance * 800) / item
            if (width > distancePX) {
                level = index + 4
            }
        })
        level = Math.max(level, 3)
        level = Math.min(level, 18)

        return level
    }
    setCenter() {
        const reverse = this.needReverse()
        const points = this.getPoints(reverse)
        const distance = this.map.getDistance(points.max, points.min)
        const level = this.getLevel(distance)
        this.map.centerAndZoom(points.center, level)
    }
    mounted() {
        this.getBmap().then(() => {
            this.init()
            this.getData()
                .then((res) => {
                    if (!res) {
                        return
                    }
                    res.forEach((item) => this.appendPoint(item))
                })
                .finally(() => {
                    this.setCenter()
                    this.ready = true
                })
        })
    }
}
</script>

<template>
    <div class="map-index" v-loading="!ready">
        <div class="map-index__body" :class="{ready}" id="map" ref="map"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../style';

.map-index {
    position: fixed;
    top: 1.2rem;
    bottom: 5.7rem;
    left: 1.2rem;
    right: 1.2rem;
    border-radius: 1.2rem;
    box-shadow: box-shadow(3);
    overflow: hidden;
    &__body {
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 1s;
        &.ready {
            opacity: 1;
        }
    }
}
@media screen and (min-width: 1000px) {
    .map-index {
        bottom: 1.2rem;
    }
}
</style>
