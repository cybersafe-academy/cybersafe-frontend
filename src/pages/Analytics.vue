<template>
  <div class="tableContent">
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-progress-circular
              v-model="testsAccuracy"
              :size="150"
              :width="10"
              bg-color="amber"
              color="yellow"
            >
              <p class="text-h6">{{ testsAccuracy }}%</p>
            </v-progress-circular>
          </v-col>
          <v-col><v-progress-circular :size="150"></v-progress-circular></v-col>
          <v-col><v-progress-circular :size="150"></v-progress-circular></v-col>
        </v-row>
        <v-row>
          <canvas id="my-chart" width="500" height="300"></canvas>
        </v-row>
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
      testsAccuracy: 100
    }
  },
  mounted() {
    new Chart(document.getElementById('my-chart'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            fill: false,
            label: '2018 Sales',
            data: [300, 700, 450, 750, 450]
          }
        ]
      }
    })
  }
}
</script>

<style>
.tableContent {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: scroll !important;
}
</style>
