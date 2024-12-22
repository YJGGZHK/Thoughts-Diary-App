<template>
    <div class="app">
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <component :is="Component" />
            </transition>
        </router-view>
        <TD-navigation-bar />
    </div>
</template>

<script lang="ts" setup>
import TDNavigationBar from './components/TD-navigation-bar.vue'
</script>

<style scoped>
.app {
    min-width: 700px;
    min-height: 800px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
