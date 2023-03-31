<template>
  <div class="content">
    <div class="section left-section">Vazia</div>

    <div class="section right-section">
      <span class="greeting-text"> Welcome to Cybersafe Academy! </span>

      <span class="greeting-subtext">
        Protect your company with the power of personalized knowledge in digital security
      </span>

      <div class="input-container">
        <v-text-field
          class="login-input"
          clearable
          label="Login"
          prepend-icon="mdi-account"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          class="password-input"
          clearable
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="outlined"
        ></v-text-field>
      </div>

      <span @click="switchForgotPassword" class="link forgot-password-text">
        Forgot password?
      </span>

      <v-btn @click="login" class="login-button" variant="tonal"> Login </v-btn>

      <div class="signup-container">
        <span> Don't have an account? </span>

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
      showPassword: false,
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
}

body {
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.content {
  display: flex;
  height: 100vh;
  width: 100vw;
  padding: 0 10%;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.left-section {
  background-color: #2600ff;
}

.right-section {
  background-color: #fa2121;
}

.greeting-text {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 10px;
}

.greeting-subtext {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
}

.input-container {
  width: 70%;
}

.login-input {
}

.password-input {
}

.forgot-password-text {
}

.login-button {
}

.signup-text-container {
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

@font-face {
  font-family: 'Inter';
  src: url('../public/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
