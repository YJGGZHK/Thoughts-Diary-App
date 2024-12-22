import { defineStore } from 'pinia';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:1114';
//以下仅为示例，请根据实际情况修改
export const useThoughtsStore = defineStore('thoughts', {
    state: () => ({
        thoughts: [],
        form: {},
        updateform: {},
        count: 0,

    }),
    actions: {
        async fetchThoughts() {
            const response = await axios.get(`${API_BASE_URL} /thoughts`);
            this.thoughts = response.data.data.thoughts
            // console.log(JSON.stringify(response.data.data.thoughts));


        },
        async fetchThoughtsByDay(day: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/day/${day}`);
            this.thoughts = response.data.data.thoughts
            // console.log(JSON.stringify(response.data.data.thoughts));

        },
        async fetchThoughtsByid(id: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/${id}`);
            console.log(id);

            this.thoughts = response.data.data.thought
            // console.log(JSON.stringify(response.data.data.thought));
        },
        async updateThoughtsByid(id: string) {
            try {
                const response = await axios.put(`${API_BASE_URL}/thoughts/${id}`, this.updateform);

                console.log('更新成功:', response.data);
            } catch (error) {
                console.error('更新想法时出错:', error);
                throw error; // 重新抛出错误以便在调用处处理
            }
        },
        async addthought(thought: any) {
            try {
                const response = await axios.post(`${API_BASE_URL}/thoughts/add`, thought);
                console.log('添加成功:', response.data);
            } catch (error) {
                console.error('添加想法时出错:', error);
                throw error; // 重新抛出错误以便在调用处处理
            }
        },
        async orderbylevel(level: string, date: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/level/${level}/${date}`);
            this.thoughts = response.data.data.thoughts
            // console.log(JSON.stringify(response.data.data.thoughts));


        },
        async orderbystate(state: string, date: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/state/${state}/${date}`);
            this.thoughts = response.data.data.thoughts
            // console.log(JSON.stringify(response.data.data.thoughts));


        },
        async findactivethoughts(date: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/active/${date}`);
            this.thoughts = response.data.data.thoughts
            // console.log(JSON.stringify(response.data.data.thoughts));


        },
        async deletethoughtbyid(id: string) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/thoughts/delete/${id}`);
                console.log('删除成功:', response.data);
            } catch (error) {
                console.error('删除想法时出错:', error);

            }
        },

        async getthoughtsbydat(date: string) {
            const response = await axios.get(`${API_BASE_URL}/thoughts/active/count/${date}`);
            this.count = response.data.data.count
            // console.log(JSON.stringify(response.data.data.count));


        },
    },
});