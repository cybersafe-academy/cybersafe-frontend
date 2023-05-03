<template>
  <div>
    <v-toolbar flat>
      <v-toolbar-title>Courses</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">Add Course</v-btn>
    </v-toolbar>
    <v-table theme="dark">
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          <th class="text-left">Level</th>
          <th class="text-left">Thumbnail URL</th>
          <th class="text-left">Content in hours</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in courses" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.level }}</td>
          <td>{{ item.thumbnailURL }}</td>
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
import type { ICourse } from '@/types/course'

export default {
  name: 'CoursesComponent',

  components: {
    CreateCourse
  },

  data() {
    return {
      courses: [] as ICourse[]
    }
  },

  methods: {
    openCreateDialog() {
      this.$refs.createCourse.openDialog()
    },
    addCourse(courseData: ICourse) {
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
