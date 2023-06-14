<template>
  <div class="tableContent">
    <v-toolbar v-if="role === 'master'" class="tableToolbar">
      <v-btn class="addCourseBtn text-white" rounded="lg" @click="openCreateDialog">
        Add Course
      </v-btn>
    </v-toolbar>
    <v-table fixed-header hover class="courseTable">
      <template v-if="courses.length > 0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Level</th>
            <th>Content in hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageCourses[currentPage]" :key="item.id">
            <td>{{ item.title }}</td>
            <td>{{ item.level }}</td>
            <td class="text-center">{{ item.contentInHours }}</td>
            <td class="actionsButtons">
              <v-btn :disabled="role != 'master'" text @click="openEditDialog(item.id)" class="editBtn">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn :disabled="role != 'master'" text @click="deleteCourse(item.id)" class="deleteBtn">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Level</th>
            <th>Content in hours</th>
            <th>Actions</th>
          </tr>
          <tr>
            <td :colspan="4" style="text-align: center; padding: 20px">
              <h2>No courses registered yet</h2>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:bottom>
        <v-pagination @update:modelValue="fetchCourses" :model-value="currentPage" :length="totalPages"></v-pagination>
      </template>
    </v-table>
    <CreateCourse ref="createCourse" @savedCourse="addCourse" @editedCourse="editCourse" />
  </div>
</template>

<script lang="ts">
import CreateCourse from '@/components/CreateCourse.vue'

import { useAuthStore } from '@/stores/auth'

import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'CoursesComponent',

  components: {
    CreateCourse
  },

  async created() {
    this.fetchCourses(1)
  },

  data() {
    return {
      courses: Array<any>(),
      isLoading: false,
      totalPages: 1,
      currentPage: 1,
      numberOfnewElements: 0,
    }
  },

  computed: {
    pageCourses() {
      const courses: any = this.pageCourses ?? {};
      const offset = (this.currentPage - 1) * 10
      if (this.courses.length > 0) {
        courses[this.currentPage] = this.courses.slice(Math.min(this.courses.length-this.numberOfnewElements, offset), offset+10)
      }
      return courses;
    }, 
    role() {
      const authStore = useAuthStore()

      return authStore.role || ''
    }
  },

  methods: {
    openCreateDialog(): void {
      (this.$refs.createCourse as any).openDialog();
    },
    openEditDialog(id: string): void {
      const course = this.courses.find((course) => course.id === id);
      (this.$refs.createCourse as any).openDialog(course)
    },
    async addCourse(courseData: any) {
      this.courses.push(courseData)
      if (this.courses.length > this.totalPages * 10) {
        this.totalPages++;
        this.currentPage = this.totalPages;
      }
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
        if (this.courses.length < this.totalPages*10) {
          if (this.totalPages === this.currentPage) {
            this.currentPage--
          }
          this.totalPages--;
        }

        this.$toast.success('Course deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchCourses(page: number) {
      if (!this.pageCourses[page]) {
        try {
          const { data: courses } = await this.$axios.get('/courses', { params: { page } })
          if (courses.data) {
            this.totalPages = courses.totalPages
            this.numberOfnewElements = courses.data.length;
            this.courses.push(...courses.data);
          }
        } catch (e: any) {
          const error: IErrorResponse = e.response.data.error
          this.$toast.error(error.description)
        }
      }
      this.currentPage = page;
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
  border-radius: 4px;
  height: 90%;
}

td,
th {
  min-width: 300px;
  text-align: center !important;
}

.tableToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: transparent;
}

.addCourseBtn {
  font-size: 1rem;
  height: 3rem;
  width: 10rem;
  background-color: rgb(62, 120, 252);
  margin: 0 !important;
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
