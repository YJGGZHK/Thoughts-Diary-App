<template>
    <div>
        <div class="countdownbox">
            <el-carousel :interval="5000" type="card" height="300px" indicator-position="outside">
                <el-carousel-item v-for="item in countdownday" :key="item.id">
                    <el-card class="countdown-card" shadow="always">
                        {{ item.content }}
                        <div class="countdown-day">
                            {{ getDays(item.endday) }}
                        </div>
                        结束日期：{{ item.endday }}
                    </el-card>
                </el-carousel-item>
            </el-carousel>
            <div class="title">
                <h3>倒数日</h3>

            </div>
        </div>
    </div>


</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useCountdowndaysStore } from "../store/countdowndaysStore";
const countdowndaysStore = useCountdowndaysStore();
const countdownday = ref([{
    id: 1,
    startday: '2024-10-01',
    endday: '2024-10-07',
    content: "距离国庆结束",
    type: "life",
    istop: true,
    ishow: true,
},
])
const getDays = (endday: string) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0); // 将开始时间设置为当天的午夜

    const end = new Date(endday);
    end.setHours(0, 0, 0, 0); // 将结束时间设置为当天的午夜

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    if (diff <= 0) {
        return '已结束';
    }

    return Math.floor(diff) + ' Days';
}
onMounted(async () => {
    await countdowndaysStore.fetchCountdowndaysbyistop(true);
    countdownday.value = countdowndaysStore.istop;


})


</script>

<style scoped>
.countdownbox {

    margin: 0 auto;
    margin-top: 100px;
    max-width: 1200px;
    min-width: 1000px;
}

.countdown-card {
    margin: 10px;
    height: 280px;
    text-align: center;
    font-size: large;
}

.countdown-day {
    font-size: 50px;
    height: 200px;
    line-height: 200px;
    text-align: center;

}

.el-carousel__item {

    opacity: 0.85;
    margin: 0;
    text-align: center;
    border-radius: 10px;
}



.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.title {
    text-align: center;
}
</style>