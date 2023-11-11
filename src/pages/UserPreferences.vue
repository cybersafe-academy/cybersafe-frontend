<template>
  <div class="tableContent">
    <v-card>
      <v-card-text>
        <p class="text-h5 text-center mb-12">{{ $t('USER_PREFERENCES') }}</p>
        <div>
          <div class="mb-6">
            <p class="text-h6 mb-2">{{ $t('DARK_MODE') }}</p>
            <v-switch
              color="primary"
              v-model="lightMode"
              hide-details
              inset
              @click="toggleDarkMode"
            />
          </div>

          <div>
            <p class="text-h6 mb-2">{{ $t('LANGUAGE') }}</p>
            <v-select
              v-model="selectedLanguage"
              :items="[
                { text: 'Português', value: 'pt' },
                { text: 'English', value: 'en' }
              ]"
              item-title="text"
              item-value="value"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      lightMode: true,
      selectedLanguage: 'pt'
    }
  },
  watch: {
    selectedLanguage() {
      this.changeLanguage()
    }
  },
  methods: {
    changeLanguage() {
      localStorage.setItem('language', this.selectedLanguage)
      this.$i18n.locale = this.selectedLanguage
    },
    toggleDarkMode() {
      const theme = this.lightMode ? 'light' : 'dark'

      document.body.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  },
  mounted() {
    const theme = localStorage.getItem('theme') ?? 'light'
    this.lightMode = theme !== 'light'

    const language = localStorage.getItem('language') ?? 'pt'
    this.selectedLanguage = language
  }
}
</script>

<style scoped></style>
