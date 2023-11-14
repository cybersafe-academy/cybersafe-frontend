<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="editUserDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> Edit user </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="User Name"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="8">
                <v-file-input
                  clearable
                  label="Profile picture"
                  prepend-inner-icon="mdi-image"
                  prepend-icon=""
                  variant="solo"
                  bg-color="#f5f7f9"
                  accept="image/png, image/jpeg"
                  @change="handleProfilePicture"
                  required
                ></v-file-input>
              </v-col>
              <v-col cols="12" md="4" v-if="profilePicture">
                <v-img :src="profilePicture" width="35%" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :disabled="true"
                  v-model="email"
                  label="User Email"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="role"
                  label="Role"
                  variant="solo"
                  required
                  :items="['default', 'admin', 'master']"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="mbtiType"
                  label="MBTI"
                  variant="solo"
                  required
                  :items="mbtiOptions"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedCompany"
                  label="Company"
                  variant="solo"
                  required
                  :items="companies"
                  item-title="tradeName"
                  return-object
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="cpf"
                  label="User CPF"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="date"
                  v-model="birthDate"
                  label="User Birth Date"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeDialog"> Close </v-btn>
          <v-btn class="editUserBtn" :loading="isLoading" @click="editUser">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import type { IErrorResponse } from '@/types/errors'
import formatCPF from '@/utils/masks'

export default {
  props: {
    user: {
      type: Object,
      default: () => null
    }
  },

  data: () => ({
    dialog: false,
    id: '',
    name: '',
    email: '',
    role: '',
    mbtiType: '',
    companies: [] as any,
    selectedCompany: {
      id: '',
      tradeName: ''
    } as any,
    cpf: '',
    birthDate: '',
    profilePicture: null as any,
    profilePictureFile: null as any,
    isLoading: false,
    mbtiOptions: [
      'ISTJ',
      'ISFJ',
      'INFJ',
      'INTJ',
      'ISTP',
      'ISFP',
      'INFP',
      'INTP',
      'ESTP',
      'ESFP',
      'ENFP',
      'ENTP',
      'ESTJ',
      'ESFJ',
      'ENFJ',
      'ENTJ'
    ]
  }),

  methods: {
    async openDialog(user: any) {
      console.log(user)
      this.dialog = true

      await this.loadCompanies()

      if (user) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.role = user.role
        this.mbtiType = user.mbtiType
        this.cpf = formatCPF(user.cpf)
        this.birthDate = user.birthDate
        this.profilePicture = user.profilePictureURL
        this.selectedCompany = user.company
      }
    },
    closeDialog() {
      this.dialog = false
      this.isLoading = false

      this.id = ''
      this.name = ''
      this.email = ''
      this.role = ''
      this.mbtiType = ''
      this.cpf = ''
      this.birthDate = ''
      this.selectedCompany.id = ''
      this.companies = []
      this.profilePicture = null
      this.profilePictureFile = null
    },
    handleProfilePicture(e: any): void {
      this.profilePictureFile = e.target.files[0]
    },
    async convertToBase64(file: any): Promise<string> {
      if (!file) return ''

      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => resolve(reader.result as string)

        reader.onerror = (error) => reject(error)
      })
    },
    async loadCompanies() {
      try {
        const { data } = await this.$axios.get('/companies')

        this.companies = data.data
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    verifyFields() {
      if (!this.name || !this.role || !this.cpf || !this.birthDate) {
        this.$toast.error('Please fill all the fields')

        return false
      }

      return true
    },
    async editUser() {
      if (!this.verifyFields()) return

      this.isLoading = true

      const user: any = {
        id: this.id,
        name: this.name,
        email: this.email,
        role: this.role,
        cpf: this.cpf.replace(/\D/g, ''),
        birthdate: this.birthDate,
        profilePictureURL: await this.convertToBase64(this.profilePictureFile),
        companyID: this.selectedCompany.id,
        mbtiType: this.mbtiType
      }

      try {
        if (this.id) {
          const { data } = await this.$axios.put(`/users/${this.id}`, user)

          this.isLoading = false

          this.closeDialog()

          this.$toast.success('User updated successfully')

          this.$emit('editedUser', data)
        }
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.isLoading = false

        this.$toast.error(error.description)
      }
    }
  }
}
</script>

<style scoped>
.closeDialogBtn {
  background-color: #f44336 !important;
  color: #fff !important;
}

.editUserBtn {
  background-color: #4caf50 !important;
  color: #fff !important;
}
.editUserDialog {
  overflow-y: scroll;
}
</style>
