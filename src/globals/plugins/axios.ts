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

export default {
  install: (app: App, options: AxiosOptions) => {
    app.config.globalProperties.$axios = axios.create({
      baseURL: options.baseUrl,
      headers: {
        Authorization: options.token ? `Bearer ${options.token}` : ''
      }
    })
  }
}
