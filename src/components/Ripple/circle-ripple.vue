<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class CircleRipple extends Vue {
    @Prop()
    styles!: string
}
</script>

<template>
    <transition name="cmpt-ripple">
        <div class="cmpt-circle-ripple" :style="styles"></div>
    </transition>
</template>

<style lang="scss">
.cmpt-circle-ripple {
    position: absolute;
    pointer-events: none;
    user-select: none;
    background-clip: padding-box;
    opacity: 0.2;
    border-radius: 50%;
    background-color: #ffffff;
}

.cmpt-ripple-enter-active,
.cmpt-ripple-leave-active {
    -webkit-transition: opacity 1s cubic-bezier(0.23, 1, 0.32, 1),
        -webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        border-radius 1s cubic-bezier(0.8, 0, 0.8, 0.2);
    transition: opacity 1s cubic-bezier(0.23, 1, 0.32, 1),
        transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        border-radius 1s cubic-bezier(0.8, 0, 0.8, 0.2);
}

.cmpt-ripple-enter {
    -webkit-transform: scale3d(0, 0, 1);
    transform: scale3d(0, 0, 1);
}

.cmpt-ripple-leave-active {
    opacity: 0 !important;
}
</style>
