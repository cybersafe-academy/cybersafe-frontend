import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Axios
import axios from './globals/plugins/axios'

// Vue - toast
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'

// Router
import router from '@/utils/routes'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(vuetify)
app.use(ToastPlugin)
app.use(axios, {
  baseUrl: 'http://localhost:8080/api/'
})
app.directive

app.mount('#app')
