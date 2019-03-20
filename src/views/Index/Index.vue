<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import * as api from '@/api'
import Body from '@/components/Body.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Icon from '@/components/Icon.vue'
import List from '@/components/List.vue'
import IndexCard from './components/Card.vue'
import { IItinerary } from '@/views/index.d'
import { throttle } from '@/utils/timeInterval'

@Component({
    components: {
        Body,
        HeaderBar,
        Icon,
        List,
        IndexCard
    }
})
export default class Index extends Vue {
    lists: IItinerary[] = []
    ready = false
    loading = true
    finished = false
    page: number = 0
    created() {
        this.getLists()
    }
    getLists() {
        const page = this.page || Number(this.$route.params.page) || 1
        api.itinerary
            .lists(page)
            .then((res) => {
                if (!res) {
                    this.finished = true
                    return
                }

                this.lists.push(...res)
                this.page = page + 1
            })
            .catch((err) => {
                this.finished = true
            })
            .finally(() => {
                this.loading = false
                this.ready = true
            })
    }
    onScroll(startIndex: number, endIndex: number) {
        if (endIndex + 20 > this.lists.length) {
            throttle(this.loadmore, this, 100)
        }
    }
    loadmore() {
        if (!this.loading && !this.finished) {
            this.getLists()
        }
    }
}
</script>

<template>
    <Body background>
        <template v-slot:prepend>
            <HeaderBar>
                <template v-slot>行程目录</template>
                <template v-slot:more v-if="$store.state.loggedin">
                    <router-link to="/add" v-if="$store.state.loggedin">
                        <el-dropdown-item title="新增行程">
                            <Icon>&#xe609;</Icon>新增行程
                        </el-dropdown-item>
                    </router-link>
                </template>
            </HeaderBar>
        </template>

        <!-- 占位列表 -->
        <div class="index-list" v-if="!ready">
            <div class="index-list__item" v-for="item in [1, 2, 3, 4, 5]" :key="item">
                <IndexCard placeholder/>
            </div>
        </div>

        <DynamicScroller
            :items="lists"
            :min-item-size="110"
            class="index-list"
            typeField="state"
            page-mode
            :buffer="0"
            @update="onScroll"
            :emitUpdate="true"
        >
            <template v-slot="{ item, index, active }">
                <DynamicScrollerItem :item="item" :active="active" :data-index="index">
                    <div class="index-list__item" :key="item.id">
                        <IndexCard :value="item"/>
                    </div>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>

        <div class="index-loadmore" v-if="ready">
            {{ finished ? '没有了' : loading ? '努力加载中...' : '加载更多' }}
        </div>
    </Body>
</template>

<style lang="scss">
@import '../../style';

.index-list {
    margin-top: 1.2rem;
    &__item {
        padding: 1.2rem;
        padding-top: 0rem;
    }
    .vue-recycle-scroller__item-wrapper {
        box-sizing: content-box !important;
        overflow: initial;
    }
}
.index-loadmore {
    text-align: center;
    color: $c-ccc;
}
</style>
