import { EChartOption } from 'echarts'
import { IBill } from '@/views'
import { format, ts } from '@/utils/date'
import store from '@/store'
const state = store.state
const getters = store.getters

interface ChartMap {
    title: string
    type: string
    method: (
        lists: IBill[],
        partners: number[]
    ) => {
        series: EChartOption.Series[]
        options: EChartOption
    }
}

function sum(arr: number[]) {
    return arr.length ? Math.round(arr.reduce((pre, now) => pre + now)) : 0
}

function createDot(color?: string) {
    return `<span style="display:inline-block;background-color:${
        color ? color : '#ccc'
    };margin-right:5px;border-radius:10px;width:9px;height:9px;"></span>`
}

function filterByPartners(lists: IBill[], partners: number[]) {
    return lists.filter((item) => {
        return partners.find((partner) => item.participant.includes(partner))
    })
}

const map: ChartMap[] = []
map.push({
    /*
    series: [{
        data: [{
            name: 消费类型,
            value: 该消费类型的合计消费
        }]
    }]
     */
    title: '消费类型饼图',
    type: 'pie',
    method(lists, partners) {
        /* 系列 */
        const series: EChartOption.Series[] = []
        const filtered = filterByPartners(lists, partners)
        const data = state.consumptionType
            .map((item) => item) // 避免对原数据进行修改
            .sort((a, b) => a.sort - b.sort) // 按事先设定的排序，为了让颜色序列更符合感受
            .map((type) => {
                const arr = filtered
                    .filter((item) => item.type === type.name)
                    .map((item) => {
                        const rate = getters.getCurrencyRate(item.currency)
                        const percent =
                            item.participant.filter((p) => partners.includes(p))
                                .length / item.participant.length
                        return Number(item.amount) / rate * percent
                    })
                const total = Math.round(sum(arr))
                return {
                    value: total,
                    name: type.text,
                    label: {
                        show: !!total,
                        formatter(v: any) {
                            return `${v.name}\n${v.value}元`
                        }
                    },
                    labelLine: {
                        show: !!total
                    }
                }
            })
        series.push({
            name: '类型',
            // roseType: true,
            data
        })

        /* 其他设置 */
        const options: EChartOption = {
            tooltip: {
                formatter: '{b} ({d}%)<br/>{c}元'
            }
        }
        return {
            series,
            options
        }
    }
})

map.push({
    /*
    series: [{
        name: 消费类型,
        data: [根据时间轴计算的值]
    }]
     */
    title: '消费统计柱状图',
    type: 'bar',
    method(lists, partners) {
        /* 系列 */
        const series: EChartOption.Series[] = []
        const filtered = filterByPartners(lists, partners)

        const timeline: number[] = (() => {
            const timeArr = filtered.map((item) => item.create_time)
            const now = new Date().getTime()
            const min = ts.UTCToLocal(
                ts.toUTCZeroClock(Math.min(now, ...timeArr))
            )
            const max = ts.UTCToLocal(
                ts.toUTCZeroClock(Math.max(min, ...timeArr))
            )

            const arr = []
            for (let i = min; i <= max; i = ts.addDay(i, 1)) {
                arr.push(i)
            }
            return arr
        })()

        const data = state.consumptionType
            .map((item) => item) // 避免对原数据进行修改
            .sort((a, b) => a.sort - b.sort) // 按事先设定的排序，为了让颜色序列更符合感受
            .map((type) => {
                return {
                    name: type.text,
                    stack: '堆叠',
                    data: timeline.map((time) => {
                        const arr = filtered
                            .filter((item) => {
                                return (
                                    item.type === type.name &&
                                    time <= item.create_time &&
                                    item.create_time < ts.addDay(time, 1)
                                )
                            })
                            .map((item) => {
                                const rate = getters.getCurrencyRate(
                                    item.currency
                                )
                                const percent =
                                    item.participant.filter((p) =>
                                        partners.includes(p)
                                    ).length / item.participant.length
                                return Number(item.amount) / rate * percent
                            })
                        return sum(arr)
                    }),
                    label: {
                        normal: {
                            show: !state.isMobile,
                            formatter(v: any) {
                                return v.value ? v.value : ''
                            }
                        }
                    }
                }
            })
        series.push(...data)

        /* 合计 */
        const totalData = timeline.map((type, index) => {
            return sum(data.map((item) => item.data[index]))
        })
        series.push({
            name: '合计',
            data: totalData,
            type: 'line',
            label: {
                show: true,
                color: '#999'
            },
            smooth: false
        })

        /* 其他设置 */
        const endValue = timeline.length - 1
        const startValue = Math.max(0, endValue - 7)
        const options: EChartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter(params) {
                    if (!Array.isArray(params)) {
                        return ''
                    }
                    const arr = params.filter((item) => {
                        return item.seriesName !== '合计'
                    })
                    if (!arr.length) {
                        return ''
                    }
                    const total =
                        sum(arr.map((item) => Number(item.value))) || 1
                    const result = arr
                        .map((item) => {
                            const percent = Math.round(
                                (Number(item.value) * 100) / total
                            )

                            return percent > 0
                                ? `${createDot(item.color)}${
                                      item.seriesName
                                  }: ${item.value}元 (${percent}%)`
                                : ''
                        })
                        .filter((item) => item)
                    return `${arr[0].name}<br/>${result.join('<br/>')}`
                }
            },
            xAxis: {
                type: 'category',
                data: timeline.map((time) => {
                    return format(time, 'MM-DD')
                })
            },
            yAxis: {
                type: 'value'
            },
            grid: {
                bottom: state.isMobile ? 68 : 92
            },
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    bottom: 50,
                    height: state.isMobile ? 12 : 36,
                    dataBackground: {
                        lineStyle: {
                            color: '#88eedd',
                            width: 1,
                            opacity: 1
                        }
                    },
                    startValue,
                    endValue
                } as any,
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    startValue,
                    endValue
                }
            ]
        }
        return {
            series,
            options
        }
    }
})

map.push({
    /*
    series: [{
        data: [{
            name: 名字,
            value: 结算值，正为应有收入，负为应有支出
        }]
    }]
     */
    title: '收支结算',
    type: 'bar',
    method(lists) {
        /* 系列 */
        const series: EChartOption.Series[] = []

        const data: {
            [id: number]: number
        } = {}
        state.itinerary.partner.forEach((partner) => {
            data[partner.id!] = 0
        })
        lists.forEach((item) => {
            const { payer, participant, balance } = item
            const amount =
                Number(item.amount) / getters.getCurrencyRate(item.currency)
            const amountPart = amount / participant.length
            const realBalance = Object.assign([], payer, balance)

            const unpaid = participant
                .filter((id) => {
                    return !realBalance.includes(id)
                })
                .map((id) => {
                    data[id] -= amountPart
                    return id
                }).length

            payer.forEach((id) => {
                data[id] += (amountPart * unpaid) / payer.length
            })
        })

        series.push({
            name: '结算',
            data: state.itinerary.partner.map((partner) => {
                return partner.id! in data
                    ? Number(data[partner.id!]).toFixed(2)
                    : 0
            }),
            label: {
                normal: {
                    position: 'inside',
                    color: '#666'
                }
            }
        })

        /* 其他设置 */
        const options: EChartOption = {
            grid: {
                bottom: 12
            },
            legend: {
                show: false
            },
            tooltip: {
                formatter: '{b} <br/>{c}元'
            },
            xAxis: {
                type: 'category',
                data: state.itinerary.partner.map((partner) => {
                    return partner.nickname
                })
            },
            yAxis: {
                type: 'value'
            },
            visualMap: [
                {
                    type: 'continuous',
                    show: false
                }
            ]
        }
        return {
            series,
            options
        }
    }
})

export default map
