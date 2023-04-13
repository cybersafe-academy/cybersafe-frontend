import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/utils/routes'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Axios
import axios from './globals/plugins/axios'

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
app.use(axios, {
  baseUrl: 'https://jsonplaceholder.typicode.com'
})

app.mount('#app')
