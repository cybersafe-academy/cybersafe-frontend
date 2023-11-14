<template>
  <v-container class="ml-5 mt-4 ma-0 mb-6">
    <v-row>
      <div>
        <img
          class="profile-picture"
          :src="
            review.user.profilePictureURL !== ''
              ? review.user.profilePictureURL
              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
          "
        />
      </div>
      <div class="d-flex flex-column pl-9">
        <p class="text-h6">{{ review.user.name }}</p>
        <v-rating
          class="rating d-flex align-center mt-2"
          style="margin-left: -6px"
          color="orange-lighten-1"
          half-increments
          v-model="review.rating"
          readonly
          density="compact"
        />
        <p class="mt-3">{{ review.comment }}</p>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  props: {
    review: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.profile-picture {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
