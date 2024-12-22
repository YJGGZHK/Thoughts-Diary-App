import { defineStore } from 'pinia';
import axios from 'axios';
//以下仅为示例，请根据实际情况修改
const API_BASE_URL = 'http://localhost:1114';
export const useCountdowndaysStore = defineStore('countdowndays', {
    state: () => ({
        countdowndays: [],
        istop: [],
        form: {},
        updateform: {},
        count: 0,
        countdowndaysId: [],

    }),
    actions: {
        //获取所有数据
        async fetchCountdowndays() {
            const response = await axios.get(`${API_BASE_URL}/countdowndays`);
            this.countdowndays = response.data.data.countdowndays
            //console.log(JSON.stringify(response.data.data.countdowndays));


        },
        //通过id获取数据
        async fetchCountdowndaybyid(id: string) {
            const response = await axios.get(`${API_BASE_URL}/countdowndays/${id}`);
            this.countdowndaysId = response.data.data.countdowndays
            console.log(JSON.stringify(response.data.data.countdowndays));

        },
        //获取istop数据
        async fetchCountdowndaysbyistop(istop: boolean) {
            const response = await axios.get(`${API_BASE_URL}/countdowndays/istop/${istop}`);
            if (istop == true) {
                this.istop = response.data.data.countdowndays
            } else {
                this.countdowndays = response.data.data.countdowndays
            }

            // console.log(JSON.stringify(response.data.data.countdowndays));
        },
        //通过id删除数据
        async deleteCountdowndaybyid(id: string) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/countdowndays/delete/${id}`);
                console.log('删除成功:', response.data);
            } catch (error) {
                console.error('删除倒数日出错:', error);

            }
        },
        //更新updateCountdownday
        async updateCountdowndayByid(id: string) {
            try {
                const response = await axios.put(`${API_BASE_URL}/countdowndays/put/${id}`, this.updateform);

                console.log('更新成功:', response.data);
            } catch (error) {
                console.error('更新倒数日时出错:', error);
                throw error; // 重新抛出错误以便在调用处处理
            }
        },

        //添加倒数日
        async addCountdownday() {
            try {
                const response = await axios.post(`${API_BASE_URL}/countdowndays/add`, this.form);
                console.log('添加成功:', response.data);
            } catch (error) {
                console.error('添加倒数日时出错:', error);
                throw error; // 重新抛出错误
            }
        }



    }

});