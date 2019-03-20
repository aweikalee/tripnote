import { EChartOption } from 'echarts'
import { default as defaultOptions } from './default.json'
import { default as bar } from './bar.json'
import { default as pie } from './pie.json'

const options: {
    [name: string]: EChartOption.Series
} = {
    default: defaultOptions,
    bar,
    pie
}
export default options
