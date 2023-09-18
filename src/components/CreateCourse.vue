<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> {{ $t("CREATE_NEW_COURSE")}}</span>
        </v-card-title>
        <v-card-text>
          <v-container class='mt-6'>
            <v-row>
              <v-col cols="6">
                <v-select v-model='selectedLanguage' :items='languages' :label='$t("LANGUAGE")'/>
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
import type { ICourseInfo } from '@/types/course'
import type { IErrorResponse } from '@/types/errors'
import CourseForm from '@/components/CourseForm.vue'

const info = {
  title: '',
  description: '',
  thumbnailURL: '',
  contentInHours: 0,
  level: '',
  videoURL: '',
  questions: [],
}

export default {
  components: {
    CourseForm
  },
  data: () => {
    const languages = ['portuguese', 'english']
    return {
      course: {},
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
      this.course = course
      console.log(this.course)
      for (const language of this.languages) {
        const info = this.getInfo(language)
        this.dialog = true

        if (course) {
          info.id = course.id
          info.title = course.title
          info.description = course.description
          info.thumbnailURL = course.thumbnailURL
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
        info.thumbnailURL = ''
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
          !info.thumbnailURL ||
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

      const course: ICourseInfo = {  
        title: this.courseForm.englishInfo.title,
        description: this.courseForm.englishInfo.description,
        thumbnailURL: this.courseForm.englishInfo.thumbnailURL,
        // videoURL: this.courseForm.englishInfo.videoURL,
        contentInHours: this.courseForm.englishInfo.contentInHours,
        level: this.courseForm.englishInfo.level,
        category: this.courseForm.category
        //questions: this.courseForm.englishInfo.questions
      }

      console.log(course)

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
        console.log(e)
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
