<template>
  <div class="tableContent">
    <v-row class="d-flex justify-center">
      <v-col cols="6">
        <v-text-field
          class="search-bar"
          v-model="filterInput"
          :loading="loadingCourses"
          density="compact"
          variant="solo"
          :label="$t('SEARCH_BY_TITLE')"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          @keydown="handleEnter"
          @click:append-inner="filterResults"
        />
      </v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <v-row
          class="mb-12"
          v-for="(category, i) in Object.keys(categories)"
          :key="i"
        >
          <p class="text-h5 mb-6">
            {{ category }}
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
                <div
                  class="course-card"
                  v-for="(course, k) in coursesPage.courses"
                  :key="k"
                  @click="openCourseView(course.id)"
                >
                  <img
                    class="course-thumbnail"
                    :src="course.thumbnailURL"
                    alt=""
                  />
                  <p
                    class="text-h6"
                    style="max-width: 300px; overflow-wrap: break-word"
                  >
                    {{ course.title }}
                  </p>
                  <span class="d-flex">
                    <b class="mr-1" style="color: #b4761a">{{
                      course.avgRating.toFixed(1)
                    }}</b>
                    <v-rating
                      class="rating d-flex align-center"
                      color="orange-lighten-1"
                      half-increments
                      v-model="course.avgRating"
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
    categories: {} as any,
    categoriesBackup: {} as any,
    filterInput: ''
  }),
  created: function () {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      this.loadingCourses = true

      const { data: categories } = await this.$axios.get('/courses')

      const isPortuguese = localStorage.getItem('language') === 'pt'

      for (const category in categories) {
        let page = 1
        const pageCourses: any[] = [{ page, courses: [] }]
        for (
          let courseIndex = 0;
          courseIndex < categories[category].length;
          courseIndex++
        ) {
          const course = categories[category][courseIndex]

          if (isPortuguese) {
            course.title = course.titlePtBr
            course.description = course.descriptionPtBr
          }
          pageCourses[page - 1].courses.push(course)
          if (courseIndex > 0 && courseIndex % 5 === 0) {
            page++
            pageCourses.push({ page, courses: [] })
          }
        }
        categories[category] = pageCourses
      }

      this.categories = categories
      this.categoriesBackup = JSON.stringify(categories)

      this.loadingCourses = false
      this.loadedCourses = true
    },
    openCourseView(courseId: string) {
      this.$emit('course-view-opened', courseId)
    },
    handleEnter(e) {
      if (e.key === 'Enter') {
        this.filterResults()
      }
    },
    filterResults() {
      this.categories = JSON.parse(this.categoriesBackup)

      Object.keys(this.categories).forEach((category) => {
        const coursesPage = this.categories[category]
        coursesPage.forEach((coursePage) => {
          coursePage.courses = coursePage.courses.filter((course) => {
            return course.title.indexOf(this.filterInput) !== -1
          })
          if (coursePage.courses.length === 0) {
            delete this.categories[category]
          }
        })
      })
    }
  }
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
  overflow-y: scroll;
  padding: 2rem;
}
.search-bar {
  width: 100%;
  border-bottom: 1px solid black;
}

.course-card {
  min-width: 200px;
  margin-right: 30px;
  overflow: hidden;
  cursor: pointer;
}

.course-thumbnail {
  width: 300px;
  border: 1px solid grey;
  border-radius: 10px;
}
.rating {
  overflow: hidden;
}

::v-deep .v-rating__item label {
  display: flex;
  align-items: center;
}
</style>
