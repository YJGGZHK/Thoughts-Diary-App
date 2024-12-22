<template>
    <div class="navigation-bar-hover-area" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <!-- 导航栏鼠标浮动判定区域 -->
    </div>
    <div class="navigation-bar" id="navigation-bar" :class="{ 'hidden': isHidden }">
        <!-- 导航栏内容 -->
        <router-link :to="{ name: 'calendar' }">
            <el-card class="navigation-bar-item hover-jump" id="navigation-bar-item-2" shadow="hover"
                @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <div class="icon-text-container">
                    <el-icon size="30">
                        <Calendar />
                    </el-icon>
                    <div class="navigation-bar-item-text">日历总览</div>
                </div>
            </el-card>
        </router-link>
        <router-link :to="{ name: 'timeline' }">
            <el-card class="navigation-bar-item hover-jump" id="navigation-bar-item-1" shadow="hover"
                @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <div class="icon-text-container">
                    <el-icon size="30">
                        <Memo />
                    </el-icon>
                    <div class="navigation-bar-item-text">今日任务</div>
                </div>
            </el-card>
        </router-link>

        <router-link :to="{ name: 'manage' }">
            <el-card class="navigation-bar-item hover-jump" id="navigation-bar-item-3" shadow="hover"
                @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <div class="icon-text-container">
                    <el-icon size="30">
                        <DocumentCopy />
                    </el-icon>
                    <div class="navigation-bar-item-text">倒数日设置</div>
                </div>
            </el-card>
        </router-link>
        <router-link :to="{ name: 'diary' }">
            <el-card class="navigation-bar-item hover-jump" id="navigation-bar-item-4" shadow="hover"
                @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <div class="icon-text-container">
                    <el-icon size="30">
                        <Notebook />
                    </el-icon>
                    <div class="navigation-bar-item-text">日记</div>
                </div>
            </el-card>
        </router-link>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted } from 'vue';

const isHidden = ref(false);
let lastScrollTop = 0;
let hideTimer: ReturnType<typeof setTimeout>;

const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    }
};

const handleScroll = debounce(() => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
        hideNavBar();
    } else {
        showNavBar();
    }
    lastScrollTop = st <= 0 ? 0 : st;
}, 200);

const hideNavBar = () => {
    isHidden.value = true;
    clearTimeout(hideTimer);
};

const showNavBar = () => {
    isHidden.value = false;
    resetHideTimer();
};

const resetHideTimer = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        isHidden.value = true;
    }, 3000);
};

const handleMouseEnter = () => {
    showNavBar();
    clearTimeout(hideTimer);
};

const handleMouseLeave = () => {
    resetHideTimer();
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    resetHideTimer();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(hideTimer);
});
</script>

<style scoped>
#navigation-bar {
    width: 90%;
    height: 100px;
    min-width: 600px;
    max-width: 1000px;
    background-color: rgba(255, 165, 165, 0.3);
    /* 降低不透明度 */
    backdrop-filter: blur(10px);
    /* 添加毛玻璃效果 */
    -webkit-backdrop-filter: blur(10px);
    /* 为 Safari 添加前缀 */
    position: fixed;
    bottom: 25px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 20px;
    z-index: 1000;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    /* 添加阴影 */
    transition: transform 0.3s ease;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

#navigation-bar-item-1 {
    background-color: #E8D3C5;
    /* 亮色莫兰迪1 */
}

#navigation-bar-item-2 {
    background-color: #C5E8D3;
    /* 亮色莫兰迪2 */
}

#navigation-bar-item-3 {
    background-color: #D3C5E8;
    /* 亮色莫兰迪3 */
}

#navigation-bar-item-4 {
    background-color: #E8C5D3;
    /* 亮色莫兰迪4 */
}

router-link {
    text-decoration: none;
    color: inherit;
}

router-link a {
    text-decoration: none;
    color: inherit;
}

a {
    text-decoration: none;
    color: inherit;
}


.navigation-bar-item {
    height: 80%;
    width: 100px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    /* 垂直排列图标和文字 */
    justify-content: center;
    /* 垂直居中 */
    align-items: center;
    /* 水平居中 */
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
}

.icon-text-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

}

.navigation-bar-item-text {
    font-size: 12px;
    margin-top: 5px;
    color: #666464;
    /* 确保文字容器宽度为100% */
}

.hidden {
    transform: translateY(70%);
}

.navigation-bar-hover-area {
    width: 90%;
    height: 125px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 1000;
}

.hover-jump {
    transition: transform 0.3s ease;
    z-index: 1001;
}

.hover-jump:hover {
    transform: translateY(-20px);
}
</style>