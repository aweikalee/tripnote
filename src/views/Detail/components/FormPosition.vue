<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import TagEditor from '@/components/TagEditor'
import Field from '@/components/Field.vue'
import Label from '@/components/Label.vue'
import EditPopup from '@/components/EditPopup.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

@Component({
    components: {
        Field,
        Label,
        EditPopup,
        ErrorMessage,
    },
})
export default class ScheduleFormPositionEditor extends Mixins(TagEditor) {
    mounted() {
        const onPaste = (e: ClipboardEvent) => {
            if ((e.target as Element)?.tagName === 'INPUT') return

            const text = e.clipboardData.getData('text/plain').trim()

            if (/^\d+\,\d+$/.test(text)) {
                // 坐标
                const [x, y] = text.split(',').map((v) => Number(v))
                if (x && y) {
                    this.stage.x = x
                    this.stage.y = y
                }
                return
            }

            const arr = text.split('\n')

            const addressIndex = arr.findIndex((v) => v.startsWith('地址：'))
            const positionIndex = arr.findIndex((v) => v.startsWith('坐标：'))

            if (!addressIndex && !positionIndex) return

            if (~addressIndex) {
                this.stage.address = arr[addressIndex].replace('地址：', '')
            }

            if (~positionIndex) {
                const [x, y] = arr[positionIndex]
                    .replace('坐标：', '')
                    .split(',')
                    .map((v) => Number(v))
                if (x && y) {
                    this.stage.x = x
                    this.stage.y = y
                }
            }

            if (addressIndex !== 0 && positionIndex !== 0) {
                this.stage.title = arr[0]
            }
        }
        addEventListener('paste', onPaste)
        this.$once('hook:beforeDestroy', () => {
            removeEventListener('paste', onPaste)
        })
    }
}
</script>

<template>
    <EditPopup
        :value="true"
        @save="save"
        @remove="remove"
        @input="close"
        :remove="index !== -1"
    >
        <Label title="标题" description="在地图上显示的标签标题" />
        <ErrorMessage name="标题" :error-message="errors.first('标题')" />
        <Field
            v-model="stage.title"
            placeholder="30字以内"
            width="medium"
            :error="!!errors.first('标题')"
            name="标题"
            v-validate="'max:30'"
            data-vv-validate-on="blur"
        />

        <Label title="地址" description="详细地址" />
        <ErrorMessage name="地址" :error-message="errors.first('地址')" />
        <Field
            v-model="stage.address"
            placeholder="255字以内"
            :error="!!errors.first('地址')"
            name="地址"
            v-validate="'required|max:255'"
            data-vv-validate-on="blur"
        />

        <Label title="坐标" description>
            <template v-slot:description>
                以百度坐标为准
                <a
                    class="link"
                    href="https://api.map.baidu.com/lbsapi/getpoint/index.html"
                    target="blank"
                    >坐标拾取器</a
                >
            </template>
        </Label>
        <ErrorMessage name="经度" :error-message="errors.first('经度')" />
        <ErrorMessage name="纬度" :error-message="errors.first('纬度')" />
        <Field
            v-model.number="stage.x"
            placeholder="-180 ~ 180"
            type="number"
            width="small"
            :error="!!errors.first('经度')"
            name="经度"
            v-validate="{
                required: true,
                max: 10,
                decimal: true,
                max_value: 180,
                min_value: -180,
            }"
        >
            <template v-slot:prepend>
                <span class="label">经度</span>
            </template>
        </Field>
        <Field
            v-model.number="stage.y"
            placeholder="-90 ~ 90"
            type="number"
            width="small"
            :error="!!errors.first('纬度')"
            name="纬度"
            v-validate="{
                required: true,
                max: 10,
                decimal: true,
                max_value: 90,
                min_value: -90,
            }"
        >
            <template v-slot:prepend>
                <span class="label">纬度</span>
            </template>
        </Field>

        <div class="tips">
            未选中输入框时，可通过粘贴进行快速填充。
        </div>
    </EditPopup>
</template>

<style lang="scss" scoped>
@import '../../../style';

.link {
    color: $c-primary;
    &:hover {
        @include color-hover(color, $c-primary);
        text-decoration: underline;
    }
    &:active {
        @include color-active(color, $c-primary);
        text-decoration: underline;
    }
}
.label {
    padding: 0 1.2rem;
}

.tips {
    margin-top: 1.2rem;
    font-size: 1.2rem;
    color: $c-999;
}
</style>
