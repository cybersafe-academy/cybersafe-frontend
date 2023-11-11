<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createUserDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> Pre Signup a new user </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
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
                  :items="roleOptions"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedCompany"
                  label="Company"
                  variant="solo"
                  required
                  :items="companies"
                  item-title="legalName"
                  return-object
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeDialog"> Close </v-btn>
          <v-btn class="saveUserBtn" @click="saveUser"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'

import type { IErrorResponse } from '@/types/errors'

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
    email: '',
    role: '',
    companies: [] as any,
    selectedCompany: {
      id: '',
      legalName: ''
    } as any
  }),

  async created() {
    try {
      const { data } = await this.$axios.get('/companies')

      this.companies = data.data
    } catch (e: any) {
      const error: IErrorResponse = e.response.data.error

      this.$toast.error(error.description)
    }
  },

  computed: {
    roleOptions() {
      const authStore = useAuthStore()

      if (authStore.role === 'master') {
        return ['default', 'admin', 'master']
      } else {
        return ['default', 'admin']
      }
    }
  },

  methods: {
    openDialog(user: any) {
      this.dialog = true

      if (user) {
        this.id = user.id
        this.email = user.Email
        this.role = user.Role
      }
    },

    closeDialog() {
      this.dialog = false

      this.id = ''
      this.email = ''
      this.role = ''
      this.companies = []
      this.selectedCompany = {
        id: '',
        legalName: ''
      }
    },

    verifyFields() {
      if (!this.email || !this.role) {
        this.$toast.error('Please fill all the fields')

        return false
      }

      return true
    },

    async saveUser() {
      if (!this.verifyFields()) return

      const user: any = {
        email: this.email,
        role: this.role,
        companyID: this.selectedCompany.id
      }

      try {
        await this.$axios.post('/users/pre-signup', user)

        this.closeDialog()

        this.$toast.success('Pre signedup user successfully')

        this.$emit('preSignedUpUSer', user)
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

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

.saveUserBtn {
  background-color: #4caf50 !important;
  color: #fff !important;
}
</style>
