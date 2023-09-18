<template>
  <div class="tableContent">
    <v-toolbar class="tableToolbar">
      <v-btn
        class="preSignUpBtn text-white"
        rounded="lg"
        @click="openCreateDialog"
      >
        {{$t('PRE_SIGNUP_USER')}}
      </v-btn>
    </v-toolbar>
    <v-table ref="itemTable" fixed-header hover class="userTable">
      <template v-if="users.length > 0">
        <thead>
          <tr>
            <th class="text-left">{{$t('NAME')}}</th>
            <th class="text-left">{{$t('ROLE')}}</th>
            <th class="text-left">{{$t('EMAIL')}}</th>
            <th class="text-left">{{$t('CPF')}}</th>
            <th class="text-left">{{$t('BIRTH_DATE')}}</th>
            <th class="text-left">{{$t('ACTIONS')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.email }}</td>
            <td>{{ formatCPF(item.cpf) }}</td>
            <td>
              {{
                dayjs(item.birthDate).isValid()
                  ? dayjs(item.birthDate).format('DD/MM/YYYY')
                  : ''
              }}
            </td>
            <td class="actionsButtons">
              <v-btn text @click="openEditDialog(item.id)" class="editBtn">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn text @click="openDeleteDialog(item.id)" class="deleteBtn">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <th class="text-left">{{$t('NAME')}}</th>
            <th class="text-left">{{$t('ROLE')}}</th>
            <th class="text-left">{{$t('EMAIL')}}</th>
            <th class="text-left">{{$t('CPF')}}</th>
            <th class="text-left">{{$t('BIRTH_DATE')}}</th>
            <th class="text-left">{{$t('ACTIONS')}}</th>
          </tr>
          <tr>
            <td :colspan="6" style="text-align: center; padding: 20px">
              <h2>{{$t('NO_USERS_REGISTERED_YET')}}</h2>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-slot:bottom>
        <v-pagination
          @update:modelValue="fetchUsers"
          :model-value="currentPage"
          :length="totalPages"
        ></v-pagination>
      </template>
    </v-table>
    <EditUser ref="EditUser" @editedUser="editUser" />
    <PreSignUpUser ref="PreSignUpUser" @preSignedUpUSer="addUser" />
    <DeleteItemConfirmation ref="deleteItem" @confirmed="deleteUser" />
  </div>
</template>

<script lang="ts">
import PreSignUpUser from '@/components/PreSignUpUser.vue'
import EditUser from '@/components/EditUser.vue'
import DeleteItemConfirmation from '@/components/DeleteItemConfirmation.vue'

import type { IErrorResponse } from '@/types/errors'
import formatCPF from '@/utils/masks'
import dayjs from 'dayjs'

export default {
  name: 'UsersComponent',

  components: {
    PreSignUpUser,
    EditUser,
    DeleteItemConfirmation
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$refs.itemTable) {
        this.numberOfItemsToFetch = Math.floor(
          (this.$refs.itemTable as any).$el.offsetHeight / 60
        )
      } else {
        this.numberOfItemsToFetch = 10
      }

      this.fetchUsers(1)
    })
  },

  data() {
    return {
      users: Array<any>(),
      isLoading: false,
      totalPages: 1,
      currentPage: 1,
      numberOfnewElements: 0,
      numberOfItemsToFetch: 0
    }
  },

  computed: {
    pageUsers() {
      const users: any = this.pageUsers ?? {}
      const offset = (this.currentPage - 1) * this.numberOfItemsToFetch
      if (this.users.length > 0) {
        users[this.currentPage] = this.users.slice(
          Math.min(this.users.length - this.numberOfnewElements, offset),
          offset + this.numberOfItemsToFetch
        )
      }
      return users
    }
  },

  methods: {
    openCreateDialog(): void {
      ;(this.$refs.PreSignUpUser as any).openDialog()
    },
    openEditDialog(id: string): void {
      const user = this.users.find((user) => user.id === id)
      ;(this.$refs.EditUser as any).openDialog(user)
    },
    openDeleteDialog(id: string): void {
      ;(this.$refs.deleteItem as any).openDialog(id)
    },
    async addUser(userData: any) {
      if (!this.users) {
        this.users = []
      }
      if (this.users.length > this.totalPages * this.numberOfItemsToFetch) {
        this.totalPages++
        this.currentPage = this.totalPages
      }
      this.users.push(userData)
    },
    async editUser(data: any) {
      const userIndex = this.users.findIndex((user) => user.id === data.id)

      this.users[userIndex] = data
    },
    async deleteUser(id: string) {
      try {
        await this.$axios.delete(`/users/${id}`)
        this.users = this.users.filter((user) => user.id !== id)
        if (this.users.length < this.totalPages * this.numberOfItemsToFetch) {
          if (this.totalPages === this.currentPage) {
            this.currentPage--
          }
          this.totalPages--
        }

        this.$toast.success('User deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchUsers(page: number) {
      try {
        const { data: users } = await this.$axios.get('/users')
        if (users.data) {
          this.totalPages = users.totalPages
          this.numberOfnewElements = users.data.length
          this.users.push(...users.data)
        }
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
      this.currentPage = page
    },
    formatCPF,
    dayjs
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
  border-radius: 4px;
  height: 90%;
}

.tableToolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background-color: transparent;
}

.preSignUpBtn {
  padding: 10px;
  font-size: 1rem;
  height: 3rem;
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
