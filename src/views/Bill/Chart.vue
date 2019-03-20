<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import Chart from '@/components/Chart'
import Label from '@/components/Label.vue'
import * as api from '@/api'
import { IItinerary, IBill, IConsumptionType } from '@/views'
import ChartMap from './components/ChartMap'
import { EChartOption } from 'echarts'
import itinerary from '@/api/moudule/itinerary'

@Component({
    components: {
        Body,
        Chart,
        Label
    }
})
export default class BillChart extends Vue {
    @State itinerary!: IItinerary
    @State consumptionType!: IConsumptionType[]
    @Getter getCurrencyRate!: (name: string) => number

    lists: IBill[] = []
    ChartMap = ChartMap
    index = 0
    partners: number[] = []
    disableIndex = [2]

    chartType = 'bar'
    chartOptions: EChartOption = {}
    chartSeries: EChartOption.Series[] = []

    @Watch('index')
    indexChange() {
        this.setData(true)
    }
    @Watch('partners')
    partnersChange() {
        this.setData(false)
    }
    setData(animation: boolean) {
        const self = ChartMap[this.index]
        if (!self) {
            return
        }

        const { title, type, method } = self

        const { series, options } = method(this.lists, this.partners)
        this.chartType = type || 'bar'
        this.chartOptions = Object.assign(
            {
                animation
            },
            options || {}
        )
        this.chartSeries = series || []
    }
    getLists() {
        return new Promise((reslove, reject) => {
            api.bill
                .lists(Number(this.$route.params.pid), true)
                .then((res) => {
                    if (res) {
                        this.lists.push(
                            ...res.filter((item) => {
                                return item.count === 1
                            })
                        )
                    }
                    reslove()
                })
                .catch((e) => reject(e))
        })
    }
    mounted() {
        const loading = this.$loading({
            lock: true,
            text: '初始化中'
        })
        Promise.all([
            this.getLists(),
            api.itinerary.read(Number(this.$route.params.pid))
        ]).finally(() => {
            this.partners =
                this.itinerary.partner.map((item) => item.id || 0) || []
            this.setData(true)
            loading.close()
        })
    }
}
</script>

<template>
    <Body class="bill-chart" padding>
        <template v-slot:prepend>
                <Chart
                    :series="chartSeries"
                    :echart-options="chartOptions"
                    :type="chartType"
                    class="chart"
                />
        </template>

        <Label title="成员筛选"/>
        <el-checkbox-group v-model="partners" size="medium" :disabled="disableIndex.includes(index)">
            <el-checkbox
                v-for="item in itinerary.partner"
                :key="item.id"
                :label="item.id"
            >{{ item.nickname }}</el-checkbox>
        </el-checkbox-group>

        <Label title="统计图类型"/>
        <el-radio-group v-model="index" size="medium">
            <el-radio
                v-for="(item, index) in ChartMap"
                :key="item.title"
                :label="index"
                border
            >{{ item.title }}</el-radio>
        </el-radio-group>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style.scss';

.bill-chart {
    .chart {
        width: 100%;
        height: 80vw;
        max-height: calc(100vh - 4.5rem);
        position: relative;
        background-color: $c-white;
        box-shadow: box-shadow(1);
        overflow: hidden;
        @media screen and (min-width: 800px) {
            border-radius: 0 0 1.2rem 1.2rem;
            height: 640px;
        }
    }
}
</style>
