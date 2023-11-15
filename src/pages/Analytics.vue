<template>
  <div class="tableContent">
    <v-card>
      <v-card-text>
        <v-row class="d-flex flex-column align-center">
          <v-col class="d-flex justify-center align-center pl-12">
            <p class="text-h4">{{ company }}</p>
          </v-col>
          <v-col class="pa-12 d-flex justify-start align-center flex-wrap">
            <div class="d-flex flex-column justify-center align-center mr-12">
              <p class="text-h5 mb-4">Número de Usuários:</p>
              <p class="text-h6 text-center">
                {{ analyticsData.numberOfUsers }}
              </p>
            </div>
            <div class="d-flex flex-column justify-center align-center mr-12">
              <p class="text-h5 mb-4">Acurácia em quizes:</p>
              <v-progress-circular
                v-model="analyticsData.accuracyInQuizzes"
                :size="150"
                :width="10"
                bg-color="grey"
                :color="getForeColor(analyticsData.accuracyInQuizzes)"
              >
                <p class="text-h6">{{ analyticsData.accuracyInQuizzes }}%</p>
              </v-progress-circular>
            </div>

            <div class="d-flex flex-column justify-center align-center mr-12">
              <p class="text-h5 mb-4" style="max-width: none !important">
                Taxa de compleção de curso:
              </p>
              <v-progress-circular
                v-model="analyticsData.courseCompletion"
                :size="150"
                :width="10"
                bg-color="grey"
                :color="getForeColor(analyticsData.courseCompletion)"
                >{{ analyticsData.courseCompletion }}%</v-progress-circular
              >
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <canvas id="my-chart" width="500" height="300"></canvas>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import Chart from 'chart.js'
export default {
  name: 'AnalyticsComponent',
  data() {
    return {
      analyticsData: {} as any,
      company: ''
    }
  },
  props: {},
  methods: {
    getForeColor(progress: number) {
      if (progress < 50) {
        return 'red'
      }
      if (progress < 70) {
        return 'yellow'
      }
      if (progress <= 100) {
        return 'green'
      }
      return 'grey'
    },
    getBackColor(progress) {
      switch (progress) {
        case progress < 50:
          return 'red'
        case progress < 70:
          return 'yellow'
        case progress <= 100:
          return 'green'
        default:
          return 'grey'
      }
    }
  },
  async mounted() {
    const authStore = useAuthStore()
    const company = (await this.$axios.get(`/companies/${authStore.companyID}`))
      .data
    this.company = company.tradeName

    this.analyticsData = (await this.$axios.get('/analytics/data')).data

    new Chart(document.getElementById('my-chart'), {
      type: 'bar',
      data: {
        labels: [
          'ISTJ',
          'ISFJ',
          'INFJ',
          'INTJ',
          'ISTP',
          'ISFP',
          'INFP',
          'INTP',
          'ESTP',
          'ESFP',
          'ENFP',
          'ENTP',
          'ESTJ',
          'ESFJ',
          'ENFJ',
          'ENTJ'
        ], //this.analyticsData.mbtiCount.map(
        //   (mbtiCount: any) => mbtiCount.mbtiType
        // )
        datasets: [
          {
            label: 'MBTI Types',
            data: this.analyticsData.mbtiCount.map(
              (mbtiCount: any) => mbtiCount.count
            ),
            backgroundColor: [
              '#003f5c',
              '#2f4b7c',
              '#665191',
              '#a05195',
              '#d45087',
              ' #f95d6a',
              '#ff7c43 ',
              '#ffa600'
            ],
            borderWidth: 1 // Optional: You can customize the border width
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}
</script>

<style scoped>
#my-chart {
  position: relative;
  margin: auto; /* Center the chart horizontally */
}
.tableContent {
  height: auto !important;
  overflow-y: scroll !important;
}
</style>
