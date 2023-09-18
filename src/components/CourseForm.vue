<template>
    <v-container>
            <v-row class="mb-12">
              <v-col cols="12">
                <v-text-field v-model="info.title" label="Course title" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="info.description" label="Description" variant="solo" required></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="info.thumbnailURL" label="Thumbnail URL" type="string" variant="solo"
                  required></v-text-field>
                <v-text-field v-model="info.videoURL" label="Video URL" type="string" variant="solo"
                  required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="info.contentInHours" label="Content in hours" type="number" required variant="solo"
                  :rules="[
                    (v) => v >= 1 || 'Content must be a positive number'
                  ]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="info.level" label="Level" variant="solo" required
                  :items="['beginner', 'intermediate', 'advanced']"></v-select>
              </v-col>
            </v-row>
            <CourseTestForm :questions='info. questions'/>
    </v-container>
</template>



<script lang="ts">
import CourseTestForm from '@/components/CourseTestForm.vue'

export default {
    props: {
        info: {
            type: Object,
            required: true,
        }
    },
    components: {
        CourseTestForm
    },
}

</script>