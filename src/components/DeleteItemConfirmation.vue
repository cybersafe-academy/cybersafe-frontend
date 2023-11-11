<template>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card class="pa-6">
      <v-card-title class="text-center mb-3">
        <h3>{{ $t('SURE_DELETION') }}</h3>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-end">
          <v-btn @click="closeDialog" class="mr-3" color="grey">{{
            $t('CLOSE')
          }}</v-btn>
          <v-btn @click="confirmDeletion" color="red">{{ $t('DELETE') }}</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
export default {
  data: () => ({
    dialog: false,
    id: ''
  }),

  methods: {
    openDialog(id: string) {
      this.dialog = true
      this.id = id
    },
    closeDialog() {
      this.dialog = false
    },
    confirmDeletion() {
      this.$emit('confirmed', this.id)
      this.closeDialog()
    }
  }
}
</script>
