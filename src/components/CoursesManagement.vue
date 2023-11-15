<template>
  <div class="tableContent">
    <div v-if="role === 'master'" class="tableToolbar">
      <v-btn
        class="addCourseBtn text-white"
        rounded="lg"
        @click="openCreateDialog"
      >
        {{ $t('ADD_COURSE') }}
      </v-btn>
      <v-btn
        class="addCourseBtn text-white"
        rounded="lg"
        @click="openCreateCategoryDialog"
      >
        {{ $t('ADD_CATEGORY') }}
      </v-btn>
    </div>
    <v-table ref="itemTable" fixed-header hover class="courseTable">
      <template v-if="courses.length > 0">
        <thead>
          <tr>
            <th>{{ $t('COURSE_TITLE') }}</th>
            <th>{{ $t('LEVEL') }}</th>
            <th>{{ $t('ACTIONS') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageCourses[currentPage]" :key="item.id">
            <td>
              <p>
                {{ item.title }}
              </p>
            </td>
            <td>
              <p>
                {{ item.level }}
              </p>
            </td>
            <td class="actionsButtons">
              <v-btn
                :disabled="role != 'master'"
                text
                @click="openEditDialog(item.id)"
                class="editBtn"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                :disabled="role != 'master'"
                text
                @click="openDeleteDialog(item.id)"
                class="deleteBtn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <th>{{ $t('COURSE_TITLE') }}</th>
            <th>{{ $t('LEVEL') }}</th>
            <th>{{ $t('CONTENT_IN_HOURS') }}</th>
            <th>{{ $t('ACTIONS') }}</th>
          </tr>
          <tr>
            <td :colspan="4" style="text-align: center; padding: 20px">
              <h2>{{ $t('NO_COURSES_REGISTERED_YET') }}</h2>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:bottom>
        <v-pagination
          @update:modelValue="fetchCourses"
          :model-value="currentPage"
          :length="totalPages"
        ></v-pagination>
      </template>
    </v-table>
    <CreateCourse
      ref="createCourse"
      @savedCourse="addCourse"
      @editedCourse="editCourse"
    />
    <DeleteItemConfirmation ref="deleteItem" @confirmed="deleteCourse" />
  </div>
</template>

<script lang="ts">
import CreateCourse from '@/components/CreateCourse.vue'
import DeleteItemConfirmation from '@/components/DeleteItemConfirmation.vue'

import { useAuthStore } from '@/stores/auth'

import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'CoursesManagementComponent',

  components: {
    CreateCourse,
    DeleteItemConfirmation
  },

  mounted() {
    this.$nextTick(() => {
      this.root.style.setProperty(
        '--title-string',
        `'${this.$t('COURSE_TITLE')}'`
      )
      this.root.style.setProperty('--level-string', `'${this.$t('LEVEL')}'`)
      this.root.style.setProperty('--actions-string', `'${this.$t('ACTIONS')}'`)

      if (this.$refs.itemTable) {
        this.numberOfItemsToFetch = Math.floor(
          (this.$refs.itemTable as any).$el.offsetHeight / 60
        )
      } else {
        this.numberOfItemsToFetch = 10
      }

      this.fetchCourses(1)
    })
  },

  data() {
    return {
      courses: Array<any>(),
      isLoading: false,
      totalPages: 1,
      currentPage: 1,
      numberOfnewElements: 0,
      numberOfItemsToFetch: 0,
      root: document.documentElement
    }
  },

  computed: {
    pageCourses() {
      const courses: any = this.pageCourses ?? {}
      const offset = (this.currentPage - 1) * this.numberOfItemsToFetch
      if (this.courses.length > 0) {
        courses[this.currentPage] = this.courses.slice(
          offset,
          offset + this.numberOfItemsToFetch
        )
      }

      return courses
    },
    role() {
      const authStore = useAuthStore()

      return authStore.role || ''
    }
  },

  methods: {
    openCreateDialog(): void {
      ;(this.$refs.createCourse as any).openDialog()
    },
    openCreateCategoryDialog(): void {
      ;(this.$refs.createCourse as any).openCategoryDialog()
    },
    openEditDialog(id: string): void {
      const course = this.courses.find((course) => course.id === id)
      ;(this.$refs.createCourse as any).openDialog(course)
    },
    openDeleteDialog(id: string): void {
      ;(this.$refs.deleteItem as any).openDialog(id)
    },
    async addCourse(courseData: any) {
      this.courses.push(courseData)
      if (this.courses.length > this.totalPages * this.numberOfItemsToFetch) {
        this.totalPages++
        this.currentPage = this.totalPages
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

        const numberOfCoursesInCurrentPage =
          this.courses.length % this.numberOfItemsToFetch
        if (numberOfCoursesInCurrentPage === 1) {
          this.currentPage--
          this.totalPages--
        }

        this.courses = this.courses.filter((course) => course.id !== id)

        this.$toast.success('Course deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchCourses(page: number) {
      if (!this.pageCourses[page]) {
        try {
          const { data: courses } = await this.$axios.get(
            '/courses/management',
            {
              params: { page, limit: this.numberOfItemsToFetch }
            }
          )
          if (courses.data) {
            this.totalPages = courses.totalPages
            this.numberOfnewElements = courses.data.length
            this.courses.push(...courses.data)
          }
        } catch (e: any) {
          const error: IErrorResponse = e.response.data.error
          this.$toast.error(error.description)
        }
      }
      this.currentPage = page
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
}

.courseTable {
  border-radius: 4px;
  height: 90%;
}

td,
th {
  min-width: 200px;
  text-align: center !important;
}

p {
  width: 200px;
  margin: auto;
}

.tableToolbar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background-color: transparent;
}

.addCourseBtn {
  font-size: 1rem;
  height: 3rem;
  padding: 10px;
  background-color: rgb(62, 120, 252);
  margin: 0 !important;
  margin-right: 1rem !important;
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

@media only screen and (max-width: 900px) {
  .tableContent {
    overflow-y: scroll;
    display: block;
  }

  .tableToolbar {
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .addCourseBtn {
    margin: 0 !important;
    margin-bottom: 10px !important;
  }

  .addCourseBtn:nth-child(1) {
    margin-right: 10px !important;
  }

  .v-table {
    overflow-y: hidden;
    height: auto;
  }

  .actionsButtons {
    display: flex;
    justify-content: start;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  td {
    border: none;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 30px 10px 30px 10px !important;
    overflow-y: hidden;
  }

  td > p {
    width: 150px;
    overflow-wrap: break-word;
    text-align: center;
  }

  tr:nth-of-type(odd) td {
    background-color: var(--alternate-background) !important;
  }

  td:before {
    margin-right: 80px;
    text-align: start;
    width: 100px;
  }

  td:nth-of-type(1):before {
    content: var(--title-string);
  }

  td:nth-of-type(2):before {
    content: var(--level-string);
  }

  td:nth-of-type(3):before {
    content: var(--actions-string);
  }
}
</style>
