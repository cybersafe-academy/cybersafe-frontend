<template>
  <div class="content">
    <LogoSection class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-text"> Welcome to Cybersafe Academy! </span>

        <span class="greeting-subtext">
          Protect your company with the power of personalized in digital
          security
        </span>
      </div>

      <div class="input-container">
        <v-text-field
          v-model="cpf"
          clearable
          class="login-input"
          label="CPF"
          prepend-inner-icon="mdi-account"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="login"
          :rules="[required]"
        ></v-text-field>

        <v-text-field
          v-model="password"
          clearable
          class="password-input"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="login"
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
        :loading="isLoading"
      >
        Login
      </v-btn>

      <div class="signup-container">
        <span> First acess? </span>

        <span @click="switchFirstAccess" class="link"> Click here! </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LogoSection from '@/components/LogoSection.vue'

import type { ILogin, ILoginResponse } from '@/types/login'
import type { IUserData } from '@/types/user'
import type { IErrorResponse } from '@/types/errors'

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginComponent',

  components: {
    LogoSection
  },

  data() {
    return {
      cpf: '',
      password: '',
      showPassword: false,
      isLoading: false
    }
  },

  methods: {
    required(v: any) {
      return !!v || 'Field is required'
    },

    verifyEmptyFields(): boolean {
      if (!this.cpf || !this.password) {
        this.$toast.error('Please fill all fields')

        return true
      }

      return false
    },

    switchFirstAccess(): void {
      this.$router.push('/first-access')
    },

    switchForgotPassword(): void {
      this.$router.push('/forgot-password')
    },

    switchHome(): void {
      this.$router.push('/home')
    },

    async login() {
      const authStore = useAuthStore()

      try {
        if (this.verifyEmptyFields()) return

        const signinData: ILogin = {
          cpf: this.cpf,
          password: this.password
        }
        
        this.isLoading = true

        const { data: loginData } = await this.$axios.post<ILoginResponse>(
          '/auth/login',
          signinData
        )

        authStore.updateToken(loginData.accessToken, loginData.expiresIn)

        const { data: userData } = await this.$axios.get<IUserData>('/users/me')
        authStore.updateUserData(userData)

        this.isLoading = false
        this.$toast.success('Logged in successfully')

        this.switchHome()
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.isLoading = false
        this.$toast.error(error.description)
      }
    }
  }
}
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
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
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

  .right-section {
    width: 100%;
    padding: 0 5%;
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
  src: url('@/assets/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
