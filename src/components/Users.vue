<template>
  <div class="tableContent">
    <v-toolbar class="tableToolbar">
      <v-btn
        class="preSignUpBtn text-white"
        rounded="lg"
        @click="openCreateDialog"
      >
        {{ $t('PRE_SIGNUP_USER') }}
      </v-btn>
    </v-toolbar>
    <v-table ref="itemTable" fixed-header hover class="userTable">
      <template v-if="users.length > 0">
        <thead>
          <tr>
            <th class="text-left">{{ $t('NAME') }}</th>
            <th class="text-left">{{ $t('ROLE') }}</th>
            <th class="text-left">{{ $t('EMAIL') }}</th>
            <th class="text-left">{{ $t('CPF') }}</th>
            <th class="text-left">{{ $t('BIRTH_DATE') }}</th>
            <th class="text-left">{{ $t('ACTIONS') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageUsers[currentPage]" :key="item.id">
            <td>
              <p>{{ item.name }}</p>
            </td>
            <td>
              <p>{{ item.role }}</p>
            </td>
            <td>
              <p class="email-p">{{ item.email }}</p>
            </td>
            <td>
              <p>{{ formatCPF(item.cpf) }}</p>
            </td>
            <td>
              <p>
                {{
                  item.birthDate !== '0000-12-31'
                    ? dayjs(item.birthDate).format('DD/MM/YYYY')
                    : ''
                }}
              </p>
            </td>
            <td class="actionsButtons">
              <div class="d-flex justify-center" style="margin: 0 auto 0 auto">
                <v-btn text @click="openEditDialog(item.id)" class="editBtn">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  text
                  @click="openDeleteDialog(item.id)"
                  class="deleteBtn"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <th class="text-left">{{ $t('NAME') }}</th>
            <th class="text-left">{{ $t('ROLE') }}</th>
            <th class="text-left">{{ $t('EMAIL') }}</th>
            <th class="text-left">{{ $t('CPF') }}</th>
            <th class="text-left">{{ $t('BIRTH_DATE') }}</th>
            <th class="text-left">{{ $t('ACTIONS') }}</th>
          </tr>
          <tr>
            <td :colspan="6" style="text-align: center; padding: 20px">
              <h2>{{ $t('NO_USERS_REGISTERED_YET') }}</h2>
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
      this.root.style.setProperty('--name-string', `'${this.$t('NAME')}'`)
      this.root.style.setProperty('--role-string', `'${this.$t('ROLE')}'`)
      this.root.style.setProperty('--email-string', `'${this.$t('EMAIL')}'`)
      this.root.style.setProperty('--cpf-string', `'${this.$t('CPF')}'`)
      this.root.style.setProperty(
        '--birth-string',
        `'${this.$t('BIRTH_DATE')}'`
      )
      this.root.style.setProperty('--actions-string', `'${this.$t('ACTIONS')}'`)

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
      numberOfItemsToFetch: 0,
      root: document.documentElement
    }
  },

  computed: {
    pageUsers() {
      const users: any = this.pageUsers ?? {}
      const offset = (this.currentPage - 1) * this.numberOfItemsToFetch
      if (this.users.length > 0) {
        users[this.currentPage] = this.users.slice(
          offset,
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

        const numberOfUsersInCurrentPage =
          this.users.length % this.numberOfItemsToFetch
        if (numberOfUsersInCurrentPage === 1) {
          this.currentPage--
          this.totalPages--
        }
        this.users = this.users.filter((user) => user.id !== id)

        this.$toast.success(this.$t('USER_DELETED_SUCCESSFULLY'))
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchUsers(page: number) {
      if (!this.pageUsers[page]) {
        try {
          const { data: users } = await this.$axios.get('/users', {
            params: {
              page,
              limit: this.numberOfItemsToFetch
            }
          })
          if (users.data) {
            this.totalPages = users.totalPages
            this.numberOfnewElements = users.data.length
            this.users.push(...users.data)
          }
        } catch (e: any) {
          const error: IErrorResponse = e.response.data.error

          this.$toast.error(error.description)
        }
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
}

.tableContent {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.userTable {
  border-radius: 4px;
  height: 80%;
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

.editBtn {
  color: lightgray;
  background-color: orange;
  margin-right: 0.5rem;
}

.deleteBtn {
  color: lightgray;
  background-color: red;
}

td {
  text-align: center;
  vertical-align: middle;
}

td > p {
  width: 200px;
  overflow-wrap: break-word;
  margin: 0 auto 0 auto;
}

.email-p {
  width: 300px !important;
}

.text-left {
  text-align: center !important;
}

@media only screen and (max-width: 1100px) {
  .tableContent {
    overflow-y: scroll;
    display: block;
  }

  .tableToolbar {
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 30px;
  }

  .addCourseBtn {
    margin: 0 !important;
  }

  .addCourseBtn:nth-child(1) {
    margin-right: 10px !important;
  }

  .v-table {
    overflow-y: hidden;
    height: auto;
  }

  .actionsButtons {
    margin: 0 !important;
    display: flex;
  }

  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  td {
    border: none;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding: 30px 20px 30px 20px !important;
    overflow-y: hidden;
    width: 100% !important;
  }

  tr:nth-of-type(odd) td {
    background-color: var(--alternate-background) !important;
  }

  td:before {
    text-align: start;
    width: 100px;
  }

  td:nth-of-type(1):before {
    content: var(--name-string);
  }

  td:nth-of-type(2):before {
    content: var(--role-string);
  }

  td:nth-of-type(3):before {
    content: var(--email-string);
  }

  td:nth-of-type(4):before {
    content: var(--cpf-string);
  }

  td:nth-of-type(5):before {
    content: var(--birth-string);
  }

  td:nth-of-type(6):before {
    content: var(--actions-string);
  }
}
</style>
