<template>
  <div class="content">
    <div class="section left-section">
      <img class="logo-image" src="src/assets/test.svg" />
    </div>

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
          bg-color="#f5f7f9"
          :rules="[required]"
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
          bg-color="#f5f7f9"
          :rules="[required]"
        ></v-text-field>
      </div>

      <span @click="switchForgotPassword" class="link forgot-password-text">
        Forgot password?
      </span>

      <v-btn
        @click="login"
        class="login-button text-white"
        height="65"
        color="#3e78fc"
        rounded="lg"
      >
        Login
      </v-btn>

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
    required(v: any) {
      return !!v || 'Field is required'
    },

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
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
}

.left-section {
  width: 40%;
  background-color: rgb(241, 241, 241);
  border-radius: 25px 0 0 25px;
}

.logo-image {
  height: 400px;
  border-radius: 30px;
}

.right-section {
  width: 60%;
  padding: 0 10%;
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
  margin-bottom: 40px;
}

.login-button {
  width: 100%;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 700;
}

.link {
  color: #2600ff;
  font-weight: 700;
}

.link:hover {
  cursor: pointer;
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .content {
    flex-direction: column;
  }

  .section {
    width: 100%;
  }

  .left-section {
    width: 100%;
    border-radius: 0;
    background-color: white;
  }

  .right-section {
    width: 100%;
    padding: 0 5%;
  }

  .logo-image {
    height: 300px;
  }

  .greeting-text {
    font-size: 24px;
  }

  .greeting-subtext {
    font-size: 14px;
  }

  .login-button {
    font-size: 14px;
  }
}

@font-face {
  font-family: 'Inter';
  src: url('../public/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
