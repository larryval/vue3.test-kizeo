import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import VHome from '../views/VHome.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'VHome',
    component: VHome
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
