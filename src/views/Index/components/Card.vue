<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Card from '@/components/Card.vue'
import Placeholder from '@/components/Placeholder.vue'
import ColoredDateText from '@/components/ColoredDateText.vue'
import { format } from '@/utils/date'
import { IItinerary, IPartner } from '@/views/index.d'

@Component({
    components: {
        Card,
        Placeholder,
        ColoredDateText
    }
})
export default class IndexCard extends Vue {
    @Prop()
    value!: IItinerary
    @Prop({ type: Boolean, default: false })
    placeholder!: boolean
    partnerToText(partner: IPartner[]) {
        const arr = []
        for (const i in partner) {
            if (partner[i] !== void 0) {
                arr.push(partner[i].nickname)
            }
        }
        return arr.join(' ')
    }
    getWeek(time: number) {
        return format(time, 'dddd')
    }
    get status() {
        const now = new Date().getTime()
        const start = this.value.start_time || 0
        const diff = (this.value.days || 0) * 86400000
        if (start <= now && now < start + diff) {
            return '进行中'
        }
        return ''
    }
}
</script>

<template>
    <!-- 占位符 -->
    <Card v-if="placeholder">
        <div class="index-list-item__card">
            <div class="days">
                <Placeholder :length="5"/>
            </div>
            <div class="title">
                <Placeholder :random="[6, 16]"/>
            </div>
            <div class="week">
                <Placeholder :length="6"/>
            </div>
            <div class="time">
                <Placeholder :length="14"/>
            </div>
        </div>
    </Card>

    <!-- 列表卡片 -->
    <Card :label="!(!status)" labelColor="primary" :to="`/itinerary/${value.id}`" v-else>
        <template v-slot:label>{{ status }}</template>
        <div class="index-list-item__card">
            <div class="days">{{ `${value.days}天` }}</div>
            <div class="title">{{ value.title }}</div>
            <div class="week">{{ getWeek(value.start_time) }}</div>
            <div class="time">
                <ColoredDateText :date="value.start_time" format="YYYY / MM / DD"/>
            </div>
        </div>
    </Card>
</template>

<style lang="scss" scoped>
@import '../../../style';

.index-list-item__card {
    padding: 1rem 1.2rem;
    line-height: 1.2;

    .title {
        color: $c-primary-font;
        font-size: 3rem;
    }
    .days {
        color: $c-pink;
        font-size: 1.4rem;
        float: right;
        margin-top: 0.16rem;
    }
    .time {
        font-size: 1.4rem;
        margin-top: 1rem;
    }
    .week {
        color: $c-aaa;
        font-size: 1.4rem;
        float: right;
        margin-top: 1rem;
        display: none;
    }
    @media screen and (min-width: 240px) {
        .week {
            display: block;
        }
    }
}

/* 编辑模式专用 */
.index-list-item__card.edit {
    display: flex;
    align-items: center;
    .title {
        font-size: 2rem;
        flex: 1;
    }
    .edit-time {
        font-size: 1.2rem;
        padding-left: 1.2rem;
    }
    @media screen and (max-width: 320px) {
        .edit-time {
            display: none;
        }
    }
}
</style>
