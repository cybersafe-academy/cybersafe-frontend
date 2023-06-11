<template>
  <div class="tableContent">
    <v-toolbar class="tableToolbar">
      <v-btn class="addBtn text-white" rounded="lg" @click="openCreateDialog">
        Add Company
      </v-btn>
    </v-toolbar>
    <v-table fixed-header hover class="companyTable">
      <template v-if="companies">
        <thead>
          <tr>
            <th class="text-left">Trade Name</th>
            <th class="text-left">CNPJ</th>
            <th class="text-left">Email</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in companies" :key="item.id">
            <td>{{ item.tradeName }}</td>
            <td>{{ item.cnpj }}</td>
            <td class="text-left">{{ item.email }}</td>
            <td class="actionsButtons">
              <v-btn text @click="openEditDialog(item.id)" class="editBtn">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn text @click="deleteCompany(item.id)" class="deleteBtn">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr>
            <th class="text-left">Trade Name</th>
            <th class="text-left">CNPJ</th>
            <th class="text-left">Email</th>
            <th class="text-center">Actions</th>
          </tr>
          <tr>
            <td :colspan="4" style="text-align: center; padding: 20px">
              <h2>No companies registered yet</h2>
            </td>
          </tr>
        </tbody>
      </template>
    </v-table>
    <CreateCompany
      ref="createCompany"
      @savedCompany="addCompany"
      @editedCompany="editCompany"
    />
  </div>
</template>

<script lang="ts">
import CreateCompany from '@/components/CreateCompany.vue'

import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'CompaniesComponent',

  components: {
    CreateCompany
  },

  async created() {
    this.fetchCompanies()
  },

  data() {
    return {
      companies: Array<any>(),
      isLoading: false
    }
  },

  methods: {
    openCreateDialog(): void {
      ;(this.$refs.createCompany as any).openDialog()
    },
    openEditDialog(id: string): void {
      const company = this.companies.find((company) => company.id === id)

      ;(this.$refs.createCompany as any).openDialog(company)
    },
    async addCompany(companyData: any) {
      if (!this.companies) {
        this.companies = []
      }

      this.companies.push(companyData)
    },
    async editCompany(data: any) {
      const companyIndex = this.companies.findIndex(
        (company) => company.id === data.id
      )

      this.companies[companyIndex] = data
    },
    async deleteCompany(id: string) {
      try {
        await this.$axios.delete(`/companies/${id}`)
        this.companies = this.companies.filter((company) => company.id !== id)

        this.$toast.success('Company deleted successfully')
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
    },
    async fetchCompanies() {
      try {
        const { data: companies } = await this.$axios.get('/companies')
        this.companies = companies.data
      } catch (e: any) {
        const error: IErrorResponse = e.response.data.error

        this.$toast.error(error.description)
      }
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

.companyTable {
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

.addBtn {
  font-size: 1rem;
  height: 3rem;
  width: 10rem;
  background-color: rgb(62, 120, 252);
  margin: 0 !important;
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
