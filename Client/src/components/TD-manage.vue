<template>
    <div>
        <div class="container">
            <h1>设置日历总览页面展示的倒数日</h1>
            <div class="carbox">
                <div class="cads">
                    <el-card v-for="item in istop" :class="getRandomColorClass()" class="daycard" shadow="hover">
                        <template #header>{{ item.content }}</template>
                        <div class="cardbody">
                            {{ getDays(item.endday) }}

                        </div>
                        <div class="button-group">
                            <el-button icon="Delete" circle type="danger"
                                @click="deletecountdownday(item.id.toString())">
                            </el-button>
                            <el-button icon="Edit" circle @click="updatecountdownday(item.id.toString())">
                            </el-button>
                        </div>

                    </el-card>
                    <div class="daycard cadsmoni" v-for="n in 5" :key="n"></div>
                </div>

            </div>
            <div>
                <div class="headbox">
                    <h1>倒数日总览</h1>
                    <div>
                        <span style="font-size: small; font-weight: bold;">添加代办事项</span>
                        <el-button type="primary" @click="dialogFormVisible = true" circle style="margin-left: 10px">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-button>
                    </div>
                </div>

                <div class="carbox">
                    <div class="cads">
                        <el-card v-for="item in countdownday" :class="getRandomColorClass()" class="daycard"
                            shadow="hover">
                            <template #header>{{ item.content }}</template>
                            <div class="cardbody">
                                {{ getDays(item.endday) }}
                            </div>
                            <div class="button-group">
                                <el-button icon="Delete" circle type="danger"
                                    @click="deletecountdownday(item.id.toString())">
                                </el-button>
                                <el-button icon="Edit" circle @click="updatecountdownday(item.id.toString())">
                                </el-button>
                            </div>

                        </el-card>
                        <div class="daycard cadsmoni" v-for="n in 5" :key="n"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- // 添加待办事项对话框 -->
        <el-dialog v-model="dialogFormVisible" title="添加待办" width="500" align-center>
            <el-form :model="form">
                <el-form-item label="内容">
                    <el-input v-model="form.content" style="width: 100%" :rows="2" type="textarea"
                        placeholder="请输入倒数日内容" />
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="form.startday" type="datetime" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="form.endday" type="datetime" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="form.type" style="width: 100%" placeholder="请输入类型" />

                </el-form-item>
                <el-form-item label="是否在日历也展示">
                    <el-switch v-model="form.istop" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addthoughts()"> 提交 </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- // 修改待办事项对话框 -->
        <el-dialog v-model="updatedialogFormVisible" title="修改倒数日" width="500" align-center>
            <el-form :model="updateform">
                <el-form-item label="内容">
                    <el-input v-model="updateform.content" style="width: 100%" :rows="2" type="textarea"
                        placeholder="请输入倒数日内容" />
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="updateform.startday" type="datetime" placeholder="选择日期"
                        style="width: 100%;" />
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="updateform.endday" type="datetime" placeholder="选择日期"
                        style="width: 100%;" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="updateform.type" style="width: 100%" placeholder="请输入类型" />

                </el-form-item>
                <el-form-item label="是否在日历也展示">
                    <el-switch v-model="updateform.istop" />
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
<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { useCountdowndaysStore } from "../store/countdowndaysStore";
import { Check, Edit, Delete, TurnOff } from "@element-plus/icons-vue";
const countdowndaysStore = useCountdowndaysStore();


const countdowndaybyId = ref([{
    id: 1,
    startday: '2024-10-01',
    endday: '2024-10-07',
    content: "距离国庆结束",
    type: "life",
    istop: true,
    ishow: true,
},
])
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
const istop = ref([{
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
//随机背景颜色
const getRandomColorClass = () => {
    const colors = ['bg-color-1', 'bg-color-2', 'bg-color-3', 'bg-color-4', 'bg-color-5'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};
onMounted(async () => {
    await featchbyistop()
});
async function featchbyistop() {
    await countdowndaysStore.fetchCountdowndaysbyistop(false);
    countdownday.value = countdowndaysStore.countdowndays;
    await countdowndaysStore.fetchCountdowndaysbyistop(true);
    istop.value = countdowndaysStore.istop;

}
async function deletecountdownday(id: string) {
    await countdowndaysStore.deleteCountdowndaybyid(id);
    await featchbyistop()
    countdownday.value = countdowndaysStore.countdowndays;
}
const dialogFormVisible = ref(false);
const updatedialogFormVisible = ref(false);
const formLabelWidth = "140px";
// 表单相关
const form = ref({

    startday: "",
    endday: "",
    content: "",
    type: "",
    istop: false,
    ishow: true,
});
const updateform = ref({
    id: "",
    startday: "",
    endday: "",
    content: "",
    type: "",
    istop: false,
    ishow: true,
});
async function updatecountdownday(id: string) {
    try {
        // 调用接口获取待办事项的详细信息
        const countdowndayId = id; // 假设表单中有一个 id 字段
        await countdowndaysStore.fetchCountdowndaybyid(countdowndayId);
        countdowndaybyId.value = countdowndaysStore.countdowndaysId;
        const countdownday = countdowndaybyId.value; // 假设我们只取第一个待办事项
        updateform.value = {
            id: countdownday.id.toString(),
            startday: countdownday.startday.toString(),
            endday: countdownday.endday.toString(),
            content: countdownday.content,
            type: countdownday.type,
            istop: countdownday.istop,
            ishow: countdownday.ishow,
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
        countdowndaysStore.updateform = updateform.value;
        await countdowndaysStore.updateCountdowndayByid(id);
        await featchbyistop()

        // 提交成功后，关闭对话框
        updatedialogFormVisible.value = false;

        ElMessage({
            message: "更新成功",
            type: "success",
        });
    } catch (error) {
        console.error("更新倒数日时出错:", error);
        ElMessage({
            message: "更新倒数日失败",
            type: "error",
        });
    }

}
async function addthoughts() {
    try {
        countdowndaysStore.form = form.value;
        console.log(countdowndaysStore.form);

        await countdowndaysStore.addCountdownday();
        // 提交成功后，关闭对话框
        dialogFormVisible.value = false;
        // 清空表单
        form.value = {
            id: "",
            startday: "",
            endday: "",
            content: "",
            type: "",
            istop: false,
            ishow: true,

        };
        // 重新获取待办事项
        await featchbyistop()

    } catch (error) {
        console.error("添加倒数日时出错:", error);
        ElMessage({
            message: "添加倒数日失败",
            type: "error",
        });
    }
}


</script>

<style scoped>
.container {
    max-width: 1200px;
    min-width: 1000px;
    margin: 0 auto;

}

.cads {
    display: flex;
    /* align-items: center; */
    justify-content: space-around;
    flex-flow: wrap;



}

.daycard {
    margin: 15px;
    max-width: 200px;
    min-width: 200px;

}

.cadsmoni {
    height: 0;
    margin: 0 15px;
}

.carbox {
    width: 100%;
    background: #f6f1f1;
    border-radius: 10px;
    box-shadow: 0 6px 32px 0 rgba(185, 185, 233, 0.37);
}

.cardbody {
    height: 80px;
    font-size: larger;
    line-height: 80px;
    text-align: center;
    font-weight: bold;

}

/* 背景颜色 */
.bg-color-1 {
    background-color: #f8d7da;
    /* 例如：粉红色 */
}

.bg-color-2 {
    background-color: #d4edda;
    /* 例如：浅绿色 */
}

.bg-color-3 {
    background-color: #d1ecf1;
    /* 例如：浅蓝色 */
}

.bg-color-4 {
    background-color: #fff3cd;
    /* 例如：浅黄色 */
}

.bg-color-5 {
    background-color: #e2d8ed;
    /* 例如：浅紫色 */
}

.button-group {
    display: block;
    float: right;
    margin-bottom: 10px;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.daycard:hover .button-group {
    display: block;
    opacity: 1;

}

.headbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>