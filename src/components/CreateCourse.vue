<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> Create a new course </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="mb-12">
              <v-col cols="12">
                <v-text-field
                  v-model="title"
                  label="Course title"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Description"
                  variant="solo"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="thumbnail"
                  label="Thumbnail URL"
                  type="string"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="contentInHours"
                  label="Content in hours"
                  type="number"
                  required
                  variant="solo"
                  :rules="[
                    (v) => v >= 1 || 'Content must be a positive number'
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="level"
                  label="Level"
                  variant="solo"
                  required
                  :items="['beginner', 'intermediate', 'advanced']"
                ></v-select>
              </v-col>
            </v-row>
            <course-content-form :contents="contents"></course-content-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeDialog"> Close </v-btn>
          <v-btn class="saveCourseBtn" @click="saveCourse"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import type { ICourse } from '@/types/course'
import type { IErrorResponse } from '@/types/errors'
import CourseContentForm from '@/components/CourseContentForm.vue'

export default {
  components: {
    CourseContentForm
  },

  props: {
    course: {
      type: Object,
      default: () => null
    }
  },

  data: () => ({
    dialog: false,
    id: '',
    title: '',
    description: '',
    thumbnail: '',
    contentInHours: 0,
    level: '',
    contents: [],
  }),

  methods: {
    openDialog(course: any) {
      this.dialog = true

      if (course) {
        this.id = course.id
        this.title = course.title
        this.description = course.description
        this.thumbnail = course.thumbnailURL
        this.contentInHours = course.contentInHours
        this.level = course.level
        this.contents = course.contents || []
      }
    },
    closeDialog() {
      this.dialog = false

      this.id = ''
      this.title = ''
      this.description = ''
      this.thumbnail = ''
      this.contentInHours = 1
      this.level = ''
      this.contents = []
    },
    verifyFields() {
      if (
        !this.title ||
        !this.description ||
        !this.thumbnail ||
        !this.contentInHours ||
        !this.level
      ) {
        this.$toast.error('Please fill all the fields')

        return false
      }

      return true
    },
    async saveCourse() {
      if (!this.verifyFields()) return

      const course: ICourse = {
        title: this.title,
        description: this.description,
        thumbnailURL: this.thumbnail,
        contentInHours: +this.contentInHours,
        level: this.level,
        contents: this.contents
      }

      try {
        if (this.id) {
          const { data } = await this.$axios.put(`/courses/${this.id}`, course)

          this.closeDialog()

          this.$toast.success('Course updated successfully')

          this.$emit('editedCourse', data)
        } else {
          const { data } = await this.$axios.post('/courses', course)

          this.closeDialog()

          this.$toast.success('Course created successfully')

          this.$emit('savedCourse', data)
        }
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    }
  }
}
</script>

<style scoped>

.createCourseDialog {
  overflow-y: auto;
}
.closeDialogBtn {
  background-color: #f44336 !important;
  color: #fff !important;
}

.saveCourseBtn {
  background-color: #4caf50 !important;
  color: #fff !important;
}
</style>
