import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import dayjs from 'dayjs'

import type { IUserData } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: '',
    name: useLocalStorage('name', ''),
    email: useLocalStorage('email', ''),
    cpf: '',
    profilePictureURL: useLocalStorage('profilePictureURL', ''),
    age: 0,
    role: useLocalStorage('role', ''),
    accessToken: useLocalStorage('accessToken', ''),
    tokenExpiration: useLocalStorage('tokenExpiration', ''),
    companyID: useLocalStorage('companyID', '')
  }),

  getters: {
    isLogged: (state) => !!state.accessToken
  },

  actions: {
    async updateToken(accessToken: string, expiresIn: number) {
      this.accessToken = accessToken
      this.tokenExpiration = dayjs().add(expiresIn, 'second').toISOString()
    },
    async updateUserData(data: IUserData) {
      this.id = data.id
      this.name = data.name
      this.email = data.email
      this.cpf = data.cpf
      this.profilePictureURL = data.profilePictureURL
      this.age = data.age
      this.role = data.role
      this.companyID = data.company.id
    },
    async logout() {
      this.accessToken = ''
      this.tokenExpiration = ''
      this.name = ''
      this.email = ''
      this.cpf = ''
      this.profilePictureURL = ''
      this.age = 0
      this.role = ''
      this.companyID = ''
    }
  }
})
