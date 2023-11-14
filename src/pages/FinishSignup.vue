<template>
  <div class="content">
    <LogoSection class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-text"> Join our community! </span>

        <span class="greeting-subtext">
          Fill in the form below to finish your sign up
        </span>
      </div>

      <div class="input-container">
        <v-text-field
          v-model="name"
          clearable
          class="default-input"
          label="Name"
          prepend-inner-icon="mdi-text"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="signup"
          :rules="[required]"
        ></v-text-field>

        <v-text-field
          v-model="cpf"
          clearable
          class="default-input"
          label="CPF"
          prepend-inner-icon="mdi-card-account-details"
          variant="solo"
          bg-color="#f5f7f9"
          type="number"
          @keyup.enter="signup"
          :counter="11"
          :rules="[required]"
          :error-messages="cpfErrors"
        ></v-text-field>

        <v-file-input
          clearable
          class="default-input"
          label="Profile picture"
          prepend-inner-icon="mdi-image"
          prepend-icon=""
          variant="solo"
          bg-color="#f5f7f9"
          accept="image/png, image/jpeg"
          @change="handleProfilePicture"
          @keyup.enter="signup"
          :rules="[required]"
        ></v-file-input>

        <v-text-field
          v-model="birthdayDate"
          clearable
          label="Birth Date"
          prepend-inner-icon="mdi-calendar"
          placeholder="MM-DD-YYYY"
          variant="solo"
          bg-color="#f5f7f9"
          type="date"
          :rules="[required]"
          :error-messages="dateErrors"
        ></v-text-field>

        <v-text-field
          v-model="password"
          clearable
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="signup"
          :rules="[required, passwordMin]"
          :error-messages="passwordErrors"
        ></v-text-field>

        <v-text-field
          v-model="passwordConfirmation"
          clearable
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Confirm password"
          prepend-inner-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="signup"
          :rules="[required, passwordMin]"
          :error-messages="passwordErrors"
        ></v-text-field>
      </div>

      <v-btn
        @click="signup"
        class="signup-button text-white"
        height="65"
        color="#3e78fc"
        rounded="lg"
        :loading="isLoading"
      >
        Sign up
      </v-btn>

      <div>
        <span> Already have an account? </span>

        <span @click="switchLogin" class="link"> Login </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'

import LogoSection from '@/components/LogoSection.vue'

import type { ISignup } from '@/types/signup'
import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'SignupComponent',

  components: {
    LogoSection
  },

  data() {
    return {
      name: '',
      cpf: '',
      profilePicture: null as any,
      birthdayDate: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      showPassword: false,
      cpfErrors: [] as string[],
      passwordErrors: [] as string[],
      dateErrors: [] as string[],
      hasError: false,
      isLoading: false
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

    validateCPF(v: any) {
      const cpf = v.replace(/\D/g, '')

      if (cpf.length !== 11) {
        this.cpfErrors.push('Invalid CPF')

        this.hasError = true
      }
    },

    verifyPasswords() {
      if (this.password !== this.passwordConfirmation) {
        this.passwordErrors.push('Passwords do not match')

        this.hasError = true
      }
    },

    validateDate(v: any) {
      const date = dayjs(v)

      if (date.isAfter(dayjs())) {
        this.dateErrors.push('Invalid date')

        this.hasError = true
      }
    },

    verifyEmptyFields(): boolean {
      if (
        !this.name ||
        !this.cpf ||
        !this.birthdayDate ||
        !this.password ||
        !this.passwordConfirmation ||
        !this.profilePicture
      ) {
        this.$toast.error('Please fill in all fields')

        return false
      }

      return true
    },

    validateToken(): void {
      const { t } = this.$route.query

      if (t === undefined) {
        this.$toast.error('Invalid token', {
          duration: 5000
        })

        this.$router.push('/login')
      }
    },

    verifyFields(): boolean {
      if (!this.verifyEmptyFields()) return false

      this.hasError = false

      this.cpfErrors = []
      this.passwordErrors = []
      this.dateErrors = []

      this.validateToken()
      this.validateCPF(this.cpf)
      this.verifyPasswords()
      this.validateDate(this.birthdayDate)

      return !this.hasError
    },

    formatDate(date: string): string {
      return dayjs(date).format('YYYY-MM-DD')
    },

    handleProfilePicture(e: any): void {
      this.profilePicture = e.target.files[0]
    },

    async convertToBase64(file: any): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => resolve(reader.result as string)

        reader.onerror = (error) => reject(error)
      })
    },

    switchLogin(): void {
      this.$router.push('/login')
    },

    async signup() {
      try {
        if (!this.verifyFields()) return

        this.isLoading = true

        const signupData: ISignup = {
          name: this.name,
          cpf: this.cpf,
          profilePicture: await this.convertToBase64(this.profilePicture),
          birthDate: this.formatDate(this.birthdayDate),
          password: this.password
        }

        await this.$axios.post('/auth/finish-signup', signupData, {
          params: {
            t: this.$route.query.t
          }
        })

        this.isLoading = false

        this.$toast.success('Account created successfully!')

        this.switchLogin()
      } catch (e: any) {
        this.isLoading = false

        const error: IErrorResponse = e.response.data.error

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

.greeting-text {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 10px;
}

.greeting-subtext {
  font-size: 17px;
}

.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.default-input {
  width: 100%;
}

.forgot-password-text {
  align-self: flex-end;
  margin-bottom: 40px;
}

.signup-button {
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
}

@font-face {
  font-family: 'Inter';
  src: url('../../public/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
