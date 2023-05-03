<template>
  <div>Landing Page!</div>

  <v-btn @click="switchLogin">Login</v-btn>
</template>

<script lang="ts">
export default {
  name: 'LandingComponent',

  methods: {
    switchLogin(): void {
      this.$router.push('/login')
    }
  }
}
</script>
