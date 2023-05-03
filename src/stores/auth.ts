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
    accessToken: useLocalStorage('accessToken', '')
  }),

  getters: {
    isLogged: (state) => !!state.accessToken
  },

  actions: {
    async updateToken(accessToken: string) {
      this.accessToken = accessToken
    },
    async updateUserData(data: IUserData) {
      this.id = data.id
      this.name = data.name
      this.email = data.email
      this.cpf = data.cpf
      this.age = data.age
    },
    async logout() {
      this.accessToken = ''
      this.name = ''
      this.email = ''
      this.cpf = ''
      this.age = 0
    }
  }
})
