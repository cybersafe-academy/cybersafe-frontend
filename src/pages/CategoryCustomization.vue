<template>
  <div class="tableContent">
    <v-card>
      <v-card-text>
        <p
          style="margin-bottom: 70px; max-width: none !important"
          class="text-h5 text-center"
        >
          {{ $t('CONTENT_CUSTOMIZATION') }}
        </p>

        <div class="d-flex flex-column align-center">
          <v-select
            v-if="userRole === 'master'"
            class="input"
            :label="$t('COMPANY')"
            v-model="selectedCompany"
            :items="companies"
            item-title="tradeName"
            return-object
          />

          <v-select
            v-if="selectedCompany.id || companyID"
            class="input"
            :label="$t('PERSONALITY')"
            v-model="selectedPersonality"
            :items="personalities"
          />

          <div
            v-if="selectedPersonality"
            class="d-flex flex-column align-center"
          >
            <p class="text-h5 mb-4" style="max-width: none !important">
              {{ $t('PERSONALITY_CATEGORIES', { mbti: selectedPersonality }) }}
            </p>
            <v-card class="w-100" style="overflow-y: auto; max-height: 300px">
              <v-card-text class="d-flex flex-column align-center">
                <div>
                  <div
                    class="flex-column align-center"
                    :class="{ 'd-flex': !personalityCategories.length }"
                    style="padding: 0 20px 0 20px"
                  >
                    <div class="d-flex flex-end mb-6">
                      <v-icon
                        v-if="availableCategories.length"
                        style="
                          background-color: green;
                          color: white;
                          width: 30px;
                          height: 30px;
                          margin-left: auto;
                          border-radius: 50%;
                        "
                        @click="dialog = true"
                        >mdi-plus</v-icon
                      >
                    </div>
                    <template
                      v-for="(category, i) in personalitiesCategories[
                        selectedPersonality
                      ]"
                    >
                      <div style="margin-bottom: 30px">
                        <div class="d-flex align-center pa-2">
                          <p
                            class="text-h6"
                            style="min-width: 200px; margin-right: 100px"
                          >
                            {{ category.name }}
                          </p>
                          <v-icon color="red" @click="removeCategory(i)"
                            >mdi-trash-can</v-icon
                          >
                        </div>
                        <v-divider class="border-opacity-100"></v-divider>
                      </div>
                    </template>
                  </div>
                  <p v-if="!personalityCategories.length" class="text-h6 mt-6">
                    {{ $t('NO_CATEGORIES_SELECTED') }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <v-dialog v-model="dialog" width="auto">
          <v-card>
            <v-card-text class="pa-4">
              <v-select
                multiple
                v-model="selectedCategories"
                class="dropdown mb-6"
                :label="$t('CATEGORIES')"
                :items="availableCategories"
                item-title="name"
                return-object
                hide-details
              />
              <div class="w-100 d-flex justify-end">
                <v-btn
                  :disabled="!selectedCategories.length"
                  color="success"
                  @click="addCategory"
                  >{{ $t('ADD') }}</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>

        <div class="w-100 d-flex justify-end mt-12">
          <v-btn
            :disabled="!selectedPersonality"
            color="success"
            @click="saveCategories"
            >{{ $t('SAVE') }}</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import type { IErrorResponse } from '@/types/errors'

import { useAuthStore } from '@/stores/auth'

export default {
  data: () => {
    return {
      selectedPersonality: '',
      dialog: false,
      allCategories: [],
      selectedCategories: [],
      personalitiesCategories: {
        ISTJ: [],
        ISFJ: [],
        INFJ: [],
        INTJ: [],
        ISTP: [],
        ISFP: [],
        INFP: [],
        INTP: [],
        ESTP: [],
        ESFP: [],
        ENFP: [],
        ENTP: [],
        ESTJ: [],
        ESFJ: [],
        ENFJ: [],
        ENTJ: []
      } as any,
      companyID: '',
      userRole: '',
      selectedCompany: {
        id: '',
        tradeName: ''
      },
      companies: []
    }
  },

  watch: {
    selectedPersonality: function (value: string) {
      if (value) this.loadCategories()
    }
  },

  created: async function () {
    try {
      const response = await this.$axios.get('/courses/categories')
      this.allCategories = response.data.data
    } catch (e: any) {
      const error: IErrorResponse = e.response.data.error
      this.$toast.error(error.description)
    }

    const authStore = useAuthStore()
    this.companyID = authStore.companyID
    this.userRole = authStore.role

    if (this.userRole === 'master') {
      try {
        const response = await this.$axios.get('/companies')
        this.companies = response.data.data ?? []
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error
        this.$toast.error(error.description)
      }
    }
  },

  computed: {
    personalities: function () {
      return Object.keys(this.personalitiesCategories)
    },

    personalityCategories: function () {
      return (
        (this.personalitiesCategories as any)[this.selectedPersonality] ?? []
      )
    },

    availableCategories: function () {
      return this.allCategories.filter(
        (category) =>
          !this.personalityCategories.find(
            (personalityCategory) => personalityCategory.id === category.id
          )
      )
    }
  },

  methods: {
    addCategory() {
      this.personalityCategories.push(...this.selectedCategories)
      this.dialog = false
      this.selectedCategories = []
    },

    removeCategory(index: number) {
      this.personalityCategories.splice(index, 1)
    },

    async loadCategories() {
      try {
        if (this.userRole === 'master') {
          this.companyID = this.selectedCompany.id
        }

        const { data } = await this.$axios.get(
          `/companies/${this.companyID}/content-recommendations/${this.selectedPersonality}`
        )

        const categories = data?.categories ?? []

        this.personalitiesCategories[this.selectedPersonality] = categories
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error
        this.$toast.error(error.description)
      }
    },

    async saveCategories() {
      const categories = this.personalityCategories.map(
        (category) => category.id
      )

      if (!categories.length) {
        this.$toast.error('Please select at least one category')
        return
      }

      if (this.userRole === 'master') {
        this.companyID = this.selectedCompany.id
      }

      try {
        await this.$axios.put(
          `/companies/${this.companyID}/content-recommendations`,
          {
            mbtiType: this.selectedPersonality,
            companyID: this.companyID,
            categories
          }
        )

        this.$toast.success('Categories saved successfully')

        this.selectedPersonality = ''
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error
        this.$toast.error(error.description)
      }
    }
  }
}
</script>

<style scoped>
.tableContent {
  overflow-y: scroll;
  display: block;
}

.tableContent > .v-card {
  width: 600px;
  margin: auto;
}

.input {
  width: 500px;
  max-height: 20px;
  margin-bottom: 100px;
}

.dropdown {
  width: 300px;
}
</style>
