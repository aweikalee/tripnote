<script lang="ts">
import { defineComponent } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import { Loading } from 'element-ui'

const UPDATE_INTERVAL = 5 * 60 * 1000

export default defineComponent({
    name: 'PWAPrompt',
    mounted() {
        let loading: ReturnType<typeof Loading.service>
        let confirming = false

        const updateSW = registerSW({
            onRegistered(register) {
                if (register) {
                    async function update() {
                        try {
                            await register.update()
                        } finally {
                            setTimeout(update, UPDATE_INTERVAL)
                        }
                    }
                    setTimeout(update, UPDATE_INTERVAL)
                }

                loading?.close()
                loading = null
            },

            onNeedRefresh: async () => {
                if (confirming) return

                try {
                    confirming = true
                    const confirm = await this.$confirm(
                        '应用有新的更新，是否立即更新?',
                        '提示',
                        {
                            confirmButtonText: '更新',
                            cancelButtonText: '稍后',
                        }
                    ).catch(() => false)

                    if (confirm) {
                        loading = Loading.service({
                            lock: true,
                            text: '更新中',
                        })
                        await updateSW()
                    }
                } catch (error) {
                    this.$notify.error({
                        title: '',
                        message: `更新失败 ${error.message}`,
                        duration: 0,
                    })
                } finally {
                    confirming = false
                }
            },
        })
    },
})
</script>

<template></template>

<style></style>
