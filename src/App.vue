<template>
  <div class="content">
    <div class="section left-section">Vazia</div>

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-text"> Welcome to Cybersafe Academy! </span>

        <span class="greeting-subtext">
          Protect your company with the power of personalized in digital security
        </span>
      </div>

      <div class="input-container">
        <v-text-field
          clearable
          class="login-input"
          label="Login"
          prepend-inner-icon="mdi-account"
          variant="solo"
        ></v-text-field>

        <v-text-field
          clearable
          class="password-input"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="solo"
        ></v-text-field>
      </div>

      <span @click="switchForgotPassword" class="link forgot-password-text">
        Forgot password?
      </span>

      <v-btn @click="login" class="login-button" variant="tonal" height="65"> Login </v-btn>

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
  padding: 0 5%;
}

.greeting-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px;
}

.greeting-text {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 10px;
}

.greeting-subtext {
  font-size: 17px;
  margin-bottom: 25px;
}

.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.login-input {
  width: 100%;
}

.password-input {
  margin-bottom: -15px;
}

.forgot-password-text {
  align-self: flex-end;
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}

.signup-text-container {
}

.link {
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
