<template>
  <div class="tableContent">
    <v-toolbar flat>
      <v-toolbar-title>Courses</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">Add Course</v-btn>
    </v-toolbar>
    <v-table v-if="!isLoading">
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
            <v-btn color="primary" text @click="openEditDialog(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" text @click="deleteCourse(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <CreateCourse
      ref="createCourse"
      @savedCourse="addCourse"
      @editedCourse="editCourse"
    />
  </div>
</template>

<script lang="ts">
import CreateCourse from '@/components/CreateCourse.vue'

export default {
  name: 'CoursesComponent',

  components: {
    CreateCourse
  },

  async created() {
    this.fetchCourses()
  },

  data() {
    return {
      courses: Array<any>(),
      isLoading: false
    }
  },

  methods: {
    openCreateDialog(): void {
      this.$refs.createCourse.openDialog()
    },
    openEditDialog(id: string): void {
      const course = this.courses.find((course) => course.id === id)

      this.$refs.createCourse.openDialog(course)
    },
    async addCourse(courseData: any) {
      this.courses.push(courseData)
    },
    async editCourse(data: any) {
      console.log(data)
      const courseIndex = this.courses.findIndex(
        (course) => course.id === data.id
      )

      console.log(courseIndex)
      console.log(this.courses[courseIndex])

      this.courses[courseIndex] = data

      this.isLoading = true
      await this.$nextTick(() => {
        this.isLoading = false
      })
    },
    deleteCourse(id: string) {
      this.courses = this.courses.filter((course) => course.id !== id)
    },
    async fetchCourses() {
      const { data: courses } = await this.$axios.get('/courses')

      this.courses = courses.data
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
