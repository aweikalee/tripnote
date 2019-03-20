import { VueConstructor } from 'vue'
// import {
//     Checkbox,
//     CheckboxGroup,
//     DatePicker,
//     Dialog,
//     Loading,
//     Message,
//     MessageBox,
//     Notification,
//     Option,
//     Radio,
//     RadioGroup,
//     Select,
//     Switch,
//     TimeSelect
// } from 'element-ui'

// declare 'element-ui/packages/checkbox/'
/* tslint:disable */
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
import DatePicker from 'element-ui/lib/date-picker'
import Dialog from 'element-ui/lib/dialog'
import Dropdown from 'element-ui/lib/dropdown'
import DropdownItem from 'element-ui/lib/dropdown-item'
import DropdownMenu from 'element-ui/lib/dropdown-menu'
import Loading from 'element-ui/lib/loading'
import Message from 'element-ui/lib/message'
import MessageBox from 'element-ui/lib/message-box'
import Notification from 'element-ui/lib/notification'
import Option from 'element-ui/lib/option'
import Radio from 'element-ui/lib/radio'
import RadioGroup from 'element-ui/lib/radio-group'
import Select from 'element-ui/lib/select'
import Switch from 'element-ui/lib/switch'
import TimeSelect from 'element-ui/lib/time-select'
import './element.scss'

import { ElNotificationOptions } from 'element-ui/types/notification'

const components = [
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Dialog,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Loading,
    Option,
    Radio,
    RadioGroup,
    Select,
    Switch,
    TimeSelect
]

function mergeOptions(options: string | ElNotificationOptions) {
    let resultOptions: ElNotificationOptions
    if (typeof options === 'string') {
        resultOptions = {
            title: '',
            message: options
        }
    } else {
        resultOptions = options
    }
    const notifyDefaultOptions: ElNotificationOptions = {
        title: '',
        message: '',
        position: 'top-left'
    }
    return Object.assign(notifyDefaultOptions, resultOptions)
}
export class Notify {
    constructor(options: string | ElNotificationOptions) {
        return Notification(mergeOptions(options))
    }
    static success(options: string | ElNotificationOptions) {
        return Notification.success(mergeOptions(options))
    }
    static warning(options: string | ElNotificationOptions) {
        return Notification.warning(mergeOptions(options))
    }
    static info(options: string | ElNotificationOptions) {
        return Notification.info(mergeOptions(options))
    }
    static error(options: string | ElNotificationOptions) {
        return Notification.error(mergeOptions(options))
    }
}

export default {
    install(vue: VueConstructor) {
        components.forEach((component) => {
            vue.use(component)
        })
        vue.prototype.$msgbox = MessageBox
        vue.prototype.$alert = MessageBox.alert
        vue.prototype.$confirm = MessageBox.confirm
        vue.prototype.$prompt = MessageBox.prompt
        vue.prototype.$message = Message
        vue.prototype.$notify = Notify
    }
}
