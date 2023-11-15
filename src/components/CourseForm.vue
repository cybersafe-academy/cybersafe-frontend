<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="info.title"
          :label="$t('COURSE_TITLE')"
          variant="solo"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="info.description"
          :label="$t('COURSE_DESCRIPTION')"
          variant="solo"
          required
        ></v-textarea>
      </v-col>
    </v-row>
    <v-divider class="mb-6" />
    <CourseTestForm :questions="info.questions" />
  </v-container>
</template>

<script lang="ts">
import CourseTestForm from '@/components/CourseTestForm.vue'

export default {
  props: {
    info: {
      type: Object,
      required: true
    }
  },

  components: {
    CourseTestForm
  }
}
</script>
