<template>
  <div class="body">
    <div class="section left-section d-flex flex-column">Vazia</div>

    <div class="section right-section d-flex flex-column">
      <span class="text-h3"> Welcome to Cybersafe Academy! </span>

      <span class="text-h4"> Slogan here! </span>

      <v-text-field
        clearable
        label="Login"
        prepend-icon="mdi-account"
        variant="outlined"
      ></v-text-field>

      <v-text-field
        clearable
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        label="Password"
        prepend-icon="mdi-lock"
        @click:append="show1 = !show1"
        variant="outlined"
      ></v-text-field>

      <span @click="switchForgotPassword" class="link text-right"> Forgot password? </span>

      <v-btn @click="login" variant="tonal"> Login </v-btn>

      <div>
        <span class="signup-text"> Don't have an account? </span>

        <span @click="switchSignup" class="link"> Sign up </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    catTags: string[]
  }
}

export default defineComponent({
  data() {
    return {
      show1: false,
      password: '',
      rules: {
        required: (v: any) => !!v || 'Required.',
        min: (v: any) => v.length >= 8 || 'Min 8 characters'
      }
    }
  },

  computed: {},

  methods: {
    switchSignup(): void {
      console.log('Switching to signup')
    },

    switchForgotPassword(): void {
      console.log('Switching to forgot password')
    },

    async login() {
      console.log('Logging in')
      console.log(await this.$axios.get('https://www.google.com.br'))
    }
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
  padding: 0 10%;
}

.section {
  width: 50%;
}

.signup-text {
  font-size: 14px;
  color: #000000;
  font-weight: 400;
}

.link {
  font-size: 14px;
  color: #2600ff;
  font-weight: 700;
}

.link:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
