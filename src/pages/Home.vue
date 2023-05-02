<template>
  <div class="content">
    <DrawerComponent />
    <div class="right-section">
      <span class="greeting-text"> Welcome to Cybersafe Academy! </span>
    </div>
  </div>
</template>

<script lang="ts">
import DrawerComponent from '@/components/Drawer.vue'

export default {
  name: 'HomeComponent',

  components: {
    DrawerComponent
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
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
