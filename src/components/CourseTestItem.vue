<template>
  <div style="border-radius: 3px">
    <div style="padding: 10px">
      <v-row>
        <v-col class="pa-0 mb-4" cols="12">
          <v-text-field
            class="mr-2"
            v-model="question.wording"
            :label="$t('QUESTION', { number: id })"
            type="string"
            required
            variant="solo"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0 mb-6" cols="12">
          <v-text-field
            class="mb-2 mr-2"
            v-model="question.answers[0].text"
            :label="$t('CORRECT_ANSWER')"
            type="string"
            required
            variant="solo"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pa-0" cols="12">
          <v-text-field
            class="mb-2 mr-2"
            v-model="question.answers[1].text"
            :label="$t('ALTERNATIVE', { number: 1 })"
            type="string"
            required
            variant="solo"
            hide-details
          ></v-text-field>
          <v-text-field
            class="mb-2 mr-2"
            v-model="question.answers[2].text"
            :label="$t('ALTERNATIVE', { number: 2 })"
            type="string"
            required
            variant="solo"
            hide-details
          ></v-text-field>
          <v-text-field
            class="mb-2 mr-2"
            v-model="question.answers[3].text"
            :label="$t('ALTERNATIVE', { number: 3 })"
            type="string"
            required
            variant="solo"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex flex-end">
      <v-icon
        v-if="showTrashIcon"
        style="color: #fe0000; width: 30px; height: 30px; margin-left: auto"
        @click="removeCourseContent"
        >mdi-trash-can</v-icon
      >
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CourseTestItem',
  props: {
    question: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    showTrashIcon: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    contentTitle: '',
    contentType: '',
    contentURL: ''
  }),
  created: function () {
    this.question.answers[0].isCorrect = true
  },
  methods: {
    removeCourseContent() {
      this.$emit('remove-item')
    }
  }
}
</script>

<style scoped>
.v-messages,
.v-input__details {
  display: none;
}
</style>
