<template>
  <div class="content">
    <logo-section class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-text"> Join our community! </span>

        <span class="greeting-subtext">
          Fill in the form below to create your account
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
          @keyup.enter="signup"
          :rules="[required, validateCPF]"
        ></v-text-field>

        <v-text-field
          v-model="email"
          clearable
          class="default-input"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="solo"
          bg-color="#f5f7f9"
          @keyup.enter="signup"
          :rules="[required, validateEmail]"
        ></v-text-field>

        <v-text-field
          clearable
          label="Birth Date"
          prepend-inner-icon="mdi-calendar"
          placeholder="YYYY-MM-DD"
          variant="solo"
          bg-color="#f5f7f9"
          type="date"
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
          :error="passwordsDoNotMatch"
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
          :error="passwordsDoNotMatch"
        ></v-text-field>
      </div>

      <v-btn
        @click="signup"
        class="signup-button text-white"
        height="65"
        color="#3e78fc"
        rounded="lg"
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
import LogoSection from '@/components/LogoSection.vue'
import type { ISignup, ISignupResponse } from '@/types/signup'
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
      birthdayDate: new Date(),
      email: '',
      password: '',
      passwordConfirmation: '',
      showPassword: false,
      passwordsDoNotMatch: false,
      menu1: false
    }
  },

  methods: {
    required(v: any) {
      return !!v || 'Field is required'
    },

    passwordMin(v: any) {
      return v.length >= 8 || 'Min 8 characters'
    },

    validateEmail(v: any) {
      const regex = /\S+@\S+\.\S+/

      return regex.test(v) || 'Invalid email'
    },

    validateCPF(v: any) {
      const cpf = v.replace(/\D/g, '')

      return cpf.length === 11 || 'Invalid CPF'
    },

    verifyEmptyFields(): boolean {
      if (
        !this.name ||
        !this.cpf ||
        !this.birthdayDate ||
        !this.email ||
        !this.password ||
        !this.passwordConfirmation
      ) {
        this.$toast.error('Please fill in all fields')

        return false
      }

      return true
    },

    verifyPassword(): boolean {
      if (this.password !== this.passwordConfirmation) {
        this.passwordsDoNotMatch = true
        this.$toast.error('Passwords do not match')

        return false
      }

      return true
    },

    verifyFields(): boolean {
      console.log(this.birthdayDate)
      console.log(this.$refs.qqcoisa)

      if (!this.verifyEmptyFields()) return false
      if (!this.verifyPassword()) return false
      if (!this.validateEmail(this.email)) return false
      if (!this.validateCPF(this.cpf)) return false

      return true
    },

    switchLogin(): void {
      this.$router.push('/login')
    },

    async signup() {
      try {
        if (!this.verifyFields()) return

        const signupData: ISignup = {
          name: this.name,
          cpf: this.cpf,
          age: this.birthdayDate.toISOString(),
          email: this.email,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation
        }

        await this.$axios.post<ISignupResponse>('/users', {
          ...signupData
        })

        this.$toast.success('Account created successfully!')

        this.switchLogin()
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },

    test() {
      console.log(this.$refs.qqcoisa)
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

.vuejs3-datepicker {
  position: static !important;
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
