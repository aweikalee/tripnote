<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Card from '@/components/Card.vue'
import Button from '@/components/Button.vue'
import Placeholder from '@/components/Placeholder.vue'
import ColoredDateText from '@/components/ColoredDateText.vue'
import { format } from '@/utils/date'
import { htmlEncode, breakEncode } from '@/utils/encode'
import { ISchedule } from '@/views/index.d'

@Component({
    components: {
        Card,
        Button,
        Placeholder,
        ColoredDateText
    }
})
export default class ItineraryCard extends Vue {
    @Prop()
    value!: ISchedule
    @Prop({ type: Boolean, default: false })
    drag!: boolean
    @Prop()
    startTime!: number
    @Prop({ type: Boolean, default: false })
    placeholder!: boolean
    descriptionEncode(text: string) {
        return breakEncode(htmlEncode(text))
    }
}
</script>

<template>
    <!-- 占位符 -->
    <Card class="itinerary-list-item__card" v-if="placeholder">
        <div class="itinerary-list-item">
            <div class="day"></div>
            <div class="departure-time">
                <Placeholder :length="10"/>
            </div>
            <div class="time">
                <Placeholder :length="17"/>
            </div>
            <div class="tag">
                <Placeholder
                    :random="[2, 8]"
                    class="tag-item"
                    style="border-color: transparent"
                    v-for="item in [1, 2, 3, 4]"
                    :key="item"
                    v-show="item <= 2 || 0 === Math.floor(Math.random() * 2)"
                />
            </div>
            <div class="description">
                <Placeholder :random="[20, 50]"/>
            </div>
        </div>
    </Card>

    <!-- 普通卡片 -->
    <Card
        class="itinerary-list-item__card"
        :to="drag ? '' : `/schedule/${value.id}`"
        v-else-if="value.type === 1"
    >
        <div class="itinerary-list-item">
            <div class="day">{{ value.sort }}</div>
            <div class="departure-time" v-if="value.departure_time">
                <div>预计</div>
                <div>出门</div>
                <div>时间</div>
                <div>{{ value.departure_time }}</div>
            </div>
            <div class="time">
                <ColoredDateText
                    :date="startTime + ((value.sort - 1) * 86400000)"
                    format="[ dddd ] MM / DD"
                />
            </div>
            <div class="tag">
                <div class="tag-item" v-for="tag in value.tag" :key="tag">{{ tag }}</div>
            </div>
            <div class="description" v-html="descriptionEncode(value.description)"></div>
        </div>
    </Card>
    <!-- 自定义按钮 -->
    <div v-else>
        <Button type="primary" round :to="`/schedule/${value.id}`" :key="value.id">{{ value.title }}</Button>
    </div>
</template>

<style lang="scss" scoped>
@import '../../../style';
.itinerary-list-item__card {
    overflow: initial;
}
.itinerary-list-item {
    padding: 1rem 1.2rem 1rem 3.6rem;
    line-height: 1.2;
    cursor: pointer;
    .day {
        position: absolute;
        top: -0.6rem;
        left: 0;
        transform: translateX(-50%);
        display: block;
        width: 4rem;
        height: 4rem;
        line-height: 4rem;
        text-align: center;
        border-radius: 50%;
        background-color: $c-white;
        color: $c-primary-font;
        font-weight: bold;
        font-size: 2rem;
        box-shadow: box-shadow(2);
    }
    .time {
        font-size: 1.4rem;
    }
    .departure-time {
        color: $c-pink;
        font-size: 1.4rem;
        float: right;
        overflow: hidden;
        > div {
            float: left;
            &:nth-of-type(4) {
                margin-left: 0.6em;
            }
        }
        @media screen and (max-width: 360px) {
            > div:nth-of-type(1) {
                display: none;
            }
        }
        @media screen and (max-width: 320px) {
            > div:nth-of-type(3) {
                display: none;
            }
        }
    }
    @media screen and (max-width: 300px) {
        .time {
            font-size: 1.2rem;
        }
        .departure-time {
            font-size: 1.2rem;
        }
    }
    .tag {
        overflow: hidden;
        margin-top: 1.2rem;
    }
    .tag-item {
        color: $c-primary-font;
        border: 1px $c-primary-font solid;
        padding: 0.6rem;
        font-size: 1.4rem;
        float: left;
        margin-bottom: 0.6rem;
        font-weight: bold;
    }
    .tag-item {
        margin-right: 1.2rem;
        &:last-of-type {
            margin-right: 0;
        }
    }
    .description {
        color: $c-666;
        font-size: 1.4rem;
        line-height: 1.5;
    }
}
</style>
