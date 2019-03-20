<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import * as api from '@/api'
import Body from '@/components/Body.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Icon from '@/components/Icon.vue'
import IconButton from '@/components/IconButton.vue'
import Placeholder from '@/components/Placeholder.vue'
import DragList from '@/components/DragList.vue'
import ColoredDateText from '@/components/ColoredDateText.vue'
import NoData from '@/components/NoData.vue'
import ScheduleCard from './components/Card.vue'
import { htmlEncode, breakEncode } from '@/utils/encode'
import { ISchedule, IDetail, IItinerary, ICurrency } from '@/views'

@Component({
    components: {
        Body,
        HeaderBar,
        Icon,
        IconButton,
        Placeholder,
        DragList,
        ColoredDateText,
        NoData,
        ScheduleCard
    }
})
export default class Schedule extends Vue {
    @State('itinerary') itineraryInfo!: IItinerary
    @State('schedule') scheduleInfo!: ISchedule
    @State detailSpread!: boolean
    @Getter getCurrencyRate!: (name: string) => number
    lists: IDetail[] = []
    ready = false
    headerReady = false
    isSort = false
    created() {
        this.getSchedule()
        this.getLists()
    }
    getLists() {
        api.detail
            .lists(Number(this.$route.params.id))
            .then((res) => {
                if (res) {
                    this.lists.push(...res)
                }
            })
            .catch((err) => {
                this.$notify.error({
                    title: '',
                    message: err.message,
                    duration: 0
                })
            })
            .finally(() => {
                this.ready = true
            })
    }
    setItinerary(pid: number) {
        api.itinerary
            .read(pid)
            .then((res) => {
                this.headerReady = true
            })
            .catch((err) => {
                this.$notify.error({
                    title: '',
                    message: err.message,
                    duration: 0
                })
            })
    }
    getSchedule() {
        api.schedule
            .read(Number(this.$route.params.id))
            .then((res) => {
                this.setItinerary(res.pid!)
            })
            .catch((err) => {
                this.$notify.error({
                    title: '',
                    message: err.message,
                    duration: 0
                })
            })
    }
    descriptionEncode(text: string) {
        return breakEncode(htmlEncode(text))
    }
    get date() {
        if (this.itineraryInfo.start_time && this.scheduleInfo.sort) {
            return (
                (this.itineraryInfo.start_time as number) +
                ((this.scheduleInfo.sort as number) - 1) * 86400000
            )
        } else {
            return 0
        }
    }
    get totalCost() {
        const currency = this.itineraryInfo.currency || []
        let total = 0
        this.lists.forEach((item) => {
            const type = item.currency
            const rate = this.getCurrencyRate(type)
            total += Number(item.amount) * rate
        })
        return Math.floor(total)
    }
    sort(lists: IDetail[]) {
        const oldSort = this.lists
            .map((item) => {
                return item.id
            })
            .join(',')
        const newSort = lists
            .map((item) => {
                return item.id
            })
            .join(',')
        if (oldSort !== newSort) {
            lists = lists.map((item, index) => {
                item.sort = index + 1
                return item
            })
            this.lists = lists
            api.detail.sort(lists, true).catch((err) => {
                this.$notify.error({
                    title: '',
                    message: err.message,
                    duration: 0
                })
            })
        }
    }
    setDetailSpread() {
        this.$store.commit('detailSpread', !this.detailSpread)
    }
}
</script>

<template>
    <Body background>
        <template v-slot:prepend>
            <HeaderBar :placeholder="!headerReady">
                <template
                    v-slot
                >{{ scheduleInfo.type === 1 ? `Day ${scheduleInfo.sort}` : scheduleInfo.title }}</template>
                <template v-slot:icon>
                    <IconButton
                        title="地图"
                        :to="`/schedule/${$route.params.id}/map`"
                        type="danger"
                    >&#xe602;</IconButton>
                </template>
                <template v-slot:more>
                    <router-link
                        :to="`/schedule/${$route.params.id}/edit`"
                        v-if="$store.state.loggedin"
                    >
                        <el-dropdown-item title="编辑日程">
                            <Icon>&#xe601;</Icon>编辑日程
                        </el-dropdown-item>
                    </router-link>

                    <router-link
                        :to="`/schedule/${$route.params.id}/add`"
                        v-if="$store.state.loggedin"
                    >
                        <el-dropdown-item title="新增详情">
                            <Icon>&#xe609;</Icon>新增详情
                        </el-dropdown-item>
                    </router-link>

                    <el-dropdown-item
                        title="排序"
                        @click.native="isSort = !isSort"
                        v-if="$store.state.loggedin"
                    >
                        <Icon>&#xe63a;</Icon>排序
                        <el-switch :value="isSort" :active-value="true" :inactive-value="false"/>
                    </el-dropdown-item>

                    <el-dropdown-item
                        :title="detailSpread? '全部展开' : '默认收起'"
                        @click.native="setDetailSpread"
                    >
                        <Icon>{{ detailSpread? '&#xe60e;' : '&#xe60f;' }}</Icon>
                        {{ detailSpread? '全部展开' : '默认收起' }}
                        <el-switch
                            :value="detailSpread"
                            :active-value="true"
                            :inactive-value="false"
                        />
                    </el-dropdown-item>

                    <el-dropdown-item title="地图设置" disabled>
                        <Icon>&#xe602;</Icon>地图设置
                    </el-dropdown-item>
                </template>
            </HeaderBar>
        </template>
        <!-- 占位头部 -->
        <div class="schedule-header" v-if="!headerReady">
            <div class="info">
                <div>
                    <Placeholder :length="16"/>
                </div>
                <div class="total">
                    <Placeholder :random="[10, 16]"/>
                </div>
            </div>
            <div class="description">
                <Placeholder :random="[20, 50]"/>
            </div>
        </div>
        <!-- 头部 -->
        <div class="schedule-header" v-else>
            <div class="info" v-if="scheduleInfo.type !== 1">
                <div>
                    <ColoredDateText :date="date" format="[ dddd ] MM / DD"/>
                </div>
                <div class="total" v-if="totalCost">日人均约 CNY {{ totalCost }}</div>
            </div>
            <div class="description" v-html="descriptionEncode(scheduleInfo.description)"></div>
        </div>

        <!-- 占位列表 -->
        <div class="schedule-list" v-if="!ready">
            <ScheduleCard
                class="schedule-list-item"
                v-for="item in [1, 2, 3, 4, 5]"
                :key="item"
                placeholder
            />
        </div>

        <!-- 列表 -->
        <DragList class="schedule-list" :value="lists" @input="sort">
            <component
                :is="isSort ? 'slick-item' : 'div'"
                v-for="(item, index) in lists"
                class="schedule-list-item"
                :key="item.id"
                :index="index"
            >
                <ScheduleCard :value="item" :drag="isSort"/>
            </component>
        </DragList>

        <NoData v-if="ready && !lists.length"/>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';

.schedule-list-item {
    margin: 1.2rem;
}
.schedule-list-button {
    margin: 1.2rem;
}
.schedule-header {
    padding: 1.2rem;
    max-width: 720px;
    margin: 0 auto;
    .info {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .total {
        color: $c-pink;
    }
    .description {
        color: $c-999;
        margin-top: 0.6rem;
    }
}
</style>
