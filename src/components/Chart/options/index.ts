import { EChartOption } from 'echarts'
import { default as defaultOptions } from './default.json'

const options: {
    [name: string]: EChartOption
} = {
    default: defaultOptions as unknown as EChartOption
}
export default options
