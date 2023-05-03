<template>
  <v-layout>
    <v-navigation-drawer
      style="position: relative !important"
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="userName"
          :subtitle="userEmail"
          class="pointer"
          @click="openProfile"
        />
      </v-list>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-book-open-variant"
          title="Courses"
          value="courses"
          link
          @click="emitPage('courses')"
        />

        <v-list-item
          prepend-icon="mdi-book-open-variant"
          title="Spans"
          value="spans"
          link
          @click="emitPage('spans')"
        />
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DrawerComponent',

  data() {
    return {
      userName: '',
      userEmail: ''
    }
  },

  async created() {
    const authStore = useAuthStore()

    this.userName = authStore.name || ''
    this.userEmail = authStore.email || ''
  },

  methods: {
    async openProfile() {
      console.log('open profile')
    },
    emitPage(page: string) {
      this.$emit('changePage', page)
    }
  }
}
</script>
