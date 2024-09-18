<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Body from '@/components/Body.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'
import Label from '@/components/Label.vue'
import NoData from '@/components/NoData.vue'
import BillCard from './components/Card.vue'
import {
    IBill,
    IItinerary,
    IConsumptionType,
    IPayMode,
    ICurrency,
    ICurrencyText
} from '@/views'
import * as api from '@/api'
import { format, ts } from '@/utils/date'

interface DateInfo {
    id: string
    create_time: number
    size: number
}
@Component({
    components: {
        Body,
        HeaderBar,
        Icon,
        Button,
        IconButton,
        Label,
        NoData,
        BillCard
    }
})
export default class BillIndex extends Vue {
    @State itinerary!: IItinerary
    @State consumptionType!: IConsumptionType[]
    @State loggedin!: boolean
    @Getter getCurrencyText!: (name: string) => string
    @Getter getPayModes!: (names: string[]) => IPayMode[]
    @Getter getCurrencyTexts!: (
        target: ICurrency[],
        needCNY: boolean
    ) => ICurrencyText[]
    @Prop({ type: Boolean, default: false })
    draft!: boolean

    lists: Array<IBill | DateInfo> = []
    /* tslint:disable-next-line */
    _lists: IBill[] = []

    headerReady = false // itinerary信息
    listsReady = false // 列表生成
    loading = false // 下载或上传

    countBills = 0
    countDrafts = 0

    lastUpdateTime = 0
    filter: {
        type: string[]
        start: number
        end: number
        participant: number[]
        payer: number[]
        pay_mode: string[]
        currency: string[]
        amount: number[]
    } = {
        type: [],
        start: 0,
        end: 0,
        participant: [],
        payer: [],
        pay_mode: [],
        currency: [],
        amount: [0, 1]
    }
    amountMin = 0
    amountMax = 0
    show: {
        [name: string]: boolean
    } = {
        type: false,
        date: false,
        other: false
    }
    get pid() {
        return Number(this.$route.params.pid)
    }
    get updateButtonText() {
        return this.lastUpdateTime > 0
            ? `最后更新于${format(this.lastUpdateTime, 'YYYY-MM-DD HH:mm')}`
            : '下载账单'
    }

    @Watch('draft')
    async init() {
        /* 初始化 */
        this.headerReady = false
        this.listsReady = false
        await api.itinerary.read(this.pid)
        this.headerReady = true
        await this.getBills()
        this.updateLists()
        this.listsReady = true

        if (!this.draft) {
            this.count()
        }
    }

    @Watch('show', { deep: true })
    onFilter() {
        /* 筛选 */
        const result = Object.keys(this.show).find((key) => {
            return this.show[key]
        })
        if (!result) {
            this.listsReady = false
            this.updateLists()
            this.listsReady = true
        }
    }

    async pull() {
        /* 从服务器上拉取 */
        if (this.loading) {
            return
        }
        if (!this.countBills) {
            this.$notify.warning('似乎没有新数据')
        }
        this.loading = true
        this.listsReady = false
        try {
            await api.bill.lists(this.pid, false)
            await this.getBills()
            this.updateLists()
            this.count()
        } catch (err) {
            this.$notify.error({
                title: '',
                message: err.message,
                duration: 0
            })
        }
        this.loading = false
        this.listsReady = true
    }

    async upload() {
        /* 上传数据到服务器 draft限定 */
        if (this.loading) {
            return
        }
        this.loading = true
        this.listsReady = false
        try {
            const lists = await api.billDraft.lists(this.pid)
            await api.bill.createLists(lists)
            await api.billDraft.clear(this.pid)
            await this.getBills()
            this.updateLists()
            this.$notify.success('上传成功')
        } catch (err) {
            this.$notify.error({
                title: '',
                message: err.message,
                duration: 0
            })
        }
        this.loading = false
        this.listsReady = true
    }

    async clear() {
        try {
            this.listsReady = false
            if (this.draft) {
                await api.billDraft.clear(this.pid)
            } else {
                await api.bill.clear(this.pid)
            }
            await this.getBills()
            this.updateLists()
            this.count()
            this.$notify.success('清空成功')
        } catch (err) {
            this.$notify.error({
                title: '',
                message: err.message,
                duration: 0
            })
        }
        this.listsReady = true
    }
    clearConfirm() {
        this.$confirm(
            this.draft
                ? `确定要清空“${this.itinerary.title}”的草稿箱吗？`
                : `确定要清空“${
                      this.itinerary.title
                  }”的缓存账单（不含草稿箱）吗？`
        ).then(() => {
            this.clear()
        })
    }

    initFilter() {
        this.initFilterType()
        this.initFilterDate()
        this.initFilterOther()
    }
    initFilterType() {
        this.$set(
            this.filter,
            'type',
            this.consumptionType.map((item) => item.name)
        )
    }
    initFilterDate() {
        const length = this._lists.length
        if (length < 1) {
            const time = new Date().getTime()
            this.$set(this.filter, 'start', time)
            this.$set(this.filter, 'end', time)
        } else if (length < 2) {
            const target = this._lists.slice(0, 1)
            this.$set(this.filter, 'start', target[0].create_time)
            this.$set(this.filter, 'end', target[0].create_time)
        } else {
            const start = this._lists.slice(length - 1, length)
            const end = this._lists.slice(0, 1)
            this.$set(this.filter, 'start', start[0].create_time)
            this.$set(this.filter, 'end', end[0].create_time)
        }
    }
    initFilterOther() {
        this.$set(
            this.filter,
            'currency',
            this.getCurrencyTexts(this.itinerary.currency, true).map(
                (item) => item.name
            )
        )
        this.$set(
            this.filter,
            'participant',
            this.itinerary.partner.map((item) => item.id)
        )
        this.$set(
            this.filter,
            'payer',
            this.itinerary.partner.map((item) => item.id)
        )
        this.$set(this.filter, 'pay_mode', this.itinerary.pay_mode)
    }
    async getBills() {
        /* 获取本地数据 */
        try {
            const pid = this.pid
            const lists = this.draft
                ? await api.billDraft.lists(pid)
                : await api.bill.lists(pid, true)
            this._lists = lists
                ? lists.sort((a, b) => b.create_time - a.create_time)
                : []
            this.initFilter()

            /* 更新最后次更新时间 */
            const timestamp = await api.bill.lastUpdate(this.pid)

            this.lastUpdateTime = timestamp
        } catch (err) {
            this.$notify.error({
                title: '',
                message: err.message,
                duration: 0
            })
        }
    }

    updateLists() {
        const data = this._lists
        if (!data.length) {
            this.$set(this, 'lists', [])
            return
        }
        const result: Array<IBill | DateInfo> = []
        let cursor: number

        const { type, currency, pay_mode, payer, participant } = this.filter
        const start = ts.UTCToLocal(
            ts.toUTCZeroClock(Math.min(this.filter.start, this.filter.end))
        )
        const end = ts.UTCToLocal(
            ts.addDay(
                ts.toUTCZeroClock(Math.max(this.filter.start, this.filter.end)),
                1
            )
        )

        data.filter((item) => {
            return (
                type.includes(item.type) &&
                item.create_time >= start &&
                item.create_time < end &&
                currency.includes(item.currency) &&
                pay_mode.includes(item.pay_mode) &&
                item.payer.find((p) => payer.includes(p)) &&
                item.participant.find((p) => participant.includes(p))
            )
        }).forEach((item) => {
            const time = ts.toUTCZeroClock(item.create_time)

            if (time !== cursor) {
                cursor = time
                result.push({
                    id: `date-line-${cursor}`,
                    create_time: ts.UTCToLocal(cursor),
                    size: 36
                })
            }
            result.push(item)
        })
        this.$set(this, 'lists', result)
    }
    getDate(timestamp: string | number) {
        return format(timestamp, 'YYYY-MM-DD')
    }

    count() {
        api.bill.count(this.pid).then((res) => (this.countBills = res))
        api.billDraft.count(this.pid).then((res) => (this.countDrafts = res))
    }

    created() {
        this.init()
    }
}
</script>

<template>
    <Body background class="bill-index">
        <template v-slot:prepend>
            <HeaderBar class="bill-index__header" :grid="draft" :placeholder="!headerReady">
                <template v-slot>
                    {{ draft? '草稿箱' : '账单'}}
                    <span class="sub-title">{{ itinerary.title }}</span>
                </template>

                <template v-slot:icon></template>

                <template v-slot:icon>
                    <IconButton
                        :loading="loading"
                        title="上传数据"
                        type="danger"
                        @click="upload"
                        v-if="draft && loggedin"
                    >&#xe613;</IconButton>
                    <IconButton
                        :loading="loading"
                        :title="updateButtonText"
                        type="danger"
                        :class="{badge: countBills}"
                        @click="pull"
                        v-if="!draft"
                    >&#xe64a;</IconButton>
                    <IconButton
                        title="草稿箱"
                        type="warning"
                        :class="{badge: countDrafts}"
                        :to="`${$route.path}/draft`"
                        v-if="!draft && loggedin"
                    >&#xe614;</IconButton>
                    <IconButton
                        title="新增账单"
                        type="primary"
                        :to="`/bill/${$route.params.pid}/add`"
                        v-if="loggedin"
                    >&#xe609;</IconButton>
                </template>
                <template v-slot:more>
                    <router-link :to="`${$route.path}/chart`" v-if="!draft">
                        <el-dropdown-item title="统计图">
                            <Icon>&#xe619;</Icon>统计图
                        </el-dropdown-item>
                    </router-link>

                    <el-dropdown-item title="导出" disabled>
                        <Icon>&#xe608;</Icon>导出
                    </el-dropdown-item>

                    <el-dropdown-item :title="draft ? '清空草稿箱' : '清空缓存账单'" @click.native="clearConfirm">
                        <Icon>&#xe616;</Icon>
                        {{ draft ? '清空草稿箱' : '清空缓存账单' }}
                    </el-dropdown-item>
                </template>

                <template v-slot:other>
                    <div class="filter">
                        <div class="filter__button" @click="show.type = !show.type">类型
                            <Icon>&#xe862;</Icon>
                        </div>
                        <div class="filter__line"></div>
                        <div class="filter__button" @click="show.date = !show.date">时间
                            <Icon>&#xe69e;</Icon>
                        </div>
                        <div class="filter__line"></div>
                        <div class="filter__button" @click="show.other = !show.other">其他
                            <Icon>&#xe61c;</Icon>
                        </div>
                    </div>
                </template>
            </HeaderBar>
        </template>

        <RecycleScroller
            :items="lists"
            :minItemSize="121"
            key-field="id"
            typeField="size"
            :buffer="0"
            page-mode
            v-if="listsReady"
        >
            <template v-slot="{ item }">
                <div v-if="item.size" class="date-line">{{ getDate(item.create_time) }}</div>
                <div class="card" v-else>
                    <BillCard :value="item" :draft="draft"/>
                </div>
            </template>
        </RecycleScroller>
        <div class="loading-box" v-loading="!listsReady" v-else></div>
        <NoData v-if="listsReady && !lists.length"/>

        <el-dialog title="类型" :visible.sync="show.type">
            <el-checkbox-group v-model="filter.type">
                <el-checkbox
                    v-for="item in consumptionType"
                    :key="item.name"
                    :label="item.name"
                    border
                >{{ item.text }}</el-checkbox>
            </el-checkbox-group>
            <template v-slot:footer>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="show.type = false"
                    type="default"
                    round
                >关闭</Button>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="initFilterType"
                    type="danger"
                    round
                >重置</Button>
            </template>
        </el-dialog>

        <el-dialog title="日期" :visible.sync="show.date">
            <Label title="开始日期" :margin-top="false"/>
            <el-date-picker
                v-model="filter.start"
                type="date"
                value-format="timestamp"
                :clearable="false"
                :editable="false"
                placeholder="选择开始日期"
            ></el-date-picker>
            <Label title="结束日期"/>
            <el-date-picker
                v-model="filter.end"
                type="date"
                value-format="timestamp"
                :clearable="false"
                :editable="false"
                placeholder="选择结束日期"
            ></el-date-picker>
            <template v-slot:footer>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="show.date = false"
                    type="default"
                    round
                >关闭</Button>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="initFilterDate"
                    type="danger"
                    round
                >重置</Button>
            </template>
        </el-dialog>

        <el-dialog title="其他筛选条件" :visible.sync="show.other">
            <Label title="参与消费" :margin-top="false"/>
            <el-checkbox-group v-model="filter.participant" size="medium">
                <el-checkbox
                    v-for="item in itinerary.partner"
                    :key="item.id"
                    :label="item.id"
                    border
                >{{ item.nickname }}</el-checkbox>
            </el-checkbox-group>

            <Label title="参与支付"/>
            <el-checkbox-group v-model="filter.payer" size="medium">
                <el-checkbox
                    v-for="item in itinerary.partner"
                    :key="item.id"
                    :label="item.id"
                    border
                >{{ item.nickname }}</el-checkbox>
            </el-checkbox-group>

            <Label title="货币种类"/>
            <el-checkbox-group v-model="filter.currency" size="medium">
                <el-checkbox
                    v-for="item in getCurrencyTexts(itinerary.currency, true)"
                    :key="item.name"
                    :label="item.name"
                    border
                >{{ getCurrencyText(item.name) }}</el-checkbox>
            </el-checkbox-group>

            <Label title="支付方式"/>
            <el-checkbox-group v-model="filter.pay_mode" size="medium">
                <el-checkbox
                    v-for="item in getPayModes(itinerary.pay_mode)"
                    :key="item.name"
                    :label="item.name"
                    border
                >{{ item.text }}</el-checkbox>
            </el-checkbox-group>
            <template v-slot:footer>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="show.other = false"
                    type="default"
                    round
                >关闭</Button>
                <Button
                    class="cmpt-edit-popup__button"
                    @click="initFilterOther"
                    type="danger"
                    round
                >重置</Button>
            </template>
        </el-dialog>
    </Body>
</template>

<style lang="scss">
@import '../../style';

.bill-index {
    .vue-recycle-scroller__item-wrapper {
        box-sizing: content-box !important;
        overflow: initial;
    }
    .sub-title {
        color: $c-aaa;
        font-size: 1.4rem;
    }
    .badge {
        &:after {
            content: '';
            border-radius: 50%;
            color: $c-white;
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            background-color: $c-pink;
            position: absolute;
            right: 0.8rem;
            top: 0.8rem;
        }
    }
    .card {
        padding: 6px 12px;
    }

    .date-line {
        text-align: center;
        color: $c-ccc;
        font-size: 16px;
        line-height: 36px;
        height: 36px;
        overflow: hidden;
        white-space: nowrap;
    }
    .filter {
        height: 3.6rem;
        line-height: 3.5rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        &__button {
            cursor: pointer;
            flex-grow: 1;
            color: $c-999;
        }
        &__line {
            height: 40%;
            width: 0;
            border-right: 1px $c-ccc solid;
        }
    }
    .close-button {
        margin-top: 1.2rem;
    }
    .loading-box {
        height: 20rem;
    }
}
</style>
