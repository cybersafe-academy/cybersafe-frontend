import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { App } from 'vue'

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
  baseURL: 'http://localhost:8080/api/'
})

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `${token}`
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
