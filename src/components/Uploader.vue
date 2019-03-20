<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ossServer } from '@/config'
import { HttpRequest } from '@/api/http'
import SparkMD5 from 'spark-md5'
import * as api from '@/api'
import { ElLoadingComponent } from 'element-ui/types/loading'

const http = new HttpRequest({
    baseURL: ossServer.baseUrl,
    timeout: 10000
})

@Component({
    components: {}
})
export default class Uploader extends Vue {
    $refs!: {
        input: HTMLInputElement
    }
    @Prop()
    accept!: string

    loading?: ElLoadingComponent
    dragover = false
    setLoading(message?: string) {
        if (this.loading) {
            this.loading.close()
        }
        if (message) {
            this.loading = this.$loading({
                text: message
            })
        }
    }
    onChange(event: any) {
        if (!event || !event.target) {
            return
        }
        this.upload(event.target.files)
    }
    async upload(files: FileList) {
        if (!files) {
            return
        }
        try {
            this.setLoading('正在计算文件特征')
            const file = files[0]
            this.$refs.input.value = ''
            const suffix = this.getSuffix(file).toLowerCase()

            /* 检测文件类型 */
            const accept = this.accept
                ? this.accept
                      .split(',')
                      .map((type) => type.trim())
                      .filter((type) => type)
                      .find((type) => {
                          if (/\..+$/.test(type)) {
                              return type === `.${suffix}`
                          }
                          return type === suffix
                      })
                : true
            if (!accept) {
                throw new Error('文件类型不支持')
            }

            /* 获得hash 并检测文件大小 */
            const hash = await this.getHash(file)
            const fileName = `${hash}.${suffix}`

            /* 与服务器上的文件做对比 */
            this.setLoading('正在校验文件')
            await this.checkFile(fileName).then(async (has) => {
                if (has) {
                    /* 已存在 */
                    this.setLoading()
                    this.$emit('success', fileName)
                } else {
                    /* 不存在 */
                    this.setLoading('正在上传')
                    await this.uploadImage(file, fileName).then(() => {
                        this.setLoading()
                        this.$emit('success', fileName)
                    })
                }
            })
        } catch (e) {
            this.setLoading()
            this.$notify.error({
                title: '',
                message: e.message,
                duration: 0
            })
        }
    }
    getHash(file: File) {
        /* 获取文件hash（md5） */
        return new Promise<string>((reslove, reject) => {
            const blobSlice = File.prototype.slice
            const chunkSize = 2097152 // Read in chunks of 2MB
            const chunks = Math.ceil(file.size / chunkSize)
            const spark = new SparkMD5.ArrayBuffer()
            const fileReader = new FileReader()
            let currentChunk = 0

            fileReader.onload = (e: any) => {
                spark.append(e.target.result) // Append array buffer
                currentChunk++

                if (currentChunk < chunks) {
                    loadNext()
                } else {
                    reslove(spark.end()) // Compute hash
                }
            }

            fileReader.onerror = () => {
                reject(new Error('文件读取失败'))
            }

            function loadNext() {
                if (currentChunk > 1) {
                    reject(new Error('最大支持4M的文件'))
                }
                const start = currentChunk * chunkSize
                const end =
                    start + chunkSize >= file.size
                        ? file.size
                        : start + chunkSize

                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
            }

            loadNext()
        })
    }

    /*
     * 上传给服务器文件保存在同一个文件夹
     * 并以文件hash命名
     * 检查文件名`${hash}${suffix}`是否存在
     * 来判断服务器上是否已存在该文件
     * 若存在则 reslove(true) 反之则reslove(false)
     */
    checkFile(fileName: string) {
        return new Promise<boolean>((reslove, reject) => {
            const time = new Date().toUTCString()
            const message = `HEAD


${time}
x-oss-date:${time}
/${ossServer.bucket}/${ossServer.name}/${fileName}`

            /* 从自己服务器上获取签名 */
            api.oss.signature(message).then((signature) => {
                /* 询问oss是否存在这个文件 */
                /* header里的Authorization必须带引号 */
                http.head(`/tripnote/${fileName}`, {
                    headers: {
                        'X-OSS-Date': time,
                        'Authorization': `OSS ${ossServer.accessid}:${signature}`
                    }
                })
                    .then((e) => {
                        /* 文件已存在 */
                        reslove(true)
                    })
                    .catch((e) => {
                        /* 404属于期望请求，即文件不存在的情况 不属于错误范畴 */
                        e.status === 404 ? reslove(false) : reject(e)
                    })
            })
        })
    }

    getSuffix(file: File) {
        const name = file.name
        return name.substring(name.lastIndexOf('.') + 1, name.length)
    }
    uploadImage(file: File, fileName: string) {
        /* 失效时间 有效期8小时 */
        /* 格式标准为 ISO8601 GMT， 可通过Date.toJSON或Date.toISOString获得 */
        const time = new Date(new Date().getTime() + 28800000).toJSON()
        return new Promise((reslove, reject) => {
            const policyText = {
                expiration: time, // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
                conditions: [
                    ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
                ]
            }
            const policyBase64 = btoa(JSON.stringify(policyText))
            api.oss
                .signature(policyBase64)
                .then((signature) => {
                    const fd = new FormData()
                    fd.append('key', `${ossServer.name}/${fileName}`)
                    fd.append('policy', policyBase64)
                    fd.append('OSSAccessKeyId', ossServer.accessid)
                    fd.append('success_action_status', '200')
                    fd.append('signature', signature)
                    fd.append('file', file)
                    http.post('/', fd)
                        .then(() => reslove())
                        .catch((e) => reject(e))
                })
                .catch((e) => reject(e))
        })
    }
    onClick() {
        this.$refs.input.click()
    }
    onDrop(e: DragEvent) {
        this.dragover = false
        if (e && e.dataTransfer && e.dataTransfer.files) {
            this.upload(e.dataTransfer.files)
        }
    }
}
</script>

<template>
    <div
        class="cmpt-uploader"
        :class="{hover: dragover}"
        @click="onClick"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="onDrop"
    >
        <div class="cmpt-uploader__content">
            <slot></slot>
        </div>
        <input
            class="cmpt-uploader__input"
            ref="input"
            type="file"
            @change="onChange"
            :accept="accept"
        >
        <div class="cmpt-uploader__mask" v-show="dragover"></div>
    </div>
</template>

<style lang="scss">
@import '../style';

.cmpt-uploader {
    border: 0.24rem transparent dashed;
    &.hover {
        border-color: $c-primary;
    }
    &.hover &__content {
        filter: contrast(0.7) brightness(1.3);
    }
    &__input {
        display: none;
    }
}
</style>
