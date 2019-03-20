<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
    components: {}
})
export default class Tabbar extends Vue {}
</script>

<template>
    <div class="cmpt-tabbar">
        <slot></slot>
    </div>
</template>

<style lang="scss">
@import '../style';

.cmpt-tabbar {
    display: flex;
    background-color: $c-white;
}
</style>
