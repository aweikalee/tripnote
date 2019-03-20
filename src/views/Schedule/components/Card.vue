<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Card from '@/components/Card.vue'
import Placeholder from '@/components/Placeholder.vue'
import ColoredDateText from '@/components/ColoredDateText.vue'
import Fold from '@/components/Fold.vue'
import Button from '@/components/Button.vue'
import IconButton from '@/components/IconButton.vue'
import Icon from '@/components/Icon.vue'
import Marked from '@/components/Marked.vue'
import CardAddress from './CardAddress.vue'
import { format } from '@/utils/date'
import { htmlEncode, breakEncode } from '@/utils/encode'
import { IDetail, IConsumptionType } from '@/views'

@Component({
    components: {
        Card,
        Placeholder,
        ColoredDateText,
        Fold,
        Button,
        IconButton,
        Icon,
        Marked,
        CardAddress
    }
})
export default class ScheduleCard extends Vue {
    @Getter getConsumptionType!: (name: string) => IConsumptionType
    @State detailSpread!: boolean
    @State loggedin!: boolean

    @Prop()
    value!: IDetail
    @Prop({ type: Boolean, default: false })
    drag!: boolean
    @Prop({ type: Boolean, default: false })
    placeholder!: boolean

    show = false
    markedShow = false

    toggleShow() {
        if (this.show) {
            this.show = false
        } else {
            this.markedShow = true
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
    @Watch('detailSpread')
    onDetailSpread() {
        if (!this.detailSpread) {
            this.show = false
        } else {
            this.markedShow = true
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
    descriptionEncode(text: string) {
        return breakEncode(htmlEncode(text))
    }

    mounted() {
        this.onDetailSpread()
    }
}
</script>

<template>
    <!-- 占位符 -->
    <Card class="schedule-list-item__card" v-if="placeholder">
        <div class="cost">
            <Placeholder :random="[8, 12]"/>
        </div>
        <div class="title">
            <Placeholder type="image" class="icon" style="vertical-align:middle"/>
            <Placeholder :random="[6, 16]"/>
        </div>
        <div class="description">
            <Placeholder :random="[30, 80]"/>
        </div>
        <div class="address">
            <div class="address-item">
                <Placeholder :random="[16, 30]"/>
            </div>
        </div>
        <div class="content">
            <div class="more">
                <Placeholder type="image" class="more__button"/>
            </div>
        </div>
    </Card>

    <!-- 列表卡片 -->
    <Card class="schedule-list-item__card" :class="{drag}" v-else>
        <div class="cost" v-if="value.amount">人均 {{ value.currency }} {{ value.amount }}</div>
        <div class="title">
            <Icon
                class="icon"
                :style="{backgroundColor: getConsumptionType(value.type).color}"
                :value="getConsumptionType(value.type).icon"
            />
            <Component
                :class="{title__link: loggedin}"
                :is="loggedin ? 'router-link' : 'span'"
                :to="`/detail/${value.id}/edit`"
                :title="loggedin ? '点击进入编辑页' : ''"
            >{{ value.title }}</Component>
        </div>
        <div
            class="description"
            v-if="value.description"
            v-html="descriptionEncode(value.description)"
        ></div>
        <CardAddress class="address" :value="value.position"/>
        <div class="content" v-if="value.content">
            <Fold v-model="show">
                <Marked v-model="value.content" v-if="markedShow"/>
            </Fold>
            <div class="toolbar">
                <Button
                    class="toolbar__more"
                    :class="{active: show}"
                    @click="toggleShow"
                    type="primary"
                    height="small"
                    round
                >{{ show ? '收起' : '展开' }}</Button>
            </div>
        </div>
    </Card>
</template>

<style lang="scss" scoped>
@import '../../../style';

.schedule-list-item__card {
    padding: 1.2rem;
    position: relative;
    overflow: initial;

    .icon {
        font-size: 2rem;
        background-color: $c-primary;
        color: $c-white;
        display: inline-block;
        text-align: center;
        width: 2.8rem;
        line-height: 2.8rem;
        height: 2.8rem;
        border-radius: 50%;
        margin-right: 0.6rem;
    }
    .title {
        color: $c-primary-font;
        font-size: 1.8rem;
        line-height: 2.8rem;
        &__link {
            color: $c-primary-font;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .cost {
        color: $c-pink;
        font-size: 1.4rem;
        float: right;
        line-height: 2.8rem;
        margin-left: 0.6rem;
    }
    .description {
        color: $c-666;
        font-size: 1.4rem;
        margin-top: 1.2rem;
    }
    .address {
        margin-top: 1.2rem;
    }
    .content {
        color: $c-666;
        font-size: 1.4rem;
        margin-top: 1.2rem;
    }
    .toolbar {
        position: sticky;
        bottom: 7rem;
        display: flex;
        flex-direction: row-reverse;
        &__more {
            width: 8rem;
            margin-left: 0.6rem;
            &.active {
                background-color: $c-ccc;
                opacity: 0.8;
            }
        }
    }
    &.drag {
        .address,
        .content {
            display: none;
        }
    }
}
</style>
