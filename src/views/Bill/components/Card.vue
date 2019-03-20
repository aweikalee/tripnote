<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Card from '@/components/Card.vue'
import Icon from '@/components/Icon.vue'
import { format } from '@/utils/date'
import { IBill, IConsumptionType } from '@/views'

@Component({
    components: {
        Card,
        Icon
    }
})
export default class BillCard extends Vue {
    @Getter getPayMode!: (name: string) => string
    @Getter getConsumptionType!: (name: string) => IConsumptionType
    @Getter getPartnerNickname!: (name: string) => IConsumptionType

    @Prop()
    value!: IBill
    @Prop({ type: Boolean, default: false })
    draft!: boolean
    getDate(timestamp: string | number) {
        return format(timestamp, 'MM-DD HH:mm')
    }
}
</script>

<template>
    <Card
        class="bill-card"
        :to="$store.state.loggedin ? `/bill/${value.pid}/${ draft ? 'draft' : 'detail'}/${value.id}` : ''"
    >
        <div class="bill-card__top">
            <div class="bill-card__cost">{{value.currency}} {{value.amount || 0}}</div>
            <div class="bill-card__date">{{ getDate(value.create_time) }}</div>
        </div>
        <div class="bill-card__bottom">
            <div class="bill-card__content">
                <div class="bill-card__detail bill-card__row">{{ value.detail }}</div>
                <div
                    class="bill-card__row"
                    v-if="value.participant && Array.isArray(value.participant)"
                >
                    <span class="bill-card__label">消费</span>
                    <span class="bill-card__partner" v-for="item in value.participant" :key="item">
                        {{ getPartnerNickname(item) }}
                        <Icon
                            class="bill-card__partner__icon"
                            v-if="value.balance.includes(item) || value.payer.includes(item)"
                        >&#xe615;</Icon>
                    </span>
                </div>
                <div class="bill-card__row" v-if="value.payer && Array.isArray(value.payer)">
                    <span class="bill-card__label">{{ getPayMode(value.pay_mode) }}</span>
                    <span
                        class="bill-card__partner"
                        v-for="item in value.payer"
                        :key="item"
                    >{{ getPartnerNickname(item) }}</span>
                </div>
            </div>
            <Icon
                class="bill-card__icon"
                :style="{backgroundColor: getConsumptionType(value.type).color}"
                :value="getConsumptionType(value.type).icon"
            />
        </div>
    </Card>
</template>

<style lang="scss" scoped>
@import '../../../style';

.bill-card {
    font-size: 14px;
    padding: 6px 12px;
    &__top {
        display: flex;
        justify-content: space-between;
    }

    &__bottom {
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__cost {
        color: $c-primary-font;
        font-weight: bold;
        font-size: 20px;
        padding-right: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 22px;
    }
    &__date {
        color: $c-pink;
        white-space: nowrap;
        line-height: 22px;
    }
    &__icon {
        flex-shrink: 0;
        font-size: 32px;
        background-color: $c-primary;
        color: $c-white;
        display: block;
        text-align: center;
        width: 48px;
        line-height: 48px;
        border-radius: 50%;
        margin: 6px 0 6px 12px;
    }
    &__content {
        color: $c-666;
        overflow: hidden;
    }
    &__detail {
        color: $c-666;
        margin-bottom: 6px;
    }
    &__row {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &__label {
        margin-right: 6px;
        color: $c-orange;
        font-weight: bold;
    }
    &__partner {
        color: $c-aaa;
        position: relative;
        margin-right: 5px;
        &__icon {
            font-size: 18px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: $c-primary-font;
            font-weight: bold;
        }
    }
}
</style>
