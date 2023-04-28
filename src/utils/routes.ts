import * as VueRouter from 'vue-router'

import Login from '@/pages/Login.vue'
import Signup from '@/pages/Signup.vue'
import LandingPage from '@/pages/LandingPage.vue'

const routes: any = [
  { path: '/', name: 'home', component: LandingPage, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
