<template>
  <div class="tableContent">
    <v-row>
      <v-col>
        <p class="text-h3">Exati Tecnologia</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pa-12 d-flex justify-start align-center flex-wrap">
        <div class="d-flex flex-column justify-center align-center mr-12">
          <p class="text-h6">Número de Usuários:</p>
          <p clas="text-center">{{ analyticsData.numberOfUsers }}</p>
        </div>
        <v-progress-circular
          class="mr-12"
          v-model="analyticsData.accuracyInQuizzes"
          :size="150"
          :width="10"
          bg-color="grey"
          :color="getForeColor(analyticsData.accuracyInQuizzes)"
        >
          <p class="text-h6">{{ analyticsData.accuracyInQuizzes }}%</p>
        </v-progress-circular>
        <v-progress-circular
          v-model="analyticsData.courseCompletion"
          class="mr-12"
          :size="150"
          :width="10"
          bg-color="grey"
          :color="getForeColor(analyticsData.courseCompletion)"
          >{{ analyticsData.courseCompletion }}%</v-progress-circular
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <canvas id="my-chart" width="500" height="300"></canvas>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Chart from 'chart.js'
export default {
  name: 'AnalyticsComponent',
  data() {
    return {
      analyticsData: {} as any
    }
  },
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
    this.analyticsData = (await this.$axios.get('/analytics/data')).data

    new Chart(document.getElementById('my-chart'), {
      type: 'bar',
      data: {
        labels: this.analyticsData.mbtiCount.map(
          (mbtiCount: any) => mbtiCount.mbtiType
        ),
        datasets: [
          {
            label: 'MBTI Types',
            data: this.analyticsData.mbtiCount.map(
              (mbtiCount: any) => mbtiCount.count
            ),
            backgroundColor: [
              'red',
              'blue',
              'green',
              'yellow',
              'purple',
              'orange',
              'pink',
              'brown',
              'gray',
              'cyan'
              // Add more colors as needed for each bar
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
