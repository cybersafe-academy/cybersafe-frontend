<template>
  <v-dialog v-model="dialog" persistent width="1024">
    <div class="createCourseDialog">
      <v-card>
        <v-card-title class="text-center">
          <span> Create a new company </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="cnpj"
                  label="CNPJ"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="email"
                  label="Email"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="legalName"
                  label="Legal Name"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="phone"
                  label="Phone"
                  variant="solo"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="tradeName"
                  label="Trade Name"
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
          <v-btn class="saveCompanyBtn" @click="saveCompany"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script lang="ts">
import type { ICompany } from '@/types/company'
import type { IErrorResponse } from '@/types/errors'

export default {
  name: 'CreateCompanyComponent',

  props: {
    company: {
      type: Object,
      default: () => null
    }
  },

  data: () => ({
    dialog: false,
    id: '',
    cnpj: '',
    email: '',
    legalName: '',
    phone: '',
    tradeName: ''
  }),

  methods: {
    openDialog(company: any) {
      this.dialog = true

      if (company) {
        this.id = company.id
        this.cnpj = company.cnpj
        this.email = company.email
        this.legalName = company.legalName
        this.phone = company.phone
        this.tradeName = company.tradeName
      }
    },
    closeDialog() {
      this.dialog = false

      this.id = ''
      this.cnpj = ''
      this.email = ''
      this.legalName = ''
      this.phone = ''
      this.tradeName = ''
    },
    verifyFields() {
      if (
        !this.cnpj ||
        !this.email ||
        !this.legalName ||
        !this.phone ||
        !this.tradeName
      ) {
        this.$toast.error('Please fill all the fields')

        return false
      }

      return true
    },
    async saveCompany() {
      if (!this.verifyFields()) return

      const company: ICompany = {
        cnpj: this.cnpj,
        email: this.email,
        legalName: this.legalName,
        phone: this.phone,
        tradeName: this.tradeName
      }

      try {
        if (this.id) {
          const { data } = await this.$axios.put(
            `/companies/${this.id}`,
            company
          )

          this.closeDialog()

          this.$toast.success('Company updated successfully')

          this.$emit('editedCompany', data)
        } else {
          const { data } = await this.$axios.post('/companies', company)

          this.closeDialog()

          this.$toast.success('Company created successfully')

          this.$emit('savedCompany', data)
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

.saveCompanyBtn {
  background-color: #4caf50 !important;
  color: #fff !important;
}
</style>
