<template>
    <div>

        <el-calendar ref="calendar" id="calendar" v-loading="loading" element-loading-text="Loading..."
            element-loading-background="rgba(122, 122, 122, 0.8)" v-model="mytoday">
            <template #header="{ date }">
                <span class="calendar-header-date">{{ date }}</span>
                <div class="calendar-header-button-group">
                    <el-button size="small" @click="selectDate('prev-year')" round color="lightblue">
                        前一年
                    </el-button>
                    <el-button size="small" @click="selectDate('prev-month')" round color="lightgreen">
                        前一个月
                    </el-button>
                    <el-button size="small" @click="selectDate('today')" round type="primary">今天</el-button>
                    <el-button size="small" @click="selectDate('next-month')" round color="lightgreen">
                        下一个月
                    </el-button>
                    <el-button size="small" @click="selectDate('next-year')" round color="lightblue">
                        下一年
                    </el-button>
                </div>
            </template>
            <template #date-cell="{ data }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split("-").slice(2).join("-") }}
                    {{ data.isSelected ? "✔️ " : "" }}
                </p>
                <div class="CLbox">
                    <div v-if="thoughtsCount[data.day]">
                        <el-button class="thoughtsbox" :icon="Tickets" type="primary" plain size="small"
                            @click="showDrawer(data.day)">
                            {{ thoughtsCount[data.day] || 0 }}
                        </el-button>
                    </div>
                    <div class="thoughtsbox" v-if="false">
                        <el-button class="thoughtsbox" :icon="Notebook" size="small">
                            {{ 0 }}
                        </el-button>
                    </div>
                </div>
                <!-- <div class="CLbox" v-if="thoughtsCount[data.day]">
                <el-tag size="small" type="danger" class="leveltag">3</el-tag>
                <el-tag size="small" type="warning" class="leveltag">2</el-tag>
                <el-tag size="small" type="success" class="leveltag">1</el-tag>
            </div> -->
            </template>
        </el-calendar>


        <el-drawer v-model="thoughtsdrawer" direction="btt" modal size="100%" :title="slectday"
            style="width: 60%; margin: 0 auto; min-width: 700px; background-color: #f5f5f5">

            <div class="drawer-content">
                <el-empty v-if="thoughts.length === 0" description="今日没有待办事项" />
                <el-card v-for="thought in thoughts" :key="thought.id"
                    style="min-width: 600px; width: 80%; min-height: 100px; margin-top: 20px; " shadow="hover">
                    <div v-if="thought.level === 3" class="status-point" style=" background-color:lightgreen" />
                    <div v-if="thought.level === 2" class="status-point" style=" background-color:orange" />
                    <div v-if="thought.level === 1" class="status-point" style=" background-color:red" />
                    <div>
                        <div class="cardbody">
                            <el-avatar style="background-color: burlywood">
                                {{ thought.name }}
                            </el-avatar>
                            <div style="max-width: 300px">
                                <el-text> {{ thought.text }}</el-text>
                            </div>
                            <div>
                                <el-button type="danger" :icon="Delete" circle
                                    @click="deletethoughtsbyid(thought.id.toString())" />
                            </div>
                        </div>
                    </div>

                    <div
                        style="display: flex; justify-content: space-between;     align-items: center; margin-top: 20px">
                        <div class="smalltag">{{ thought.startdate }}——{{ thought.enddate }}</div>

                        <div class="smalltag"> 状态：<el-tag type="primary">{{ stateMap[thought.state as keyof typeof
                            stateMap]
                                }}</el-tag></div>
                        <div class="smalltag">NO.{{ thought.id }}</div>
                    </div>
                </el-card>
            </div>
            <!-- <el-carousel height="400px" direction="vertical" type="card" :autoplay="false">
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 text="2xl" justify="center">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel> -->
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import { Notebook, Tickets, Delete, Edit } from "@element-plus/icons-vue";
import { useThoughtsStore } from "../store/thoughtsStore";
import { da } from "element-plus/es/locale";
const thoughtsStore = useThoughtsStore();
const thoughts = ref([
    {
        id: 1,
        startdate: "2024-02-20 12:00:00",
        enddate: "2024-02-20 13:00:00",
        name: "Tom",
        text: "This is a test thought",
        state: 1,
        type: "work",
        level: 2,
    },
]);

const calendar = ref<CalendarInstance>();
const thoughtsCount = ref<{ [key: string]: number }>({});
let thoughtsdrawer = ref(false);
const loading = ref(true);
const slectday = ref("");
const mytoday = ref(new Date()); // 今天的日期

const getthoughtscount = async (date: string) => {
    await thoughtsStore.getthoughtsbydat(date);
    thoughtsCount.value[date] = thoughtsStore.count; // 更新对应日期的思维数量
};
// 预加载thoughtsCounts
const preloadThoughtsCounts = async () => {

    loading.value = true;
    const today = mytoday.value;
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // 获取当前月份的第一天和最后一天
    const currentStart = new Date(currentYear, currentMonth, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 0);

    // 获取前一个月的最后一天
    const previousEnd = new Date(currentYear, currentMonth, 0);

    // 获取后一个月的第一天
    const nextStart = new Date(currentYear, currentMonth + 1, 1);

    // 计算前一个月的最后一个星期的日期
    const previousLastWeekStart = new Date(previousEnd);
    previousLastWeekStart.setDate(previousEnd.getDate() - previousEnd.getDay());

    // 计算后一个月的第一个星期的日期
    const nextFirstWeekEnd = new Date(nextStart);
    nextFirstWeekEnd.setDate(nextStart.getDate() + 6);

    // 加载前一个月的最后一个星期的数据
    for (
        let d = new Date(previousLastWeekStart);
        d <= previousEnd;
        d.setDate(d.getDate() + 1)
    ) {
        const dateString = d.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
        await getthoughtscount(dateString);
    }

    // 加载当前月份的数据
    for (let d = currentStart; d <= currentEnd; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
        await getthoughtscount(dateString);
    }

    // 加载后一个月的第一个星期的数据
    for (let d = nextStart; d <= nextFirstWeekEnd; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
        await getthoughtscount(dateString);
    }

    loading.value = false;
};
onMounted(() => {
    preloadThoughtsCounts();
});
const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return;
    calendar.value.selectDate(val);
    preloadThoughtsCounts();

};
async function deletethoughtsbyid(id: string) {
    try {
        await thoughtsStore.deletethoughtbyid(id);
        await thoughtsStore.findactivethoughts(slectday.value);
        preloadThoughtsCounts();
        console.log(calendar.value);

        // await thoughtsStore.findactivethoughts(calendar.value);
        thoughts.value = thoughtsStore.thoughts;
        ElMessage({
            message: "删除成功",
            type: "success",
        });
    } catch (error) {
        console.error("删除待办事项时出错:", error);
        ElMessage({
            message: "删除失败",
            type: "error",
        });
    }
}
async function showDrawer(day: any) {
    slectday.value = day;
    await thoughtsStore.findactivethoughts(day);
    thoughts.value = thoughtsStore.thoughts;
    thoughtsdrawer.value = true;
}


const stateMap = {
    1: "开始",
    2: "进行中",
    3: "结束",
};


</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

#calendar {
    min-width: 900px;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 50px;
    /* background-color: #ece6e6; */
    border-radius: 10px;
    border: 2px solid #ccc;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

#card {
    font-size: 10px;
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

#calendar :deep(.el-calendar-day) {
    min-height: 120px;
    max-height: 160px;
    transition: background-color 0.3s ease;
    /* 添加过渡效果 */
}

.calendar-header-date {
    height: 100px;
    font-size: 20px;
    /* 修改字体大小 */
    font-weight: bold;
    /* 加粗字体 */
    color: #333;
    /* 修改字体颜色 */
    margin-left: 100px;
    line-height: 100px;

    /* 添加右边距 */
}

.calendar-header-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

li {
    font-size: 10px;
    list-style: none;
    background-color: #f2eded;
    margin: 5px;
    width: 60%;
    border-radius: 2px;
    padding: 2px;
}

.everydaylistcard {
    background-color: #f2eded;
    margin-top: 5px;
    padding-left: 10px;
}

.thoughtsbox {
    width: 50px;
    text-align: left;

    font-size: small;
    overflow: hidden;
    border-radius: 5px;
}

.CLbox {
    margin-top: 5px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.leveltag {
    width: 20px;
}

.drawer-content {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    flex-direction: column;

    justify-content: flex-start;
    overflow: auto;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.cardbody {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cardfooter {
    position: relative;

    right: 5px;
    bottom: 0px;
    color: #999;
    font-size: smaller;
}

.carddate {
    position: relative;

    left: 5px;
    bottom: 0px;
    color: #999;
    font-size: smaller;
}

.smalltag {
    font-size: smaller;
    color: #cacaca;
}

.status-point {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;

}
</style>
