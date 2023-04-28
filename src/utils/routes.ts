import * as VueRouter from 'vue-router'

import LandingPage from '@/pages/LandingPage.vue'
import LoginComponent from '@/pages/Login.vue'
import SignupComponent from '@/pages/Signup.vue'
import HomeComponent from '@/pages/Home.vue'

const routes: any = [
  { path: '/', name: 'lading', component: LandingPage },
  { path: '/login', name: 'login', component: LoginComponent },
  { path: '/signup', name: 'signup', component: SignupComponent },
  { path: '/home', name: 'home', component: HomeComponent, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
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
