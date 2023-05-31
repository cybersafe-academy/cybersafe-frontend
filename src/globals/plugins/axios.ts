import axios, { type InternalAxiosRequestConfig } from 'axios'
import dayjs from 'dayjs'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'

import type { ILoginResponse } from '@/types/login'

interface AxiosOptions {
  baseUrl?: string
  token?: string
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    catTags: string[]
  }
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 15000
})

// Token interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    // Refresh ten minutes before expiration
    if (config.url != 'auth/refresh') {
      if (dayjs().isAfter(dayjs(tokenExpiration).subtract(10, 'minute'))) {
        try {
          const { data } = await api.post<ILoginResponse>('auth/refresh')

          localStorage.setItem('accessToken', data.accessToken)

          const newTokenExpiration = dayjs()
            .add(data.expiresIn, 'second')
            .toISOString()
          localStorage.setItem('tokenExpiration', newTokenExpiration)
        } catch (e: any) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('tokenExpiration')
        }
      }
    }

    config.headers.Authorization = `${accessToken}`
  }

  return config
})

export default {
  install: (app: App, options: AxiosOptions) => {
    if (options.baseUrl) {
      api.defaults.baseURL = options.baseUrl
    }
    if (options.token) {
      api.defaults.headers.common.Authorization = options.token
    }

    app.config.globalProperties.$axios = api
  }
}
