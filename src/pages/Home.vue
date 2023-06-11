<template>
  <div class="content">
    <DrawerComponent @changePage="handleChangePage" />
    <div v-if="selectedPage === 'courses'" class="right-section">
      <CoursesComponent />
    </div>
    <div v-if="selectedPage === 'users'" class="right-section">
      <span class="greeting-text"> Work in progress! 🧑‍🏭 </span>
    </div>
    <div v-if="selectedPage === 'companies'" class="right-section">
      <CompaniesComponent />
    </div>
  </div>
</template>

<script lang="ts">
import DrawerComponent from '@/components/Drawer.vue'
import CoursesComponent from '@/components/Courses.vue'
import CompaniesComponent from '@/components/Companies.vue'

export default {
  name: 'HomeComponent',

  components: {
    DrawerComponent,
    CoursesComponent,
    CompaniesComponent
  },

  data() {
    return {
      selectedPage: 'courses'
    }
  },

  methods: {
    handleChangePage(page: string) {
      this.selectedPage = page
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
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: #f8f8f8;
}

.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #f8f8f8;
}
</style>
