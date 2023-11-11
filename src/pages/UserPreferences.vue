<template>
  <div class="tableContent">
    <v-card>
      <v-card-text>
        <p class="text-h5 text-center mb-12">{{ $t('USER_PREFERENCES') }}</p>
        <div>
          <div>
            <v-avatar size="100">
              <img :src="userData.profilePictureURL" alt="Profile picture" />
            </v-avatar>
            <p class="text-h6 mb-2">{{ $t('PERSONAL_INFORMATION') }}</p>
            <p class="text-h6 mt-4">{{ userData?.name }}</p>
            <p class="text-h6 mt-4">{{ userData?.email }}</p>

            <p class="text-h6 mb-2">{{ $t('COMPANY_INFORMATION') }}</p>
            <p class="text-h6 mt-4">{{ userData.company?.legalName }}</p>
            <p class="text-h6 mt-4">{{ userData.company?.email }}</p>
          </div>

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

          <div>
            <p class="text-h6 mb-2">{{ $t('MBTI_TYPE') }}</p>
            <v-select
              v-model="selectedMbti"
              :items="mbtiTypes"
              :label="$t('SELECT_MBTI_TYPE')"
            ></v-select>
            <div v-if="userData.mbtiType">
              {{ $t('MBTI_TYPE_DESCRIPTION') }}: {{ userData.mbtiType }}
            </div>
            <div>
              {{ $t('MBTI_TEST') }}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScsi7ruAeJkqIAa40WPx0XlzWDRccPhSSX8MnboYIt7LajxFg/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'

import type { IUserData } from '@/types/user'
import type { IErrorResponse } from '@/types/errors'

export default {
  data() {
    return {
      lightMode: true,
      selectedLanguage: 'pt',
      userData: {} as IUserData,
      authStore: useAuthStore(),
      selectedMbti: '',
      mbtiTypes: [
        'INTJ',
        'INTP',
        'ENTJ',
        'ENTP',
        'INFJ',
        'INFP',
        'ENFJ',
        'ENFP',
        'ISTJ',
        'ISFJ',
        'ESTJ',
        'ESFJ',
        'ISTP',
        'ISFP',
        'ESTP',
        'ESFP'
      ]
    }
  },

  watch: {
    selectedLanguage() {
      this.changeLanguage()
    },

    selectedMbti() {
      if (this.selectedMbti == this.userData.mbtiType) return

      this.updateMbti()
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
    },

    updateMbti() {
      this.userData.mbtiType = this.selectedMbti
      this.sendMbtiType()
    },

    async sendMbtiType() {
      this.$axios
        .post('/users/personality-test', { mbtiType: this.selectedMbti })
        .then(() => {
          this.$toast.success('MBTI type updated successfully!')
        })
        .catch(() => {
          this.$toast.error('Error updating MBTI type')
        })
    }
  },

  mounted() {
    const theme = localStorage.getItem('theme') ?? 'light'
    this.lightMode = theme !== 'light'

    const language = localStorage.getItem('language') ?? 'pt'
    this.selectedLanguage = language
  },

  async created() {
    try {
      const { data } = await this.$axios.get('/users/me')

      this.userData = data
      this.selectedMbti = this.userData.mbtiType

      this.authStore.updateUserData(data)
    } catch (e: any) {
      const error: IErrorResponse = e.response.data.error

      this.$toast.error(error.description)
    }
  }
}
</script>

<style scoped></style>
