<template>
  <div class="tableContent">
    <v-row>
      <v-col>
        <v-text-field
          class="search-bar"
          :loading="loadingCourses"
          density="compact"
          variant="solo"
          label="Search Courses"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          @click:append-inner="loadCategories"
        />
      </v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <v-row class='mb-12' v-for="(category, i) in Object.keys(categories)" :key="i">
          <p class="text-h5 mb-6">
            {{category}}
          </p>
          <v-carousel
            height="auto"
            hide-delimiter-background
            show-arrows="hover"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(coursesPage, j) in (categories[category] as any)"
              :key="j"
            >
              <div class="d-flex">
                <div class='course-card' v-for="(course, k) in coursesPage.courses" :key="k" @click="openCourseView(course.course_id)">
                  <img class='course-thumbnail' :src="course.thumbnailURL" alt="">
                  <p class="text-h6">{{course.title}}</p>
                  <span class="d-flex">
                    <b class="mr-1" style="color: #b4761a">{{course.avgRating.toFixed(1)}}</b>
                    <v-rating
                      class="rating d-flex align-center"
                      color="orange-lighten-1"
                      half-increments
                      v-model="course.avg_rating"
                      readonly
                      density="compact"
                      size="small"
                    />
                  </span>
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
  name: 'CoursesComponent',

  data: () => ({
    loadedCourses: false,
    loadingCourses: false,
    categories: {
    } as any,
  }),
  created: function () {
    this.loadCategories()
  },
  methods: {
    async loadCategories () {
      this.loadingCourses = true

      const {data: categories} = await this.$axios.get("/courses")

      for (const category in categories) {
        let page = 1;
        const pageCourses: any[] = [{page, courses: []}];
        for (let courseIndex = 0; courseIndex < categories[category].length; courseIndex++) {
          const course = categories[category][courseIndex];
          pageCourses[page - 1].courses.push(course)
          if (courseIndex > 0 && courseIndex % 5 === 0) {
            page++
            pageCourses.push({page, courses: []})
          }
        }
        categories[category] = pageCourses
      }

      this.categories = categories;

      this.loadingCourses = false
      this.loadedCourses = true
    },
    openCourseView (courseId: string) {
      this.$emit('course-view-opened', courseId)
    }
  },
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  .tableContent {
    width: 100%;
    height: 100%;
    padding: 2rem;
  }
  .search-bar {
    width: 600px;
  }

  .course-card {
    min-width: 200px;
    margin-right: 30px;
    overflow: hidden;
    cursor: pointer;
  }

  .course-thumbnail {
    width: 100%;
    border: 1px solid grey;
  }
  .rating {
    overflow: hidden;
  }

  ::v-deep .v-rating__item label {
    display: flex;
    align-items: center;
  }

</style>
