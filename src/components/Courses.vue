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
          @click:append-inner="loadCourses"
        />
      </v-col>
    </v-row>
    <v-row class="mt-12">
      <v-col>
        <v-row class='mb-12' v-for="(category, i) in categories" :key="i">
          <p class="text-h5 mb-6">
            {{category.name}}
          </p>
          <v-carousel
            height="auto"
            hide-delimiter-background
            show-arrows="hover"
            hide-delimiters
          >
            <v-carousel-item
              v-for="(coursesPage, j) in category.coursesPages"
              :key="j"
            >
              <div class="d-flex">
                <div class='course-card' v-for="(course, k) in coursesPage.courses" :key="k">
                  <img class='course-thumbnail' :src="course.thumbnailUrl" alt="">
                  <p class="text-h6">{{course.title}}</p>
                  <span class="d-flex">
                    <b class="mr-1" style="color: #b4761a">{{course.avg_rating.toFixed(1)}}</b>
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
  data: () => ({
    loadedCourses: false,
    loadingCourses: false,
    categories: [
      {
        name: "Segurança de dados",
        coursesPages: [
          {
            page: 1, 
            courses: [
              {avg_rating: 2.5, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
            ]
          },
          {
            page: 2, 
            courses: [
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
            ]
          }
        ]
      },
      {
        name: "Segurança de redes",
        coursesPages: [
          {
            page: 1, 
            courses: [
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
            ]
          },
          {
            page: 2, 
            courses: [
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
              {avg_rating: 2, thumbnailUrl: "https://img-b.udemycdn.com/course/240x135/1701388_0134.jpg", title: "Curso de java"},
            ]
          }
        ]
      },
    ]
  }),

  methods: {
    loadCourses () {
      this.loadingCourses = true

      setTimeout(() => {
        this.loadingCourses = false
        this.loadedCourses = true
      }, 2000)
    },
  },
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    overflow-y: auto;
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
