<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Icon from '@/components/Icon.vue'

@Component({
    components: {
        Icon
    }
})
export default class NoData extends Vue {}
</script>

<template>
    <div class="cmpt-nodata">
        <Icon class="cmpt-nodata__icon">&#xe603;</Icon>
        <div class="cmpt-nodata__text">这里空空如也</div>
    </div>
</template>

<style lang="scss">
@import '../style';

.cmpt-nodata {
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $c-ccc;
    &__icon {
        font-size: 4rem;
    }
    &__text {
        font-size: 1.4rem;
        margin: 0 0.6rem;
    }
}
</style>
