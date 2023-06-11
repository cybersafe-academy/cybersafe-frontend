<template>
  <div class="tableContent">
    <v-toolbar class="tableToolbar">
      <v-btn class="preSignUpBtn text-white" rounded="lg" @click="openCreateDialog">
        Pre-Signup User
      </v-btn>
    </v-toolbar>
    <v-table fixed-header hover class="userTable">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Role</th>
          <th class="text-center">Email</th>
          <th class="text-center">CPF</th>
          <th class="text-center">Birth Date</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.role }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.cpf }}</td>
          <td>{{ item.birthDate }}</td>
          <td class="actionsButtons">
            <v-btn text @click="openEditDialog(item.id)" class="editBtn">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn text @click="deleteUser(item.id)" class="deleteBtn">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <PreSignUpUser ref="PreSignUpUser" @preSignedUpUSer="addUser" />
    <EditUser ref="EditUser" @editedUser="addUser" />
  </div>
</template>

<script lang="ts">
import PreSignUpUser from '@/components/PreSignUpUser.vue'
import EditUser from '@/components/EditUser.vue'

import type { IErrorResponse } from '@/types/errors'
import parseDateFormatToString from '@/utils/date'
import formatCPF from '@/utils/masks'
import capitalizeString from '@/utils/string'


export default {
  name: 'UsersComponent',

  components: {
    PreSignUpUser,
    EditUser
  },

  async created() {
    await this.fetchUsers()
    this.parseUserData()
  },

  data() {
    return {
      users: Array<any>(),
      isLoading: false
    }
  },

  methods: {
    openCreateDialog(): void {
      ; (this.$refs.PreSignUpUser as any).openDialog()
    },
    openEditDialog(id: string): void {
      const user = this.users.find((user) => user.id === id)

        ; (this.$refs.EditUser as any).openDialog(user)
    },
    async addUser(userData: any) {
      if (!this.users) {
        this.users = []
      }
      this.users.push(userData)
    },
    async editUser(data: any) {
      const userIndex = this.users.findIndex(
        (user) => user.id === data.id
      )

      this.users[userIndex] = data
    },
    async deleteUser(id: string) {
      try {
        await this.$axios.delete(`/users/${id}`)
        this.users = this.users.filter((user) => user.id !== id)

        this.$toast.success('User deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchUsers() {
      try {
        const { data: users } = await this.$axios.get('/users')
        this.users = users.data

      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async parseUserData() {
      this.users = this.users.map(function (item) {

        const birthDateString = parseDateFormatToString(item.birthDate)
        const formattedCPF = formatCPF(item.cpf)
        const fomattedRole = capitalizeString(item.role)
        return {
          ...item,
          birthDate: birthDateString,
          cpf: formattedCPF,
          role: fomattedRole,
        }
      })
    }
  }
}


</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
}

.tableContent {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.userTable {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.tableToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: white;
}

.preSignUpBtn {
  font-size: 1rem;
  height: 3rem;
  width: 13rem;
  background-color: rgb(62, 120, 252);
}

.actionsButtons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.editBtn {
  color: lightgray;
  background-color: orange;
  margin-right: 0.5rem;
}

.deleteBtn {
  color: lightgray;
  background-color: red;
}
</style>
