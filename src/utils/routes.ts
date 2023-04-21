import * as VueRouter from 'vue-router'

import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import LandingPage from '@/pages/LandingPage.vue'

const routes: any = [
  { path: '/', name: 'home', component: LandingPage },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

export default router
