<template>
  <div v-if="course" class="tableContent" ref="course">
    <v-row v-if="currentTab === '1'">
      <iframe
        class="course-video"
        :src="course.contentURL"
        title="BNT 418 Wspinaczka na Montparnasse w Paryżu 2"
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
        <v-tab value="3">
          {{ $t('PRACTICAL_TEST') }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-row>
      <v-window class="w-100 pa-4" v-model="currentTab">
        <v-window-item value="1" :eager="true">
          <v-row>
            <p class="text-h4">{{ course.title }}</p>
          </v-row>
          <v-row>
            <p class="mt-4 text-h7">{{ course.description }}</p>
          </v-row>
          <v-row>
            <p class="mt-4 text-h6">{{ $t('COURSE_EVALUATION') }}</p>
            <span class="mt-2 d-flex">
              <b class="mr-1" style="color: #b4761a">{{
                course.avgRating.toFixed(1)
              }}</b>
              <v-rating
                class="rating d-flex align-center"
                color="orange-lighten-1"
                half-increments
                v-model="course.avgRating"
                readonly
                density="compact"
                size="small"
              />
            </span>
            <v-btn @click="enroll" :disabled="enrolled">
              <template v-if="enrolled">Inscrito</template>
              <template v-else>Se inscrever no curso</template>
            </v-btn>
          </v-row>
        </v-window-item>
        <v-window-item value="2" :eager="true">
          <div class="d-flex flex-column justify-start">
            <div class="w-100 mb-6" v-if="!course.reviewed">
              <textarea
                v-model="newRatingComment"
                class="w-100 mb-6 pa-2"
                style="border: 1px solid grey"
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
                  :class="finishedRating ? 'bg-green' : 'bg-grey'"
                  >{{ $t('SEND') }}</v-btn
                >
              </div>
              <v-divider class="mb-4" />
            </div>
            <div v-if="course.reviews">
              <div v-for="review in course.reviews">
                <UserReview :review="review" />
              </div>
            </div>
            <div v-else>
              <p>No Reviews yet</p>
            </div>
          </div>
        </v-window-item>
        <v-window-item value="3" :eager="true" class="pa-4">
          <template v-if="testResults && testResults.status !== ''">
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
                  width="10"
                  color="#558b2f"
                  ><p>{{ testResults.hitsPercentage }}%</p></v-progress-circular
                >
                <p
                  v-if="testResults.status !== 'failed'"
                  class="test-info text-h5"
                >
                  Teste concluído com sucesso
                </p>
                <p v-else class="test-info text-h5">
                  Pontuação não suficiente!
                </p>
              </div>
            </div>
          </template>
          <template v-else-if="course.questions">
            <div v-for="(question, i) in course.questions">
              <div class="question">
                <p class="text-h6">{{ i }}. {{ question.wording }}</p>
              </div>
              <div class="alternatives d-flex flex-column">
                <div
                  :class="
                    answer.selected ? 'alternative selected' : 'alternative'
                  "
                  v-for="(answer, j) of question.answers"
                  @click="setAlternative(question.answers, answer)"
                >
                  <p class="text-h6">{{ j + 1 }}. {{ answer.text }}</p>
                </div>
              </div>
            </div>
            <div class="mt-4 d-flex justify-end">
              <v-btn class="bg-red mr-4" @click="resetAlternatives">{{
                $t('CLEAR_ANSWERS')
              }}</v-btn>
              <v-btn
                :disabled="!finishedTest"
                :class="finishedTest ? 'bg-green' : 'bg-grey'"
                @click="sendAnswers"
              >
                {{ $t('SEND') }}
              </v-btn>
            </div>
          </template>
        </v-window-item>
      </v-window>
    </v-row>
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
      enrolled: false
    }
  },
  watch: {
    currentTab: function () {
      this.scroll()
    }
  },
  computed: {
    finishedRating: function () {
      return this.newRating && this.newRatingComment !== ''
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
      this.finishedTest =
        this.answeredQuestions >=
        Object.keys(this.course.questions).values.length
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

      this.course.reviews = this.course.reviews ?? []
      this.course.reviews.push(review)
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
      await this.$axios.post(`/courses/${this.courseId}/enroll`)
      this.enrolled = true
    },
    scroll() {
      setTimeout(() => {
        const courseObj = this.$refs.course
        courseObj.scrollTop = 1000000
      }, 1)
    }
  }
}
</script>

<style scoped>
.tableContent {
  width: 100%;
}
.course-video {
  width: 100%;
  height: 500px;
}

::v-deep .v-rating__item label {
  display: flex;
  align-items: center;
}
.question {
  background-color: white;
  border-start-start-radius: 3px;
  border-start-end-radius: 3px;
  padding: 5px;
}

.question > p {
  color: black;
}

.alternative {
  cursor: pointer;
  padding: 10px;
  border-radius: 3px;
}

.alternative:hover {
  background-color: rgb(73, 73, 73);
}

.selected {
  background-color: rgb(65, 65, 65);
}

.test-results {
  width: 100%;
  height: 300px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
}

.test-success {
  background-color: #689f38;
}

.test-info {
  color: white;
}
</style>
