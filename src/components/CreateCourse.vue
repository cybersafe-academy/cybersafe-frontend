<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> {{ $t('CREATE_NEW_COURSE') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container class="mt-6">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="courseForm.category.id"
                  :label="$t('CATEGORY')"
                  variant="solo"
                  required
                  :items="categories"
                  item-title="name"
                  item-value="id"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-file-input
                  clearable
                  class="default-input"
                  :label="$t('COURSE_THUMBNAIL')"
                  prepend-inner-icon="mdi-image"
                  prepend-icon=""
                  variant="solo"
                  bg-color="#f5f7f9"
                  accept="image/png, image/jpeg"
                  @change="handleProfilePicture"
                  required
                ></v-file-input>
                <v-dialog>
                  <v-img
                    class="mb-6"
                    :width="300"
                    cover
                    :src="course.thumbnailURL"
                  />
                </v-dialog>
                <v-text-field
                  v-model="courseForm.contentURL"
                  :label="$t('VIDEO_URL')"
                  type="string"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="courseForm.level"
                  :label="$t('LEVEL')"
                  variant="solo"
                  required
                  :items="['beginner', 'intermediate', 'advanced']"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-divider />
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-tabs v-model="selectedLanguage">
                  <v-tab value="portuguese">
                    {{ $t('PORTUGUESE') }}
                  </v-tab>
                  <v-tab value="english">
                    {{ $t('ENGLISH') }}
                  </v-tab>
                </v-tabs>
              </v-col>
            </v-row>
          </v-container>
          <template v-for="language in languages">
            <CourseForm
              v-if="selectedLanguage === language"
              :info="courseForm[language + 'Info']"
            />
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeDialog">
            {{ $t('CLOSE') }}
          </v-btn>
          <v-btn class="saveCourseBtn" :loading="isLoading" @click="saveCourse">
            {{ $t('SAVE') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
  <v-dialog v-model="categoryDialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> {{ $t('CREATE_NEW_CATEGORY') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container class="mt-6">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="categoryName"
                  :label="$t('CATEGORY_NAME')"
                  type="string"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeCategoryDialog">
            {{ $t('CLOSE') }}
          </v-btn>
          <v-btn
            class="saveCourseBtn"
            :loading="isLoading"
            @click="saveCategory"
          >
            {{ $t('SAVE') }}
          </v-btn>
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
  questions: []
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
        category: {},
        thumbnailPicture: undefined,
        thumbnailURL: '',
        contentURL: '',
        level: '',
        englishInfo: {
          ...info
        },
        portugueseInfo: { ...info }
      } as any,
      dialog: false,
      categoryDialog: false,
      categoryName: '',
      languages,
      selectedLanguage: languages[0],
      isLoading: false,
      categories: [] as any
    }
  },
  created: async function () {
    try {
      const response = await this.$axios.get('/courses/categories')
      this.categories = response.data.data ?? []
    } catch (e: any) {
      const error: IErrorResponse = e.response.data.error

      this.$toast.error(error.description)
    }
  },
  methods: {
    getInfo(language: string) {
      return this.courseForm[language + 'Info']
    },
    openCategoryDialog() {
      this.categoryDialog = true
    },
    closeCategoryDialog() {
      this.categoryDialog = false
      this.categoryName = ''
      this.isLoading = false
    },
    openDialog(course: any) {
      this.course = course
      this.dialog = true

      this.courseForm.englishInfo.title = course.title
      this.courseForm.portugueseInfo.title = course.titlePtBr
      this.courseForm.englishInfo.description = course.description
      this.courseForm.portugueseInfo.description = course.descriptionPtBr

      this.courseForm.englishInfo.questions = course.questions ?? []
      this.courseForm.portugueseInfo.questions = course.questions ?? []

      this.courseForm.id = course.id
      this.courseForm.category = course.category
      this.courseForm.thumbnailURL = course.thumbnailURL
      this.courseForm.contentURL = course.contentURL
      this.courseForm.level = course.level
    },
    closeDialog() {
      for (const language of this.languages) {
        const info = this.getInfo(language)

        this.dialog = false
        this.courseForm.id = ''
        this.courseForm.thumbnailURL = ''
        this.courseForm.category = {}
        this.courseForm.contentURL = ''
        this.courseForm.level = ''
        info.title = ''
        info.description = ''
        info.questions = []
      }
    },
    verifyFields() {
      for (const language of this.languages) {
        const info = this.getInfo(language)

        if (
          !info.title ||
          !info.description ||
          !this.courseForm.category.id ||
          !this.courseForm.thumbnailPicture ||
          !this.courseForm.contentURL ||
          !this.courseForm.level
        ) {
          this.$toast.error('Please fill all the fields')

          return false
        }
      }
      return true
    },
    async saveCourse() {
      if (!this.verifyFields()) return

      this.isLoading = true

      const course: ICourseInfo = {
        title: this.courseForm.englishInfo.title,
        titlePtBr: this.courseForm.portugueseInfo.title,
        description: this.courseForm.englishInfo.description,
        descriptionPtBr: this.courseForm.portugueseInfo.description,
        questions: this.courseForm.englishInfo.questions,
        thumbnailURL: await this.convertToBase64(
          this.courseForm.thumbnailPicture
        ),
        contentURL: this.courseForm.contentURL,
        level: this.courseForm.level,
        categoryId: this.courseForm.category.id
      }

      try {
        if (this.course?.id) {
          const { data } = await this.$axios.put(
            `/courses/${this.course.id}`,
            course
          )

          this.isLoading = false

          this.closeDialog()

          this.$toast.success('Course updated successfully')

          this.$emit('editedCourse', data)
        } else {
          const { data } = await this.$axios.post('/courses', course)

          this.isLoading = false

          this.closeDialog()

          this.$toast.success('Course created successfully')

          this.$emit('savedCourse', data)
        }
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.isLoading = false

        this.$toast.error(error.description)
      }
    },

    async saveCategory() {
      if (!this.categoryName) {
        this.$toast.error('Please fill all the fields')

        return
      }

      this.isLoading = true

      const category = {
        name: this.categoryName
      }

      try {
        const { data } = await this.$axios.post('/courses/categories', category)

        this.isLoading = false
        this.categories.push(data)
        this.closeCategoryDialog()

        this.$toast.success('Category created successfully')
      } catch (e: any) {
        alert(e)

        const error: IErrorResponse = e.response.data.error

        this.isLoading = false

        this.$toast.error(error.description)
      }
    },

    async handleProfilePicture(e: any) {
      const imageFile = e.target.files[0]
    },

    async convertToBase64(file: any): Promise<string> {
      if (!file) return ''

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => resolve(reader.result as string)

        reader.onerror = (error) => reject(error)
      })
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
