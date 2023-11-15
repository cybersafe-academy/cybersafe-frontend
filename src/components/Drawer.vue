<template>
  <div v-if="showBlurry" class="blurry-filter"></div>
  <v-icon class="hamburguer" size="large" @click="openDrawer">mdi-menu</v-icon>
  <v-layout>
    <v-navigation-drawer
      :key="key"
      rail
      expand-on-hover
      permanent
      width="320"
      class="navigation-drawer"
      :class="{
        'show-drawer': showDrawer
      }"
      @update:rail="teste"
      disable-resize-watcher
    >
      <v-list class="pa-0">
        <v-list-item
          :prepend-avatar="
            userProfilePicture
              ? userProfilePicture
              : '../../public/images/blank-profile.png'
          "
          :title="userName"
          :subtitle="userEmail"
          class="pointer py-3"
          @click="openPreferences"
        />
        <v-divider />

        <template v-if="role !== 'default'">
          <v-list-item
            prepend-icon="mdi-list-box"
            :title="$t('MANAGE_COURSES')"
            value="courses-management"
            link
            @click="emitPage('courses-management')"
          />
          <v-list-item
            v-if="role === 'master'"
            prepend-icon="mdi-badge-account-horizontal"
            :title="$t('MANAGE_USERS')"
            value="users"
            link
            @click="emitPage('users')"
          />
          <v-list-item
            v-if="role === 'master'"
            prepend-icon="mdi-briefcase"
            :title="$t('MANAGE_COMPANIES')"
            value="companies"
            link
            @click="emitPage('companies')"
          />
        </template>

        <v-list-item
          v-if="role !== 'default'"
          prepend-icon="mdi-pencil-ruler"
          :title="$t('CONTENT_CUSTOMIZATION')"
          value="category-customization"
          link
          @click="emitPage('category-customization')"
        />

        <v-list-item
          prepend-icon="mdi-television"
          :title="$t('COURSES')"
          value="courses"
          link
          @click="emitPage('courses')"
        />

        <v-list-item
          v-if="role === 'admin'"
          prepend-icon="mdi-list-box"
          :title="$t('ANALYTICS')"
          value="analytics"
          link
          @click="emitPage('analytics')"
        />
      </v-list>
      <template v-slot:append>
        <v-list-item
          prepend-icon="mdi-logout"
          :title="$t('LOGOUT')"
          link
          @click="logout"
        />
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
      userProfilePicture: '',
      showDrawer: false,
      key: 0,
      showBlurry: false
    }
  },

  emits: ['changePage'],

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
      authStore.logout()
    }

    this.userName = authStore.name || ''
    this.userEmail = authStore.email || ''
    this.userProfilePicture = authStore.profilePictureURL || ''
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },

  methods: {
    onResize() {
      if (window.innerWidth > 600) {
        this.key++
        this.showDrawer = false
      }
    },
    emitPage(page: string) {
      this.$emit('changePage', page)
    },

    openPreferences() {
      this.emitPage('user-preferences')
    },

    async logout() {
      const authStore = useAuthStore()

      if (authStore.accessToken) {
        await this.$axios.post('/auth/logoff')

        authStore.logout()
      }

      this.$router.push('/login')
    },

    openDrawer() {
      this.showDrawer = true
    },
    teste(e) {
      this.showDrawer = !e
      this.showBlurry = !e
    }
  }
}
</script>

<style>
.blurry-filter {
  position: absolute;
  width: 100vw;
  height: 100vw;
  z-index: 100;
  background-color: var(--background);
  opacity: 70%;
}

.v-list-item-subtitle {
  padding: 3px 0 3px 0;
}

.hamburguer {
  display: none;
  color: white;
  cursor: pointer;
}

.navigation-drawer {
  display: block;
  position: relative !important;
  border-radius: 0 16px 16px 0;
  border: none;
  padding-bottom: 15px;
  background-color: var(--divider);
  color: var(--text);
  position: absolute;
  min-height: 100vh;
}

.v-layout {
  position: absolute;
}

@media only screen and (max-width: 600px) {
  .tableContent {
    padding: 2rem !important;
    margin-left: 0 !important;
  }

  body {
    position: relative;
  }

  .navigation-drawer {
    display: none;
  }

  .show-drawer {
    display: block;
  }

  .hamburguer {
    display: block;
    position: absolute;
    padding: 10px;
    z-index: 1000;
  }
}
</style>
