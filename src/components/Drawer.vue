<template>
  <v-layout>
    <v-navigation-drawer
      style="position: relative !important"
      expand-on-hover
      rail
      width="400"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-account-circle"
          :title="userName"
          :subtitle="userEmail"
          class="pointer"
          @click="openProfile"
        />

        <v-divider />

        <v-list-item
          prepend-icon="mdi-list-box"
          title="Courses"
          value="courses"
          link
          @click="emitPage('courses')"
        />

        <v-list-item
          prepend-icon="mdi-alert-box"
          title="Spans"
          value="spans"
          link
          @click="emitPage('spans')"
        />

        <v-divider />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          color="red"
          link
          @click="logout"
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

    if (!authStore.isLogged) {
      this.$router.push('/login')
    }

    this.userName = authStore.name || ''
    this.userEmail = authStore.email || ''
  },

  methods: {
    async openProfile() {
      console.log('open profile')
    },
    emitPage(page: string) {
      this.$emit('changePage', page)
    },
    async logout() {
      const authStore = useAuthStore()

      if (authStore.accessToken) {
        await this.$axios.post('/auth/logoff')

        authStore.logout()
      }

      this.$router.push('/login')
    }
  }
}
</script>
