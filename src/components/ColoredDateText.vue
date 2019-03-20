<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { format } from '@/utils/date'
import Ripple from '@/components/Ripple/index'
interface IStrArray {
    type: string
    text: string
}
@Component({
    components: {
        Ripple
    }
})
export default class ColoredDateText extends Vue {
    @Prop({
        type: String,
        default: 'YYYY / MM / DD'
    })
    format!: string
    @Prop([Number, String, Date])
    date!: number | string | Date

    strArray: IStrArray[] = []

    created() {
        this.onChange()
    }
    @Watch('date')
    onChange() {
        const orginFormat = this.format
        let indexStart = 0
        let indexEnd = 0
        const result: any[] = []
        const formatString = this.format
            .replace(
                /[^Mo|Qo|Do|do|Wo|M|Q|D|d|E|W|Y|G|A|a|H|h|m|s|S|Z|X|x]/g,
                ' '
            )
            .replace(/\s\s+/g, ' ')
        const formatArr = formatString.split(' ')
        const dateArr = format(this.date, formatString).split(' ')
        formatArr.forEach((name, index) => {
            indexEnd = orginFormat.indexOf(name, indexStart)
            result.push(
                {
                    text: orginFormat.substring(indexStart, indexEnd),
                    type: 'decorate'
                },
                {
                    text: dateArr[index],
                    type: 'content'
                }
            )
            indexEnd = indexEnd + name.length
            indexStart = indexEnd
        })
        this.strArray = result
    }
}
</script>

<template>
    <span>
        <span
            v-for="(item, index) in strArray"
            :key="item.text + index"
            :class="[item.type === 'content' ? 'cmpt-colored-date__content' : 'cmpt-colored-date__decorate']"
        >{{ item.text }}</span>
    </span>
</template>

<style lang="scss">
@import '../style';

.cmpt-colored-date__decorate {
    color: $c-primary-font;
}
.cmpt-colored-date__content {
    color: $c-aaa;
}
</style>
