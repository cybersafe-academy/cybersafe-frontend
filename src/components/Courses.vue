<template>
  <div class="tableContent">
    <v-toolbar class="tableToolbar">
      <v-btn
        class="addCourseBtn text-white"
        rounded="lg"
        @click="openCreateDialog"
      >
        Add Course
      </v-btn>
    </v-toolbar>
    <v-table fixed-header hover class="courseTable">
      <thead>
        <tr>
          <th class="text-left">Title</th>
          <th class="text-left">Level</th>
          <th class="text-center">Content in hours</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in courses" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.level }}</td>
          <td class="text-center">{{ item.contentInHours }}</td>
          <td class="actionsButtons">
            <v-btn text @click="openEditDialog(item.id)" class="editBtn">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn text @click="deleteCourse(item.id)" class="deleteBtn">
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

import type { IErrorResponse } from '@/types/errors'

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
      ;(this.$refs.createCourse as any).openDialog()
    },
    openEditDialog(id: string): void {
      const course = this.courses.find((course) => course.id === id)

      ;(this.$refs.createCourse as any).openDialog(course)
    },
    async addCourse(courseData: any) {
      if (!this.courses) {
        this.courses = []
      }
      this.courses.push(courseData)
    },
    async editCourse(data: any) {
      const courseIndex = this.courses.findIndex(
        (course) => course.id === data.id
      )

      this.courses[courseIndex] = data
    },
    async deleteCourse(id: string) {
      try {
        await this.$axios.delete(`/courses/${id}`)
        this.courses = this.courses.filter((course) => course.id !== id)

        this.$toast.success('Course deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchCourses() {
      try {
        const { data: courses } = await this.$axios.get('/courses')
        this.courses = courses.data
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
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
  overflow-y: auto;
}

.tableContent {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.courseTable {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.tableToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: white;
}

.addCourseBtn {
  font-size: 1rem;
  height: 3rem;
  width: 10rem;
  background-color: rgb(62, 120, 252);
}

.actionsButtons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.editBtn {
  color: lightgray;
  background-color: orange;
  margin-right: 0.5rem;
}

.deleteBtn {
  color: lightgray;
  background-color: red;
}
</style>
