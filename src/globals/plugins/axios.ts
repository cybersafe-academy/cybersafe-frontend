import axios, { type InternalAxiosRequestConfig } from 'axios'
import dayjs from 'dayjs'
import type { AxiosError, AxiosInstance } from 'axios'
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

let baseURL: string

if (import.meta.env.VITE_API_ENV === 'local') {
  baseURL = import.meta.env.VITE_API_BACKEND_BASE_URL_LOCAL
} else {
  baseURL = import.meta.env.VITE_API_BACKEND_BASE_URL_PROD
}

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000
})

// Token interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    const tokenExpiration = localStorage.getItem('tokenExpiration')

    // Refresh ten minutes before expiration
    if (config.url != 'auth/refresh') {
      if (dayjs().isAfter(dayjs(tokenExpiration).subtract(15, 'minute'))) {
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && error.config?.url != '/auth/login') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('tokenExpiration')
      location.href = '/login'
    }
    return Promise.reject(error)
  }
)

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
