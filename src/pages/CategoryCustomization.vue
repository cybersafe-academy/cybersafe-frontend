<template>
  <div class="tableContent">
    <p style="margin-bottom: 70px" class="text-h4 text-center">
      {{ $t('CONTENT_CUSTOMIZATION') }}
    </p>
    <v-select
      class="input"
      :label="$t('PERSONALITY')"
      v-model="selectedPersonality"
      :items="personalities"
    />

    <div v-if="selectedPersonality" class="d-flex flex-column align-center">
      <p class="text-h5 mb-12">
        {{ $t('PERSONALITY_CATEGORIES', { mbti: selectedPersonality }) }}
      </p>
      <v-card class="w-100" style="overflow-y: auto; max-height: 300px">
        <v-card-text class="d-flex flex-column align-center">
          <div>
            <div
              class="flex-column align-center"
              :class="{ 'd-flex': !personalityCategories.length }"
              style="padding: 3px"
            >
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
                      {{ category }}
                    </p>
                    <v-icon color="red" @click="removeCategory(i)"
                      >mdi-trash-can</v-icon
                    >
                  </div>
                  <v-divider class="border-opacity-100"></v-divider>
                </div>
              </template>

              <div class="d-flex flex-end">
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
                <v-dialog v-model="dialog" width="auto">
                  <v-card>
                    <v-card-text class="pa-4">
                      <v-select
                        v-key="i"
                        multiple
                        v-model="selectedCategories"
                        class="dropdown mb-6"
                        :label="$t('CATEGORIES')"
                        :items="availableCategories"
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
              </div>
              <p v-if="!personalityCategories.length" class="text-h6 mt-6">
                {{ $t('NO_CATEGORIES_SELECTED') }}
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="w-100 d-flex justify-end mt-3">
      <v-btn color="success" @click="saveCategories">{{ $t('SAVE') }}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data: () => {
    return {
      selectedPersonality: '',
      dialog: false,
      allCategories: ['Pentest', 'Xanega', 'A', 'B', 'C', 'D', 'E'],
      selectedCategories: [],
      personalitiesCategories: {
        INTJ: [],
        ENFP: []
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
        (category) => !this.personalityCategories.includes(category)
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
    saveCategories() {
      alert('Chamar backend')
    }
  }
}
</script>

<style scoped>
.center-column {
  width: 800px;
}

.input {
  width: 100%;
  max-height: 20px;
  margin-bottom: 100px;
}

.dropdown {
  width: 300px;
}
</style>
