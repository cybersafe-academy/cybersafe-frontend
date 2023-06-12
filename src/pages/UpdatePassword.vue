<template>
  <div class="content">
    <LogoSection class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-subtext"> Fill your password to update it </span>
      </div>

      <v-form class="input-container" ref="form">
        <v-text-field v-model="password" clearable class="password-input"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
          label="Password" prepend-inner-icon="mdi-lock" @click:append="showPassword = !showPassword" variant="solo"
          bg-color="#f5f7f9" @keyup.enter="updatePassword" :rules="[required, passwordMin]"
          :error-messages="passwordErrors" />

        <v-text-field v-model="passwordConfirmation" clearable class="password-input"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'"
          label="Password confirmation" prepend-inner-icon="mdi-lock" @click:append="showPassword = !showPassword"
          variant="solo" bg-color="#f5f7f9" @keyup.enter="updatePassword" :rules="[required, passwordMin]"
          :error-messages="passwordErrors" />
      </v-form>

      <v-btn @click="updatePassword" class="login-button text-white" height="65" color="#3e78fc" rounded="lg"
        :loading="isLoading">
        Update password
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import LogoSection from '@/components/LogoSection.vue'

import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'UpdatePasswordComponent',

  components: {
    LogoSection
  },

  data() {
    return {
      password: '',
      passwordConfirmation: '',
      token: '',
      isLoading: false,
      showPassword: false,
      passwordErrors: [] as string[],
      hasError: false
    }
  },

  mounted() {
    this.validateToken()
  },

  methods: {
    required(v: any) {
      return !!v || 'Field is required'
    },

    passwordMin(v: any) {
      return v.length >= 8 || 'Min 8 characters'
    },

    verifyPasswords() {
      if (this.password !== this.passwordConfirmation) {
        this.passwordErrors.push('Passwords do not match')

        this.hasError = true
      }

      if (this.password.length < 8 || this.passwordConfirmation.length < 8) {
        this.passwordErrors.push('Min 8 characters')

        this.hasError = true
      }
    },

    validateToken(): void {
      const { t } = this.$route.query

      if (!t) {
        this.$toast.error('Invalid token')

        this.$router.push('/login')
      }
    },

    verifyEmptyFields(): boolean {
      if (!this.password || !this.passwordConfirmation) {
        this.$toast.error('Fill all fields')

        return false
      }

      return true
    },

    verifyFields(): boolean {
      if (!this.verifyEmptyFields()) return false

      this.hasError = false

      this.passwordErrors = []

      this.validateToken()
      this.verifyPasswords()

      return !this.hasError
    },

    switchLogin(): void {
      this.$router.push('/login')
    },

    async updatePassword() {
      try {
        if (!this.verifyFields()) return

        this.isLoading = true

        await this.$axios.post(
          '/auth/update-password',
          {
            password: this.password
          },
          {
            params: {
              t: this.token
            }
          }
        )

        this.isLoading = false

        this.$toast.success('Password updated successfully')

        this.$router.push('/login')
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
