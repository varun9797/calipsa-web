import { RouteRecordRaw } from 'vue-router';
import axios from 'axios';


async function guardMyroute(to: any, from: any, next: any) {
    try {
        const response = await axios.get(process.env.VUE_APP_SERVER_API + '/api/verify-token', {
            headers: {
                "authorization": localStorage.getItem("token")
          }
        });
        next();
    } catch (err: any) {
        next('/login');
    }
}


export const PublicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'init',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@/modules/Login/index.vue'),
    },
    {
        path: '/home',
        name: 'home',
        beforeEnter : guardMyroute,
        component: () => import(/* webpackChunkName: "home" */ '@/modules/Home/index.vue'),
    },
];
