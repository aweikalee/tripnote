<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import monaco from './monaco'
import Field from '@/components/Field.vue'
import Button from '@/components/Button.vue'
import Ripple from '@/components/Ripple'
import Icon from '@/components/Icon.vue'
import IconButton from '@/components/IconButton.vue'
import Uplodaer from '@/components/Uploader.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import Marked from '@/components/Marked.vue'

let instance: monaco.editor.IStandaloneCodeEditor
@Component({
    components: {
        Field,
        Button,
        Ripple,
        Icon,
        IconButton,
        Uplodaer,
        HeaderBar,
        Marked
    }
})
export default class Editor extends Vue {
    $refs!: {
        editor: HTMLElement
        resize: HTMLObjectElement
        imageInput: HTMLInputElement
        iconScroll: HTMLElement
    }
    @Prop()
    value!: string
    @Prop({ type: Boolean, default: true })
    show!: boolean

    isEditting = false
    showUpload = false
    showPreview = false
    previewValue = ''
    previewNeddUpdate = true
    scroll = true
    imageUrl = ''

    iconbar = [
        {
            title: '加粗',
            icon: '&#xe617;',
            event: this.strong
        },
        {
            title: '斜体',
            icon: '&#xec85;',
            event: this.italic
        },
        {
            title: '删除线',
            icon: '&#xe729;',
            event: this.strikethrough
        },
        {
            title: '标题',
            icon: '&#xe65a;',
            event: this.heading
        },
        {
            title: '引用',
            icon: '&#xe61e;',
            event: this.quote
        },
        {
            title: '代码块',
            icon: '&#xe623;',
            event: this.code
        },
        {
            title: '超链接',
            icon: '&#xe65b;',
            event: this.link
        },
        {
            title: '图片',
            icon: '&#xe707;',
            event: this.openUpload
        },
        {
            title: '表格',
            icon: '&#xe630;',
            event: this.table
        },
        {
            title: '分割线',
            icon: '&#xec7f;',
            event: this.horizrule
        }
    ]

    @Watch('value')
    onChange(val: string) {
        this.previewNeddUpdate = true
        if (this.isEditting) {
            this.isEditting = false
        } else {
            instance.setValue(val)
        }
    }
    @Watch('show')
    onResize() {
        this.$nextTick(() => {
            instance.layout()
            instance.focus()
        })
    }
    mounted() {
        instance = monaco.editor.create(this.$refs.editor, {
            value: this.value || '',
            language: 'awk-markdown',
            theme: 'awk',
            fontSize: 16,
            contextmenu: false,
            // formatOnPaste: true, // 粘贴时是否启用格式
            // copyWithSyntaxHighlighting: false, // 复制时是否启用格式
            // ariaLabel: 'asdasd',
            lineNumbersMinChars: 1, // 行序号 最小宽度
            // glyphMargin: false,
            // fixedOverflowWidgets: true,
            mouseWheelZoom: true, // 滚动缩放
            scrollBeyondLastLine: false, // 页面底部留出一屏的空
            // scrollBeyondLastColumn: 1, // 页面右侧留出指定数量的字符宽
            smoothScrolling: true, // 平滑滚动
            wordWrap: 'bounded',
            wordWrapColumn: 140,
            accessibilitySupport: 'off',
            quickSuggestions: false,
            autoClosingBrackets: 'never', // 自动括号
            // folding: true, // 代码折叠
            dragAndDrop: true, // 拖拽文本
            colorDecorators: true
        })
        instance.getModel()!.onDidChangeContent((e) => {
            this.isEditting = true
            this.$emit('input', instance.getModel()!.getValue())
        })
        this.bindResize()
    }
    bindResize() {
        if (
            this.$refs.resize &&
            this.$refs.resize.contentDocument &&
            this.$refs.resize.contentDocument.defaultView
        ) {
            this.$refs.resize.contentDocument.defaultView.addEventListener(
                'resize',
                this.onResize
            )
        } else {
            setTimeout(() => {
                this.bindResize()
            }, 100)
        }
    }
    destroyed() {
        if (
            this.$refs.resize &&
            this.$refs.resize.contentDocument &&
            this.$refs.resize.contentDocument.defaultView
        ) {
            this.$refs.resize.contentDocument.defaultView.removeEventListener(
                'resize',
                this.onResize
            )
        }
        if (!this.scroll) {
            this.stopBodyScroll()
        }
    }
    setValue(text: string) {
        instance.setValue(text)
    }
    getText(range?: monaco.Selection | null): string | void {
        const textModel = instance.getModel()
        if (textModel && range) {
            return textModel.getValueInRange(range)
        }
        return
    }
    setText(text: string, range?: monaco.Selection | null): string | void {
        const textModel = instance.getModel()
        if (textModel && range) {
            textModel.applyEdits([
                {
                    range: new monaco.Range(
                        range.startLineNumber,
                        range.startColumn,
                        range.endLineNumber,
                        range.endColumn
                    ),
                    text
                }
            ])
        }
        instance.focus()
    }
    /**
     * 字符串修饰
     */
    toggleSurrounding(
        {
            text,
            template,
            regexp
        }: {
            text: string
            template: string
            regexp: string | RegExp
        } = {
            text: '',
            template: '',
            regexp: '$1'
        }
    ) {
        const selection = instance.getSelection()
        let result = this.getText(selection) || ''
        const reg = regexp instanceof RegExp ? regexp : new RegExp(regexp)

        if (reg.test(result)) {
            // 取消标记
            result = result.replace(reg, '$1')
        } else {
            // 添加标记
            result = template.replace('$1', result || text)
        }

        this.setText(result, selection)
    }
    /**
     * 行修饰
     */
    toggleLine(
        {
            text,
            template,
            regexp
        }: {
            text: string
            template: string
            regexp: string | RegExp
        } = {
            text: '',
            template: '',
            regexp: '$1'
        }
    ) {
        const selection = this.getSelectedLinesSelection()
        let result = this.getSelectedLines(selection)
        const reg = regexp instanceof RegExp ? regexp : new RegExp(regexp)

        if (
            result.find((item) => {
                return reg.test(item)
            })
        ) {
            // 取消标记
            result = result.map((item) => {
                return item.replace(reg, '$1')
            })
        } else {
            // 添加标记
            result = result.map((item) => {
                return template.replace('$1', item || text)
            })
        }

        this.setText(result.join('\n'), selection)
    }
    getSelectedLines(selection: monaco.Selection | null) {
        const textModel = instance.getModel()
        const result = []
        if (textModel && selection) {
            const start = selection.startLineNumber
            const end = selection.endLineNumber
            for (let i = start; i <= end; i += 1) {
                result.push(textModel.getLineContent(i))
            }
        }
        return result
    }
    getSelectedLinesSelection() {
        let selection = instance.getSelection()
        if (!selection) {
            return null
        }

        const textModel = instance.getModel()
        selection = selection.setStartPosition(selection.startLineNumber, 0)
        if (textModel) {
            selection = selection.setEndPosition(
                selection.endLineNumber,
                textModel.getLineLength(selection.endLineNumber) + 1
            )
        }
        return selection
    }
    strong() {
        /*
         名字：粗体
         类型：选中文字，toggle
         符号：**$0**
        */
        this.toggleSurrounding({
            text: '粗体',
            template: '**$1**',
            regexp: /^\*\*([\s\S]+)\*\*$/
        })
    }
    italic() {
        /*
         名字：斜体
         类型：选中文字，toggle
         符号：*$0*
        */
        this.toggleSurrounding({
            text: '斜体',
            template: '*$1*',
            regexp: /^\*([\s\S]+)\*$/
        })
    }
    strikethrough() {
        /*
         名字：删除线
         类型：选中文字，toggle
         符号：*$0*
        */
        this.toggleSurrounding({
            text: '删除线',
            template: '~~$1~~',
            regexp: /^~~([\s\S]+)~~$/
        })
    }
    heading() {
        /*
         名字：标题
         类型：选中文字，toggle
         符号：### $0
        */
        this.toggleLine({
            text: '标题',
            template: '## $1',
            regexp: /^#{1,6}\s([\s\S]+)$/
        })
    }
    quote() {
        /*
         名字：引用块
         类型：选中的行，toggle
         符号：> $0
        */
        this.toggleLine({
            text: '引用',
            template: '> $1',
            regexp: /^>\s([\s\S]+)$/
        })
    }
    code() {
        /*
         名字：链接
         类型：选中的行，toggle
         符号：tab $0
        */
        this.toggleLine({
            text: '代码',
            template: '    $1',
            regexp: /^\s{4,4}([\s\S]+)$/
        })
    }
    link() {
        /*
         名字：链接
         类型：替换文本
         符号：[展示文字](链接地址)
        */
        this.toggleSurrounding({
            text: '',
            template: '[展示文字](链接地址)',
            regexp: /^([^\s\S])$/
        })
    }
    image(filename?: string) {
        /*
         名字：图片
         类型：替换文本
         符号：![图注](图片地址)
        */
        this.toggleSurrounding({
            text: '',
            template: filename ? `![](${filename})` : `![图注](图片地址)`,
            regexp: /^([^\s\S])$/
        })
    }
    horizrule() {
        /*
         名字：分割线
         类型：替换行
         符号：--------
        */
        this.toggleSurrounding({
            text: '',
            template: '\n--------',
            regexp: /^([^\s\S])$/
        })
    }
    table() {
        /*
         名字：分割线
         类型：替换行
         符号：
            |标签|标签|
            |--:|---|
            |   |   |
            |   |   |
        */
        this.toggleSurrounding({
            text: '',
            template: '\n|标签|标签|\n|--:|---|\n|   |   |\n|   |   |',
            regexp: /^([^\s\S])$/
        })
    }
    openUpload() {
        this.showUpload = !this.showUpload
        if (this.showUpload) {
            this.$nextTick(() => {
                this.$refs.imageInput.focus()
            })
        }
    }
    uploadImageEnd(filename: string) {
        this.showUpload = false
        this.image(filename)
    }
    stopBodyScroll() {
        /* 停止页面滚动 */
        if (this.scroll) {
            document.body.classList.add('cmpt-editor--hidden')
        } else {
            document.body.classList.remove('cmpt-editor--hidden')
        }
        this.scroll = !this.scroll
    }
    mousewheelHandler(e: MouseWheelEvent) {
        this.$refs.iconScroll.scrollLeft += e.deltaY
    }
    toggleShowPreview() {
        this.showPreview = !this.showPreview
        if (this.showPreview && this.previewNeddUpdate) {
            this.previewValue = this.value
            this.previewNeddUpdate = false
        }
    }
}
</script>

<template>
    <div class="cmpt-editor__wrapper">
        <HeaderBar box-class="cmpt-editor__bar">
            <template v-slot:icon>
                <div class="cmpt-editor__icon">
                    <div
                        class="cmpt-editor__icon__left"
                        ref="iconScroll"
                        @mousewheel.capture.prevent.stop="mousewheelHandler"
                    >
                        <IconButton
                            v-for="item in iconbar"
                            :key="item.icon"
                            class="icon"
                            :title="item.title"
                            @click="item.event"
                            :text="item.icon"
                        ></IconButton>
                    </div>
                    <div class="cmpt-editor__icon__right">
                        <IconButton
                            class="icon"
                            @click="toggleShowPreview"
                            title="预览"
                        >&#xec86;</IconButton>
                        <IconButton
                            class="icon lock"
                            @click="stopBodyScroll"
                            title="锁定页面滚动"
                        >{{ scroll ? '&#xe61a;' : '&#xe61b;' }}</IconButton>
                    </div>
                </div>
            </template>
        </HeaderBar>

        <div class="cmpt-editor" ref="editor" v-show="show"></div>

        <object class="cmpt-editor__resize" ref="resize" data="about:blank" type="text/html"></object>

        <el-dialog :visible.sync="showUpload">
            <Field
                ref="imageInput"
                placeholder="请输入图片的url地址"
                v-model="imageUrl"
                @keypress.enter="uploadImageEnd(imageUrl)"
            >
                <template v-slot:append>
                    <Button
                        type="primary"
                        style="width:6rem"
                        height="medium"
                        @click.native="uploadImageEnd(imageUrl)"
                    >确定</Button>
                </template>
            </Field>
            <Uplodaer
                class="cmpt-editor__upload"
                @success="uploadImageEnd"
                accept=".jpg, .png, .gif, .jpeg"
            >
                <Ripple>
                    <Icon class="icon">&#xe613;</Icon>
                    <div class="cmpt-editor__upload__text">上传图片 支持.jpg, .png, .gif</div>
                </Ripple>
            </Uplodaer>
        </el-dialog>

        <el-dialog title="预览" :visible.sync="showPreview">
            <Marked :value="previewValue"/>
        </el-dialog>
    </div>
</template>

<style lang="scss">
@import '../../style.scss';

.cmpt-editor {
    width: 100%;
    height: calc(100% - 5.7rem);
    margin-top: 1.2rem;
    &__wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: $c-f5;
    }
    &__bar {
        z-index: 3;
        position: sticky;
        top: 0;
        background-color: $c-f5;
        margin: 0;
        & .cmpt-headerbar__icon {
            width: 100%;
            flex-basis: 100%;
            flex-shrink: 1;
        }
    }
    &__resize {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        visibility: hidden;
        z-index: -99999;
    }
    &__icon {
        display: flex;
        justify-content: space-between;
        width: 100%;
        &__left {
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            flex-shrink: 1;
            @include touch-scrolling();
            &::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            &::-webkit-scrollbar-track {
                background-color: transparent;
                @include add-hover-active(background-color, $c-f0);
            }
            &::-webkit-scrollbar-thumb {
                background-color: $c-eee;
                border-radius: 5px;
                @include add-hover-active(background-color, $c-ccc);
            }
        }
        &__right {
            flex-shrink: 0;
        }
        .lock {
        }
        .icon {
            font-size: 2rem;
        }
    }
    &__upload {
        border: 1px $c-ccc dashed;
        text-align: center;
        margin-top: 1.2rem;
        cursor: pointer;
        &:hover {
            @include color-hover(background-color, $c-f5);
        }
        .icon {
            font-size: 10rem;
            color: $c-primary;
        }
        &__text {
            position: absolute;
            right: 1.2rem;
            bottom: 1.2rem;
            color: $c-ccc;
        }
    }
    &--hidden {
        overflow: hidden;
    }
}
</style>
