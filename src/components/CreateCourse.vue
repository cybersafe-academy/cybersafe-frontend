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
                    label="Course title"
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
                  <v-text-field
                    v-model="thumbnail"
                    label="Thumbnail URL"
                    type="string"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="content"
                    label="Content in hours"
                    type="number"
                    :rules="[
                      (v) => v >= 0 || 'Content must be a positive number'
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="level"
                    label="Level"
                    :items="['beginner', 'intermediate', 'advanced']"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="contentTitle"
                    label="Content Title"
                    type="string"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="contentType"
                    label="Content Type"
                    :items="['youtube', 'pdf', 'image']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="contentURL"
                    label="Content URL"
                    type="string"
                  ></v-text-field>
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
import type { IErrorResponse } from '@/types/errors'

export default {
  props: {
    course: {
      type: Object,
      default: () => null
    }
  },

  data: () => ({
    dialog: false,
    id: '',
    title: '',
    description: '',
    thumbnail: '',
    content: 0,
    level: '',
    contentTitle: '',
    contentType: '',
    contentURL: ''
  }),

  methods: {
    openDialog(course: any) {
      this.dialog = true

      if (course) {
        this.id = course.id
        this.title = course.title
        this.description = course.description
        this.thumbnail = course.thumbnailURL
        this.content = course.contentInHours
        this.level = course.level
        this.contentTitle = course.contents[0].title
        this.contentType = course.contents[0].contentType
        this.contentURL = course.contents[0].imageURL
      }
    },
    closeDialog() {
      this.dialog = false

      this.id = ''
      this.title = ''
      this.description = ''
      this.thumbnail = ''
      this.content = 0
      this.level = ''
      this.contentTitle = ''
      this.contentType = ''
      this.contentURL = ''
    },
    async saveCourse() {
      const course: any = {
        id: this.id,
        title: this.title,
        description: this.description,
        thumbnailURL: this.thumbnail,
        contentInHours: +this.content,
        level: this.level,
        contents: [
          {
            title: this.contentTitle,
            contentType: this.contentType,
            imageURL: this.contentURL
          }
        ]
      }

      try {
        if (this.id) {
          const { data } = await this.$axios.put(`/courses/${this.id}`, course)

          this.$emit('editedCourse', data)
        } else {
          const { data } = await this.$axios.post('/courses', course)

          this.$emit('savedCourse', data)
        }
      } catch (e: any) {
        const error: IErrorResponse = e.response.data

        this.$toast.error(error.description)
      }
    }
  }
}
</script>
