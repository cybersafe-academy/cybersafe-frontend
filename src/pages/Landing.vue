<template>
  <div class="landingContent">
    Landing Page!
    <v-btn @click="switchLogin">Login</v-btn>
  </div>
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

<style scoped>
.landingContent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
</style>
