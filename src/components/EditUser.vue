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
                <v-text-field :disabled="true" v-model="Email" label="User Email" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="Role" label="Role" variant="solo" required :items="[
                  'default',
                  'admin',
                  'master',
                ]"></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="CPF" label="User CPF" variant="solo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field type="date" v-model="BirthDate" label="User Birth Date" variant="solo"
                  required></v-text-field>
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
import formatCPF from '@/utils/masks'
import dayjs from 'dayjs';

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
    Email: '',
    Role: '',
    CPF: '',
    BirthDate: ''
  }),

  methods: {
    openDialog(user: any) {
      this.dialog = true

      if (user) {

        const dateTime = dayjs(user.birthDate)
        var formattedDate = dateTime.format('YYYY-MM-DD');

        this.id = user.id
        this.Name = user.name
        this.Email = user.email
        this.Role = user.role
        this.CPF = formatCPF(user.cpf)
        this.BirthDate = formattedDate
      }
    },
    closeDialog() {
      this.dialog = false

      this.id = ''
      this.Name = ''
      this.Email = ''
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

      const dateTime = dayjs(this.BirthDate);
      const formattedDate = dateTime.format('YYYY-MM-DD');

      const user: any = {
        id: this.id,
        Name: this.Name,
        Email: this.Email,
        Role: this.Role,
        CPF: this.CPF.replace(/\D/g, ''),
        BirthDate: formattedDate
      }
      console.log(user)
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
