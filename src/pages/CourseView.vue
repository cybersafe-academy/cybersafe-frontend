<template>
  <div v-if="course" class="tableContent" ref="course">
    <v-card>
      <v-card-text>
        <v-row v-if="currentTab === '1'">
          <iframe
            class="course-video"
            :src="course.contentURL"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </v-row>
        <v-row style="max-height: 50px">
          <v-tabs v-model="currentTab">
            <v-tab value="1">
              {{ $t('COURSE') }}
            </v-tab>
            <v-tab value="2">
              {{ $t('REVIEWS') }}
            </v-tab>
            <v-tab v-if="enrolled" value="3">
              {{ $t('PRACTICAL_TEST') }}
            </v-tab>
          </v-tabs>
        </v-row>
        <v-row class="mt-6">
          <v-window class="w-100 pa-4" v-model="currentTab">
            <v-window-item value="1" :eager="true">
              <v-row>
                <p class="text-h4">{{ course.title }}</p>
              </v-row>
              <v-row>
                <p class="mt-2 text-h7">{{ course.description }}</p>
              </v-row>
              <v-row class="d-flex flex-column">
                <p class="mt-4 text-h6">{{ $t('COURSE_EVALUATION') }}</p>
                <span class="mt-2 d-flex">
                  <b class="mr-1" style="color: #b4761a">{{
                    course.avgRating.toFixed(1)
                  }}</b>
                  <v-rating
                    class="rating d-flex align-center mb-6"
                    color="orange-lighten-1"
                    half-increments
                    v-model="course.avgRating"
                    readonly
                    density="compact"
                    size="small"
                  />
                </span>
                <v-btn class="mb-3" @click="enroll" style="width: 300px">
                  <template v-if="enrolled">
                    {{ $t('WITHDRAW_FROM_COURSE') }}
                  </template>
                  <template v-else>
                    {{ $t('SE_INSCREVER_NO_CURSO') }}
                  </template>
                </v-btn>
              </v-row>
            </v-window-item>
            <v-window-item value="2" :eager="true">
              <div class="d-flex flex-column justify-start">
                <p
                  v-if="enrolled && !course.reviewed"
                  class="text-h4 mt-6 mb-6"
                >
                  {{ $t('COURSE_REVIEW') }}
                </p>
                <p v-else class="text-h5 mt-2 mb-6 text-center">
                  {{ $t('ALL_COURSE_REVIEWS') }}
                </p>
                <div v-if="enrolled && !course.reviewed" class="w-100 mb-6">
                  <textarea
                    v-model="newRatingComment"
                    class="w-100 mb-6 pa-2"
                    style="border: 1px solid grey; color: var(--text)"
                  ></textarea>
                  <div class="d-flex align-center">
                    <v-rating
                      class="rating d-flex align-center mt-2 mr-6"
                      style="margin-left: -6px"
                      color="orange-lighten-1"
                      v-model="newRating"
                      density="compact"
                    />
                    <v-btn
                      @click="sendReview"
                      :disabled="!finishedRating"
                      class="saveCourseBtn"
                      :class="!finishedRating ? 'bg-grey' : ''"
                      >{{ $t('SEND') }}</v-btn
                    >
                  </div>
                  <v-divider class="mt-4 mb-2" />
                </div>
                <div v-if="course.reviews">
                  <div v-for="review in course.reviews">
                    <UserReview :review="review" />
                  </div>
                </div>
                <div v-else>
                  <p>{{ $t('NO_REVIEWS_YET') }}</p>
                </div>
              </div>
            </v-window-item>
            <v-window-item v-if="enrolled" value="3" :eager="true">
              <div
                class="pa-4 d-flex justify-center"
                v-if="
                  testResults &&
                  testResults.status !== '' &&
                  testResults.status !== 'in_progress'
                "
              >
                <div
                  :class="{
                    'test-results': true,
                    'test-success': testResults.status === 'approved',
                    'test-fail': testResults.status !== 'approved'
                  }"
                >
                  <div class="d-flex flex-column align-center">
                    <v-progress-circular
                      class="mt-6 mb-6"
                      v-model="testResults.hitsPercentage"
                      size="160"
                      width="13"
                      :color="progressColor"
                      ><p>
                        {{ testResults.hitsPercentage }}%
                      </p></v-progress-circular
                    >
                    <p
                      style="max-width: none !important"
                      v-if="testResults.status !== 'failed'"
                      class="test-info text-h5"
                    >
                      {{ $t('TEST_COMPLETED_SUCCESSFULLY') }}
                    </p>
                    <p v-else class="test-info text-h5">
                      {{ $t('NOT_ENOUGH_SCORE') }}
                    </p>
                  </div>
                </div>
              </div>

              <template v-else-if="course.questions">
                <div v-for="(question, i) in course.questions">
                  <div class="question">
                    <p class="text-h6">{{ i + 1 }}. {{ question.wording }}</p>
                  </div>
                  <div class="alternatives d-flex flex-column">
                    <div
                      :class="
                        answer.selected ? 'alternative selected' : 'alternative'
                      "
                      v-for="(answer, j) of question.answers"
                      @click="setAlternative(question.answers, answer)"
                    >
                      <p class="text-h6">{{ letters[j] }}. {{ answer.text }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 d-flex justify-end">
                  <v-btn class="bg-red mr-2" @click="resetAlternatives">{{
                    $t('CLEAR_ANSWERS')
                  }}</v-btn>
                  <v-btn
                    :disabled="!finishedTest"
                    class="saveCourseBtn"
                    :class="!finishedTest ? 'bg-grey' : ''"
                    @click="sendAnswers"
                  >
                    {{ $t('SEND') }}
                  </v-btn>
                </div>
              </template>
            </v-window-item>
          </v-window>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import UserReview from '@/components/UserReview.vue'

export default {
  name: 'CourseView',
  components: {
    UserReview
  },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentTab: 'teste',
      finishedTest: false,
      answeredQuestions: 0,
      newRatingComment: '',
      newRating: 0,
      course: undefined,
      testResults: undefined,
      enrolled: false,
      letters: ['a', 'b', 'c', 'd']
    }
  },

  computed: {
    finishedRating: function () {
      return this.newRating && this.newRatingComment !== ''
    },
    progressColor: function () {
      if (this.testResults.hitsPercentage < 70) {
        return 'red'
      }
      if (this.testResults.hitsPercentage <= 100) {
        return 'green'
      }
      return 'grey'
    }
  },
  created: async function () {
    await this.loadCourse()
    await this.loadReviews()
    await this.loadQuestions()
  },
  methods: {
    async loadCourse() {
      this.course = (await this.$axios.get(`/courses/${this.courseId}`)).data
      const isPortuguese = localStorage.getItem('language') === 'pt'

      if (isPortuguese) {
        this.course.title = this.course.titlePtBr
        this.course.description = this.course.descriptionPtBr
      }
    },
    async loadReviews() {
      this.course.reviews = (
        await this.$axios.get(`courses/${this.courseId}/reviews`)
      ).data
    },
    async loadQuestions() {
      this.course.questions = (
        await this.$axios.get(`courses/${this.courseId}/questions`)
      ).data
      this.testResults = this.course.enrollment
      this.enrolled = !!this.course.enrollment
    },
    setAlternative(alternatives: any[], selectedAlternative: any) {
      alternatives.forEach((alternative) => (alternative.selected = false))
      selectedAlternative.selected = true
      this.answeredQuestions++
      this.finishedTest = this.answeredQuestions >= this.course.questions.length
    },
    resetAlternatives() {
      this.answeredQuestions = 0
      this.finishedTest = false
      ;(Object as any)
        .values(this.course.questions)
        .forEach((question: any) =>
          question.answers.forEach((answer: any) => (answer.selected = false))
        )
    },
    async sendReview() {
      const review = (
        await this.$axios.post(`courses/${this.courseId}/reviews`, {
          comment: this.newRatingComment,
          rating: this.newRating
        })
      ).data

      const reviews = [...this.course.reviews]
      await this.loadCourse()

      this.course.reviews = reviews ?? []
      this.course.reviews.unshift(review)
      this.course.reviewed = true
    },
    async sendAnswers() {
      const parsedAnswers = this.course.questions.map((question) => ({
        answerID: question.answers.find((answer) => answer.selected).id,
        questionID: question.id
      }))

      const result = (
        await this.$axios.post(`/courses/${this.courseId}/questions/batch`, {
          answers: parsedAnswers
        })
      ).data
      this.testResults = result
    },
    async enroll() {
      if (!this.enrolled) {
        await this.$axios.post(`/courses/${this.courseId}/enroll`)
        this.enrolled = true
      } else {
        await this.$axios.post(`/courses/${this.courseId}/withdraw`)
        this.enrolled = false
        this.testResults = undefined
        this.resetAlternatives()
      }
    }
  }
}
</script>

<style scoped>
.tableContent {
  width: 100%;
  overflow-y: scroll;
  padding: 20px 60px 20px 60px !important;
}
.course-video {
  width: 100%;
  height: 690px;
}

.v-card {
  padding: 5px;
}

::v-deep .v-rating__item label {
  display: flex;
  align-items: center;
}
.question {
  background-color: var(--question-background);
  border-start-start-radius: 3px;
  border-start-end-radius: 3px;
  padding: 5px;
}

.question > p {
  color: #f4eee0;
}

.alternative {
  cursor: pointer;
  padding: 10px 10px 10px 20px;
  border-radius: 3px;
}

.alternative:hover {
  background-color: var(--alternative-hover);
}

.selected {
  background-color: var(--alternative-selected);
}

.test-results {
  width: 600px;
  height: 300px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
