import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import type { IUserData } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: '',
    name: useLocalStorage('name', ''),
    email: useLocalStorage('email', ''),
    cpf: '',
    age: 0,
    token: useLocalStorage('token', '')
  }),

  getters: {
    isLogged: (state) => !!state.token
  },

  actions: {
    async updateToken(token: string) {
      this.token = token
    },
    async updateUserData(data: IUserData) {
      this.id = data.id
      this.name = data.name
      this.email = data.email
      this.cpf = data.cpf
      this.age = data.age
    },
    async logout() {
      this.token = ''
      this.name = ''
      this.email = ''
      this.cpf = ''
      this.age = 0
    }
  }
})
