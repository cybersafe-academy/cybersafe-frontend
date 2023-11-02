<template>
  <div class="content">
    <DrawerComponent @changePage="handleChangePage" />
    <div v-if="selectedPage === 'courses-management'" class="right-section">
      <CoursesManagementComponent />
    </div>
    <div v-if="selectedPage === 'users'" class="right-section">
      <UsersComponent />
    </div>
    <div v-if="selectedPage === 'companies'" class="right-section">
      <CompaniesComponent />
    </div>
    <div v-if="selectedPage === 'courses'" class="right-section">
      <CoursesComponent @courseViewOpened='openCourseView' />
    </div>
    <div v-if="selectedPage === 'course-view'" class="right-section">
      <CourseView :course-id='selectedCourseId' />
    </div>
    <div v-if="selectedPage === 'analytics'" class="right-section">
      <Analytics />
    </div>
  </div>
</template>

<script lang="ts">
import DrawerComponent from '@/components/Drawer.vue'
import CoursesManagementComponent from '@/components/CoursesManagement.vue'
import CompaniesComponent from '@/components/Companies.vue'
import UsersComponent from '@/components/Users.vue'
import CoursesComponent from '@/components/Courses.vue'
import CourseView from './CourseView.vue'
import Analytics from './Analytics.vue'

export default {
  name: 'HomeComponent',

  components: {
    DrawerComponent,
    CoursesManagementComponent,
    CompaniesComponent,
    UsersComponent,
    CoursesComponent,
    CourseView,
    Analytics
},

  data() {
    return {
      selectedPage: 'courses',
      selectedCourseId: '',
    }
  },

  methods: {
    handleChangePage(page: string) {
      this.selectedPage = page
    },
    openCourseView(courseId: string) {
      this.selectedPage = 'course-view';
      this.selectedCourseId = courseId;
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
