<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import * as api from '@/api'
import Body from '@/components/Body.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Icon from '@/components/Icon.vue'
import IconButton from '@/components/IconButton.vue'
import DragList from '@/components/DragList.vue'
import ColoredDateText from '@/components/ColoredDateText.vue'
import NoData from '@/components/NoData.vue'
import ItineraryCard from './components/Card.vue'
import { IItinerary, IPartner, ISchedule } from '@/views'
import { htmlEncode, breakEncode } from '@/utils/encode'

@Component({
    components: {
        Body,
        HeaderBar,
        Icon,
        IconButton,
        DragList,
        ColoredDateText,
        NoData,
        ItineraryCard
    }
})
export default class Itinerary extends Vue {
    @State('itinerary') info!: IItinerary
    lists: ISchedule[] = []
    customLists: ISchedule[] = []
    ready = false
    headerReady = false
    isSort = false
    created() {
        this.getInfo()
        this.getLists()
    }
    getLists() {
        api.schedule.lists(Number(this.$route.params.id)).then((res) => {
            this.ready = true
            if (!res) {
                return
            }
            this.lists.push(
                ...res.filter((item) => {
                    return item.type === 1
                })
            )
            this.customLists.push(
                ...res.filter((item) => {
                    return item.type === 2
                })
            )
        })
    }
    getInfo() {
        api.itinerary.read(Number(this.$route.params.id)).then(() => {
            this.headerReady = true
        })
    }
    sort(lists: ISchedule[], type: 'lists' | 'customLists' = 'lists') {
        const oldSort = this[type]
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
            this[type] = lists
            api.schedule.sort(lists, true).catch((err) => {
                this.$notify.error({
                    title: '',
                    message: err.message,
                    duration: 0
                })
            })
        }
    }
    customSort(lists: ISchedule[]) {
        this.sort(lists, 'customLists')
    }
    cache() {
        this.$confirm('可能产生大量流量，缓存内容不包含图片。').then(() => {
            const loading = this.$loading({
                lock: true,
                text: '缓存中...'
            })

            const lists = [...this.lists, ...this.customLists]
            const schedule = lists.map((item) => api.schedule.read(item.id!))
            const detail = lists.map((item) => api.detail.lists(item.id!))
            Promise.all([Promise.all(schedule), Promise.all(detail)])
                .then(() => {
                    this.$notify.success('缓存完成，请断开网络进行检查')
                })
                .catch((e) => {
                    this.$notify.error({
                        title: '',
                        message: e.message,
                        duration: 0
                    })
                })
                .finally(() => {
                    loading.close()
                })
        })
    }
    descriptionEncode(text: string) {
        return breakEncode(htmlEncode(text))
    }
}
</script>

<template>
    <Body background>
        <template v-slot:prepend>
            <HeaderBar :placeholder="!headerReady">
                <template v-slot>{{ info.title }}</template>
                <template v-slot:icon>
                    <IconButton
                        title="地图"
                        :to="`/itinerary/${$route.params.id}/map`"
                        type="danger"
                    >&#xe602;</IconButton>
                </template>
                <template v-slot:more>
                    <router-link
                        :to="`/itinerary/${$route.params.id}/edit`"
                        v-if="$store.state.loggedin"
                    >
                        <el-dropdown-item title="编辑行程">
                            <Icon>&#xe601;</Icon>编辑行程
                        </el-dropdown-item>
                    </router-link>

                    <router-link
                        :to="`/itinerary/${$route.params.id}/add`"
                        v-if="$store.state.loggedin"
                    >
                        <el-dropdown-item title="新增日程">
                            <Icon>&#xe609;</Icon>新增日程
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

                    <el-dropdown-item title="地图设置" disabled>
                        <Icon>&#xe602;</Icon>地图设置
                    </el-dropdown-item>

                    <el-dropdown-item title="缓存行程" @click.native="cache">
                        <Icon>&#xe64a;</Icon>缓存行程
                    </el-dropdown-item>
                </template>
            </HeaderBar>
        </template>

        <!-- 头部 -->
        <div class="itinerary-header" v-if="headerReady && info.description">
            <div class="description" v-html="descriptionEncode(info.description)"></div>
        </div>

        <!-- 占位符 -->
        <div class="itinerary-list" v-if="!ready">
            <ItineraryCard
                v-for="item in [1, 2, 3, 4, 5]"
                :key="item"
                class="itinerary-list-item"
                placeholder
            />
        </div>

        <!-- 普通行程单-->
        <DragList class="itinerary-list" :value="lists" @input="sort">
            <component
                :is="isSort ? 'slick-item' : 'div'"
                class="itinerary-list-item"
                v-for="(item, index) in lists"
                :key="item.id"
                :index="index"
            >
                <ItineraryCard :value="item" :start-time="info.start_time" :drag="isSort"/>
            </component>
        </DragList>

        <!-- 自定义清单-->
        <DragList class="itinerary-list" :value="customLists" @input="customSort">
            <component
                :is="isSort ? 'slick-item' : 'div'"
                class="itinerary-list-button"
                v-for="(item, index) in customLists"
                :key="item.id"
                :index="index"
            >
                <ItineraryCard :value="item" :drag="isSort"/>
            </component>
        </DragList>

        <NoData v-if="ready && !lists.length && !customLists.length"/>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';

.itinerary-header {
    padding: 1.2rem;
    max-width: 720px;
    margin: 0 auto;
    .description {
        margin-top: 0.6rem;
        color: $c-999;
    }
}

.itinerary-list-item {
    margin: 1.2rem;
    margin-left: 2.4rem;
    user-select: none;
}
.itinerary-list-button {
    margin: 1.2rem;
}

</style>
