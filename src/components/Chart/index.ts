import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// import echarts, { ECharts, EChartOption } from 'echarts'
import echarts, { ECharts, EChartOption } from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/legendScroll'
// import 'echarts/lib/component/grid'
import { debounce } from '@/utils/timeInterval'
import mergeWith from 'lodash/mergeWith'

import { default as theme } from './theme.json'
import defaultOptions from './options'
import defaultSeriesOptions from './seriesOptions'

echarts.registerTheme('awwwk', theme)

const mergeCustomizer = (objValue: any, srcValue: any) => {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue)
    }
}

@Component({
    render(h) {
        return h('div', {
            ref: 'chart'
        })
    }
})
export default class Chart extends Vue {
    $refs!: {
        chart: HTMLCanvasElement
    }
    @Prop()
    series?: EChartOption.Series[]

    @Prop()
    echartOptions!: EChartOption
    @Prop({ type: String, default: 'bar' })
    type!: string

    chart!: ECharts

    /* series里添加一些定义好的属性 */
    get seriesWithOptions(): EChartOption.Series[] {
        const { type, series } = this
        return (series || []).map((item) => {
            const result = {}
            mergeWith(
                result,
                this.getSeriesProp(item.type || type),
                mergeCustomizer
            )
            mergeWith(result, item, mergeCustomizer)
            return result
        })
    }

    /* 获取series子项的默认属性 */
    getSeriesProp(type: string) {
        const prop = {}
        const mergeArray = [
            defaultSeriesOptions.default,
            type in defaultSeriesOptions ? defaultSeriesOptions[type] : {},
            {
                type
            }
        ]
        mergeArray.forEach((item) => {
            mergeWith(prop, item, mergeCustomizer)
        })
        return prop
    }

    /* 数据更新 */
    changeHandler() {
        this.chart.clear()
        const options: EChartOption = {}
        const mergeArray = [
            defaultOptions.default,
            this.type in defaultOptions ? defaultOptions[this.type] : {},
            this.echartOptions || {},
            {
                series: this.seriesWithOptions
            }
        ]
        mergeArray.forEach((item, i) => {
            mergeWith(options, item, mergeCustomizer)
        })
        this.chart.setOption(options)
    }
    /* 尺寸更新 */
    resizeHandler() {
        this.chart.resize()
    }

    @Watch('series', {
        deep: true
    })
    onChange() {
        debounce(this.chart.resize, this.chart, 100)
        debounce(this.changeHandler, this, 100)
    }
    onResize() {
        debounce(this.resizeHandler, this, 200)
    }
    init() {
        if (this.chart) {
            return
        }
        this.chart = echarts.init(this.$refs.chart, 'awwwk')
        this.changeHandler()
    }
    mounted() {
        this.init()
        window.addEventListener('resize', this.onResize)
    }
    destroyed() {
        window.removeEventListener('resize', this.onResize)
    }
}
