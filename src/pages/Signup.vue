<template>
  <div class="content">
    <logo-section class="section" />

    <div class="section right-section">
      <div class="greeting-container">
        <span class="greeting-text"> Join our community! </span>

        <span class="greeting-subtext"> Fill in the form below to create your account </span>
      </div>

      <div class="input-container">
        <v-text-field
          v-model="cpf"
          clearable
          class="default-input"
          label="CPF"
          prepend-inner-icon="mdi-account"
          variant="solo"
          bg-color="#f5f7f9"
          :rules="[required]"
        ></v-text-field>

        <v-text-field
          v-model="email"
          clearable
          class="default-input"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="solo"
          bg-color="#f5f7f9"
          :rules="[required]"
        ></v-text-field>

        <v-text-field
          v-model="age"
          clearable
          class="default-input"
          label="Age"
          prepend-inner-icon="mdi-cake-variant"
          variant="solo"
          bg-color="#f5f7f9"
          type="number"
          :rules="[required]"
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
          :rules="[required]"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          clearable
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="Confirm password"
          prepend-inner-icon="mdi-lock"
          @click:append="showPassword = !showPassword"
          variant="solo"
          bg-color="#f5f7f9"
          :rules="[required]"
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

export default {
  name: 'Signup',

  components: {
    LogoSection
  },

  data() {
    return {
      cpf: '',
      age: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
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

    switchLogin(): void {
      this.$router.push('/login')
    },

    async signup() {
      try {
        const { data } = await this.$axios.post('/users', {
          cpf: this.cpf,
          age: +this.age,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        })

        this.$toast.success('Account created successfully!')
      } catch (error: any) {
        console.error(error)
        this.$toast.error(error.response.data.message)
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
