<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="1024">
        <v-card>
          <v-card-title>
            <span class="text-h5"> Create a new course </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    label="Title"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    label="Description"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    label="Thumbnail"
                    accept="image/*"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="content"
                    label="Content in hours"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="level"
                    label="Level"
                    :items="['Iniciante', 'Intermediário', 'Avançado']"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="saveCourse">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import type { ICourse } from '@/types/course'

export default {
  data: () => ({
    dialog: false,
    title: '',
    description: '',
    thumbnail: '',
    content: 0,
    level: ''
  }),

  methods: {
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    async saveCourse() {
      const course: ICourse = {
        id: '0',
        title: this.title,
        description: this.description,
        thumbnailURL: this.thumbnail,
        contentInHours: this.content,
        level: this.level
      }

      this.$emit('savedCourse', course)
    }
  }
}
</script>
