<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> Create a new course </span>
        </v-card-title>
        <v-card-text>
          <v-container class='mt-6'>
            <v-row>
              <v-col cols="6">
                <v-select v-model='selectedLanguage' :items='languages' label='Language'/>
              </v-col>
            </v-row>
          </v-container>
          <v-divider />
          <template v-for='language in languages'>
            <CourseForm v-if="selectedLanguage === language"  :info='courseForm[language + "Info"]' />
          </template>
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
import CourseForm from '@/components/CourseForm.vue'

const info = {
  title: '',
  description: '',
  thumbnail: '',
  contentInHours: 0,
  level: '',
  videoURL: '',
  questions: [],
}

export default {
  components: {
    CourseForm
  },
  props: {
    course: {
      type: Object,
      default: () => null
    }
  },

  data: () => {
    const languages = ['portuguese', 'english']
    return {
      courseForm: {
          id: '',
          englishInfo: {
            ...info
          },
          portugueseInfo: {...info},
        } as any,
        dialog: false,
        languages,
        selectedLanguage: languages[0],
    }
  },
  methods: {
    getInfo(language: string) {
      return this.courseForm[language + 'Info']
    },
    openDialog(course: any) {
      for (const language of this.languages) {
        const info = this.getInfo(language)
        this.dialog = true

        if (course) {
          info.id = course.id
          info.title = course.title
          info.description = course.description
          info.thumbnail = course.thumbnailURLd
          info.videoURL = course.videoURL
          info.contentInHours = course.contentInHours
          info.level = course.level
          info.questions = course.questions ?? []
        }
      }
    },
    closeDialog() {
      for (const language of this.languages) {
        const info = this.getInfo(language)

        this.dialog = false
        info.id = ''
        info.title = ''
        info.description = ''
        info.thumbnail = ''
        info.videoURL = ''
        info.contentInHours = 1
        info.level = ''
        info.questions = []
      }
    },
    verifyFields() {
      for (const language of this.languages) {
        const info = this.getInfo(language)

        if (
          !info.title ||
          !info.description ||
          !info.thumbnail ||
          !info.contentInHours ||
          !info.level
        ) {
          this.$toast.error('Please fill all the fields')

          return false
        }
      }
      return true
    },
    async saveCourse() {
      if (!this.verifyFields()) return

      const course: ICourse = {}
      for (const language of this.languages) {
        const info = this.getInfo(language)
        
        const key = language + 'Info' as keyof ICourse
        course[key] = {
          title: info.title,
          description: info.description,
          thumbnailURL: info.thumbnail,
          videoURL: info.videoURL,
          contentInHours: +info.contentInHours,
          level: info.level,
          questions: info.questions
        }
      }

      try {
        if (this.course.id) {
          const { data } = await this.$axios.put(`/courses/${this.course.id}`, course)

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
