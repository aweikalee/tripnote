<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Body from '@/components/Body.vue'
import NoData from '@/components/NoData.vue'
@Component({
    components: {
        Body,
        NoData,
    }
})
export default class NotFound extends Vue {}
</script>

<template>
    <Body>
        <NoData class="notfound"/>
    </Body>
</template>

<style lang="scss" scoped>
@import '../../style';

.notfound {
    height: calc(100vh - 5.7rem);
}
</style>
