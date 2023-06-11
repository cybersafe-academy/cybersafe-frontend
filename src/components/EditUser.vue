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
                <v-text-field v-model="Name" label="User Name" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="Role" label="User Role" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="CPF" label="User CPF" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="BirthDate" label="User Birth Date" variant="solo" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="closeDialogBtn" @click="closeDialog"> Close </v-btn>
          <v-btn class="editUserBtn" @click="editUser"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
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
    Name: '',
    Role: '',
    CPF: '',
    BirthDate: ''
  }),

  methods: {
    openDialog(user: any) {
      this.dialog = true
      if (user) {
        this.id = user.id
        this.Name = user.Name
        this.Role = user.Role
        this.CPF = user.CPF
        this.BirthDate = user.BirthDate
      }
    },
    closeDialog() {
      this.dialog = false

      this.id = ''
      this.Name = ''
      this.Role = ''
      this.CPF = ''
      this.BirthDate = ''
    },
    verifyFields() {
      if (
        !this.Name ||
        !this.Role ||
        !this.CPF ||
        !this.BirthDate
      ) {
        this.$toast.error('Please fill all the fields')

        return false
      }

      return true
    },
    async editUser() {
      if (!this.verifyFields()) return

      const user: any = {
        id: this.id,
        Name: this.Name,
        Role: this.Role,
        CPF: this.CPF,
        BirthDate: this.BirthDate
      }

      try {
        if (this.id) {
          const { data } = await this.$axios.put(`/users/${this.id}`, user)

          this.closeDialog()

          this.$toast.success('User updated successfully')

          this.$emit('editedUser', data)
        }
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

.editUserBtn {
  background-color: #4caf50 !important;
  color: #fff !important;
}
</style>
