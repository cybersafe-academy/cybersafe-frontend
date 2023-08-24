<template>
  <v-layout>
    <v-navigation-drawer rail expand-on-hover width="400" class="navigation-drawer">
      <v-list>
        <v-list-item prepend-icon="mdi-account-circle" :title="userName" :subtitle="userEmail" class="pointer"
          @click="openProfile" />
        <v-divider />

        <template v-if="role !== 'default'">
          <v-list-item prepend-icon="mdi-list-box" title="Gerenciar Cursos" value="courses-management" link @click="emitPage('courses-management')" />
          <v-list-item v-if="role === 'master'" prepend-icon="mdi-badge-account-horizontal" title="Users" value="users" link @click="emitPage('users')" />
          <v-list-item v-if="role === 'master'" prepend-icon="mdi-briefcase" title="Companies" value="companies" link @click="emitPage('companies')" />
        </template>
      
        <v-list-item prepend-icon="mdi-list-box" title="Cursos" value="courses" link @click="emitPage('courses')" />

      </v-list>
      <template v-slot:append>
        <v-list-item prepend-icon="mdi-logout" title="Logout" link @click="logout" />
      </template>
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
      userEmail: '',
    }
  },
  
  computed: {
    role() {
      const authStore = useAuthStore()

      return authStore.role || ''
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
    emitPage(page: string) {
      this.$emit('changePage', page)
    },

    async openProfile() {
      console.log('open profile')
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

<style>
.navigation-drawer {
  position: relative !important;
  border-radius: 0 16px 16px 0;
  border: none;
  padding-bottom: 15px;
}
</style>
