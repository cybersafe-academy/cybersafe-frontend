<template>
  <v-layout>
    <v-navigation-drawer style="position: relative !important" expand-on-hover rail>
      <v-list>
        <!-- Clickable avatar -->
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <!-- Courses -->
        <v-list-item
          prepend-icon="mdi-book-open-variant"
          title="Courses"
          value="courses"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
export default {
  name: 'DrawerComponent'
}
</script>
