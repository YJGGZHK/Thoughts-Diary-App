import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/timeline',
        name: 'timeline',
        component: () => import('../components/TD-timeline.vue'),
    },
    {
        path: '/',
        name: 'calendar',
        component: () => import('../components/TD-Calendar-all.vue'),
    },
    {
        path: '/manage',
        name: 'manage',
        component: () => import('../components/TD-manage.vue'),
    },
    {
        path: '/countdownday',
        name: 'countdownday',
        component: () => import('../pages/TD-countdownday.vue'),
    },
    {
        path: '/diary',
        name: 'diary',
        component: () => import('../components/TD-Diary.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router