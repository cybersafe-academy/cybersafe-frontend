<template>
  <div class="tableContent">
    <v-toolbar flat>
      <v-toolbar-title>Courses</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">Add Course</v-btn>
    </v-toolbar>
    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Level</th>
          <th class="text-left">Content in hours</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in courses" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.level }}</td>
          <td>{{ item.contentInHours }}</td>
          <td>
            <v-btn color="primary" text @click="editCourse(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" text @click="deleteCourse(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <CreateCourse ref="createCourse" @savedCourse="addCourse" />
  </div>
</template>

<script lang="ts">
import CreateCourse from '@/components/CreateCourse.vue'
import type { ICourse, IContent, ICourseResponse } from '@/types/course'

export default {
  name: 'CoursesComponent',

  components: {
    CreateCourse
  },

  data() {
    return {
      courses: [] as ICourseResponse[]
    }
  },

  methods: {
    openCreateDialog(): void {
      this.$refs.createCourse.openDialog()
    },
    async addCourse(courseData: ICourseResponse) {
      this.courses.push(courseData)
    },
    editCourse(id: string) {
      console.log('edit course', id)
    },
    deleteCourse(id: string) {
      this.courses = this.courses.filter((course) => course.id !== id)
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
}

.tableContent {
  width: 100%;
  height: 100%;
  padding: 2rem;
}
</style>
