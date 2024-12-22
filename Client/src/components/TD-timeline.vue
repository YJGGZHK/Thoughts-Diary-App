<template>
    <div>
        <div class="timeline-header">
            <div class="timeline-header-text">
                今日待办事项
                <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" style="margin-left: 10px" />
                <el-button type="primary" @click="handleDateChange(selectedDate)" style="margin-left: 10px" plain>确定
                    <el-icon>
                        <Check />
                    </el-icon></el-button>
            </div>
        </div>
        <div class="timeline-control">
            <div style="margin-left: 20%">
                <span style="font-size: small; font-weight: bold; margin-right: 15px">筛选</span>
                <el-cascader v-model="selectOption" :options="options" @change="handleChange" clearable />
            </div>
            <div>
                <span style="font-size: small; font-weight: bold">添加代办事项</span>
                <el-button type="primary" @click="dialogFormVisible = true" circle style="margin-left: 10px">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
        </div>
        <el-divider>

        </el-divider>

        <h2 style="margin-left: 20%">{{ formatDate(selectedDate) }}</h2>
        <div class="timeline-container">
            <el-empty v-if="thoughts.length === 0" description="今日没有待办事项" />
            <el-timeline style="max-width: 1000px">
                <el-timeline-item v-for="thought in thoughts" :key="thought.id"
                    :timestamp="thought.startdate.slice(11, 19)" placement="top" :color="getColor(thought.level)">
                    <el-card shadow="hover" style="width: 600px; margin: 10px">
                        <template #header>
                            <div class="card-header">

                                <el-avatar style="background-color:burlywood;"> {{ thought.name }} </el-avatar>

                                <span>{{ thought.startdate.slice(5, 19) }}</span>
                                <span>
                                    <el-progress :text-inside="true" :stroke-width="16"
                                        :percentage=computedProgress(thought)
                                        :status=computedstatus(computedProgress(thought)) style="width: 300px">
                                        <span>剩余时间</span></el-progress></span>
                                <span>{{ thought.enddate.slice(5, 19) }}</span>
                                <!-- 修改 按钮 -->
                                <el-button type="primary" :icon="Edit" circle
                                    @click="updatethoughts(thought.id.toString())" />
                            </div>
                        </template>
                        <el-text line-clamp="4">{{ thought.text
                            }}</el-text>

                        <template #footer>
                            <div class="footer">

                                <div style="font-size: small; font-weight: 100;">NO.{{ thought.id }}</div>
                                <div> 状态：<el-tag type="primary">{{ stateMap[thought.state as keyof typeof stateMap]
                                        }}</el-tag></div>
                                <div>
                                    类型：
                                    <el-tag type="success">{{ thought.type }}</el-tag>
                                </div>


                                <div>
                                    <el-button type="danger" :icon="Delete" circle
                                        @click="deletethoughtsbyid(thought.id.toString())" />
                                </div>
                            </div>

                        </template>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <!-- // 添加待办事项对话框 -->
        <el-dialog v-model="dialogFormVisible" title="添加待办" width="500" align-center>
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="事件类型" :label-width="formLabelWidth">
                    <el-input v-model="form.type" autocomplete="off" />
                </el-form-item>
                <el-form-item label="事件等级" :label-width="formLabelWidth">
                    <el-select v-model="form.level" placeholder="选择事件等级">
                        <el-option label="低" value="3" />
                        <el-option label="中" value="2" />
                        <el-option label="高" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="事件状态" :label-width="formLabelWidth">
                    <el-select v-model="form.state" placeholder="选择事件状态">
                        <el-option label="开始" value="1" />
                        <el-option label="进行中" value="2" />
                        <el-option label="结束" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="事件内容" :label-width="formLabelWidth">
                    <el-input v-model="form.text" style="width: 100%" :rows="5" type="textarea" placeholder="输入待办内容" />
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.startdate" type="datetime" placeholder="选择开始时间"
                        :shortcuts="shortcuts" />
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.enddate" type="datetime" placeholder="选择结束时间"
                        :shortcuts="shortcuts" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addthoughts(form)"> 提交 </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- // 修改待办事项对话框 -->
        <el-dialog v-model="updatedialogFormVisible" title="修改待办" width="500" align-center>
            <el-form :model="updateform">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="updateform.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="事件类型" :label-width="formLabelWidth">
                    <el-input v-model="updateform.type" autocomplete="off" />
                </el-form-item>
                <el-form-item label="事件等级" :label-width="formLabelWidth">
                    <el-select v-model="updateform.level" placeholder="选择事件等级">
                        <el-option label="低" value="3" />
                        <el-option label="中" value="2" />
                        <el-option label="高" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="事件状态" :label-width="formLabelWidth">
                    <el-select v-model="updateform.state" placeholder="选择事件状态">
                        <el-option label="开始" value="1" />
                        <el-option label="进行中" value="2" />
                        <el-option label="结束" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="事件内容" :label-width="formLabelWidth">
                    <el-input v-model="updateform.text" style="width: 100%" :rows="5" type="textarea"
                        placeholder="输入待办内容" />
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="updateform.startdate" type="datetime" placeholder="选择开始时间"
                        :shortcuts="shortcuts" />
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth">
                    <el-date-picker v-model="updateform.enddate" type="datetime" placeholder="选择结束时间"
                        :shortcuts="shortcuts" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updatedialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitupdatethoughts(updateform.id)">保存</el-button>
                </div>
            </template>
        </el-dialog>
        <el-backtop :right="10" :bottom="150" />
    </div>
</template>

<script setup lang="ts">
import { useThoughtsStore } from "../store/thoughtsStore";

import { onMounted } from "vue";
import { ref } from "vue";
import { Check, Edit, Delete } from "@element-plus/icons-vue";
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
// 下拉菜单选项列表
let selectOption = ref(["level", "1"]);
const options = [
    {
        value: "level",
        label: "事件等级",
        children: [
            {
                value: "1",
                label: "高",
            },
            {
                value: "2",
                label: "中",
            },
            {
                value: "3",
                label: "低",
            },
        ],
    },
    {
        value: "state",
        label: "事件状态",
        children: [
            {
                value: "1",
                label: "开始",
            },
            {
                value: "2",
                label: "进行中",
            },
            {
                value: "3",
                label: "结束",
            },
        ],
    },
];
async function handleChange() {
    if (selectOption.value == null) {
        await thoughtsStore.findactivethoughts(selectedDate.value);
        thoughts.value = thoughtsStore.thoughts;

    }
    else if (selectOption.value[0] == "level") {
        await thoughtsStore.orderbylevel(selectOption.value[1], selectedDate.value);
        thoughts.value = thoughtsStore.thoughts;
    } else if (selectOption.value[0] == "state") {
        await thoughtsStore.orderbystate(selectOption.value[1], selectedDate.value);
        thoughts.value = thoughtsStore.thoughts;
    }
}

const selectedDate = ref(
    localStorage.getItem("selectedDate") || new Date().toLocaleDateString("en-CA")
);
// 加载数据
onMounted(async () => {
    await thoughtsStore.findactivethoughts(selectedDate.value);
    thoughts.value = thoughtsStore.thoughts;
});
const handleDateChange = async (date: string) => {
    if (date != localStorage.getItem("selectedDate") && date != null) {
        localStorage.setItem("selectedDate", date);
        await thoughtsStore.findactivethoughts(date);
        thoughts.value = thoughtsStore.thoughts;
    } else if (date == localStorage.getItem("selectedDate")) {
        ElMessage({
            message: "选择的日期与之前相同",
            type: "warning",
        });
        return;
    } else {
        ElMessage({
            message: "请选择日期",
            type: "error",
        });
        return;
    }
};
// 对话框相关
const dialogFormVisible = ref(false);
const formLabelWidth = "140px";
// 表单相关
const form = ref({
    name: "",
    level: "",
    state: "",
    text: "",
    type: "",
    startdate: "",
    enddate: "",
});
const updateform = ref({
    id: "",
    name: "",
    level: "",
    state: "",
    text: "",
    type: "",
    startdate: "",
    enddate: "",
});
//日期选择器快捷选项
const shortcuts = [
    {
        text: "今天",
        value: new Date(),
    },
    {
        text: "明天",
        value: () => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date;
        },
    },
    {
        text: "一星期以后",
        value: () => {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            return date;
        },
    },
];
//添加待办事项
async function addthoughts(form: any) {
    try {
        // 调用 thoughtsStore 中的 addthought 方法
        await thoughtsStore.addthought(form);
        // 提交成功后，关闭对话框
        dialogFormVisible.value = false;
        // 清空表单
        form.value = {
            name: "",
            level: "",
            state: "",
            text: "",
            type: "",
            startdate: "",
            enddate: "",
        };
        // 重新获取待办事项
        await thoughtsStore.findactivethoughts(selectedDate.value);
        thoughts.value = thoughtsStore.thoughts;
    } catch (error) {
        console.error("添加待办事项时出错:", error);
        ElMessage({
            message: "添加待办事项失败",
            type: "error",
        });
    }
}
//根据thought.level 显示不同颜色
function getColor(level: number) {
    switch (level) {
        case 1:
            return "red";
        case 2:
            return "orange";
        case 3:
            return "lightgreen";
    }
}
const stateMap = {
    1: "开始",
    2: "进行中",
    3: "结束",
};
// 计算进度条

function computedProgress(thought: any) {
    // 假设你有一个结束时间和开始时间，你需要计算当前时间与开始时间之间的差值
    // 然后除以总时间跨度来得到进度
    const now = new Date();
    const startTime = new Date(thought.startdate);
    const endTime = new Date(thought.enddate);
    const totalMinutes = (endTime - startTime) / (1000 * 60);
    const elapsedMinutes = (now - startTime) / (1000 * 60);

    // 确保进度不超过100%

    return Math.min(100, (elapsedMinutes / totalMinutes) * 100);
}
// 格式化日期
function formatDate(dateString: string) {
    // 创建一个新的Date对象
    var date = new Date(dateString);

    // 转换为普通日期格式
    var formattedDate = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return formattedDate; // 返回格式化的日期
}
function computedstatus(progress: number) {
    console.log(progress);

    if (progress < 50) {
        return 'success';
    } else if (progress >= 50 && progress < 80) {
        return 'warning';
    } else {
        return 'exception';
    }

}
async function deletethoughtsbyid(id: string) {
    try {
        await thoughtsStore.deletethoughtbyid(id);
        await thoughtsStore.findactivethoughts(selectedDate.value);
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
const updatedialogFormVisible = ref(false);
async function updatethoughts(id: string) {

    try {
        // 调用接口获取待办事项的详细信息
        const thoughtId = id; // 假设表单中有一个 id 字段
        await thoughtsStore.fetchThoughtsByid(thoughtId);
        if (thoughts.value && thoughts.value.length > 0) {
            const thought = thoughts.value[0]; // 假设我们只取第一个思维
            updateform.value = {
                id: thought.id.toString(),
                name: thought.name,
                level: thought.level.toString(),
                state: thought.state.toString(),
                text: thought.text,
                type: thought.type,
                startdate: thoughts.value[0].startdate,
                enddate: thoughts.value[0].enddate,
            };
        }


        // 显示对话框
        updatedialogFormVisible.value = true;
    } catch (error) {
        console.error("更新待办事项时出错:", error);
        ElMessage({
            message: "更新待办事项失败",
            type: "error",
        });
    }
}
async function submitupdatethoughts(id: string) {
    try {
        // 调用更新方法
        thoughtsStore.updateform = updateform.value;
        await thoughtsStore.updateThoughtsByid(id);


        // 提交成功后，关闭对话框
        updatedialogFormVisible.value = false;

        // 重新获取待办事项
        await thoughtsStore.findactivethoughts(selectedDate.value);
        thoughts.value = thoughtsStore.thoughts;

        ElMessage({
            message: "更新成功",
            type: "success",
        });
    } catch (error) {
        console.error("更新待办事项时出错:", error);
        ElMessage({
            message: "更新待办事项失败",
            type: "error",
        });
    }
}


</script>

<style scoped>
.timeline-container {
    margin: 0 auto;
    width: 100%;
    min-width: 600px;
    max-width: 1200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeline-header {
    margin: 0 auto;
    margin-top: 40px;
    width: 100%;
    min-width: 600px;
    max-width: 1200px;
    height: 100px;
    line-height: 100px;
}

.timeline-header-text {
    font-size: 20px;
    font-weight: 600;
    margin-left: 15%;
    margin-top: 10px;
}

.timeline-container-card {
    margin: 0 auto;
    width: 1000px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.timeline-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 10%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;


}

.card-header span {
    font-size: 12px;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

}
</style>
