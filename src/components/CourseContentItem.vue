<template>
  <div style="background-color: rgb(219, 219, 219); border-radius: 3px;">
    <div style="padding: 10px;">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="contentItem.title" label="Content Title" type="string" required
            variant="solo"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-select v-model="contentItem.contentType" label="Content Type" required variant="solo"
            :items="['youtube', 'pdf', 'image']"></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="contentItem.URL" label="Content URL" type="string" required
            variant="solo"></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex flex-end">
      <v-icon style="color:rgb(255, 0, 0); width: 30px;height: 30px; margin-left: auto;"
        @click="removeCourseContent">mdi-trash-can</v-icon>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CourseContentItem',
  props: {
    contentItem: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    contentTitle: '',
    contentType: '',
    contentURL: ''
  }),
  methods: {
    removeCourseContent() {
      this.$emit("remove-item")
    }
  }
}
</script>

<style scoped>
.v-messages,
.v-input__details {
  display: none;
}</style>