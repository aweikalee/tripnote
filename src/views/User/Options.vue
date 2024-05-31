<script lang="ts">
import { defineComponent } from 'vue'
import Body from '@/components/Body.vue'
import Label from '@/components/Label.vue'


export default defineComponent({
    components: {
        Body,
        Label,
    },
    data() {
        return {
            form: {
                type: ''
            },
        }
    },
    computed: {
        mapType: {
            get() {
                return this.$store.state.mapType
            },
            set(value) {
                this.$store.commit('setState', {
                    key: 'mapType',
                    value
                })
            }
        }
    
    }
})
</script>

<template>
    <Body padding>
        <Label title="导航地图" />
        <el-radio-group v-model="mapType" size="medium">
            <el-radio key="baidu" label="baidu" border>百度地图</el-radio>
            <el-radio key="google" label="google" border>谷歌地图</el-radio>
        </el-radio-group>
    </Body>
</template>

<style lang="scss" scoped></style>
