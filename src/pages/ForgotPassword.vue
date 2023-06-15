<template>
  <div class="content">
    <LogoSection class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-subtext">
          Fill your email to receive an recovery link
        </span>
      </div>

      <div class="input-container">
        <v-text-field
          v-model="email"
          clearable
          class="login-input"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="forgotPassword"
          :rules="[required]"
          :error-messages="emailErrors"
        ></v-text-field>
      </div>

      <v-btn
        @click="forgotPassword"
        class="login-button text-white"
        height="65"
        color="#3e78fc"
        rounded="lg"
        :loading="isLoading"
      >
        Send email
      </v-btn>

      <div class="signup-container">
        <span> Already have an account? </span>

        <span @click="switchLogin" class="link"> Login </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LogoSection from '@/components/LogoSection.vue'

import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'ForgotPasswordComponent',

  components: {
    LogoSection
  },

  data() {
    return {
      email: '',
      emailErrors: '',
      isLoading: false
    }
  },

  methods: {
    required(v: any) {
      return !!v || 'Field is required'
    },

    validateEmail(v: any) {
      const emailRegex = /\S+@\S+\.\S+/

      if (!emailRegex.test(v)) {
        this.emailErrors = 'Invalid email'

        return false
      }

      return true
    },

    verifyEmptyFields(): boolean {
      if (!this.email) {
        this.$toast.error('Please fill in the email field')

        return false
      }

      return true
    },

    verifyFields(): boolean {
      if (!this.verifyEmptyFields()) return false
      if (!this.validateEmail(this.email)) return false

      return true
    },

    switchLogin(): void {
      this.$router.push('/login')
    },

    switchForgotPassword(): void {
      this.$router.push('/forgot-password')
    },

    async forgotPassword() {
      try {
        if (!this.verifyFields()) return

        this.isLoading = true
        await this.$axios.post('/auth/forgot-password', {
          email: this.email
        })

        this.isLoading = false

        this.$toast.success(
          'If the email is valid, you will receive a link to recover your password',
          {
            duration: 5000
          }
        )

        this.$router.push('/login')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.isLoading = false

        this.$toast.error('Unexpected error, please try again later')
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

.greeting-subtext {
  font-size: 22px;
}

.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.login-input {
  width: 100%;
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
  src: url('@/assets/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
