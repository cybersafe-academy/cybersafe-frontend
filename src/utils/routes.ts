import * as VueRouter from 'vue-router'

import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import LandingPage from '@/pages/LandingPage.vue'

const routes: any = [
  { path: '/', component: LandingPage },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
