<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script lang="ts">
export default {
  name: 'App',
  created() {
    const theme = localStorage.getItem('theme') ?? 'light'
    document.body.setAttribute('data-theme', theme)

    const language = localStorage.getItem('language')
    this.$i18n.locale = language
  }
}
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.v-toast {
  z-index: 9999 !important;
}

html,
body {
  overflow-y: hidden !important;
}

[data-theme='dark'] {
  --text: white;
  --divider: #1e2124;
  --background: #282b30;
  --inputs: #424549;
  --general: #35393f;
}

:root {
  --text: black;
  --divider: white;
  --background: #ecf0f1;
  --inputs: white;
  --general: white;
}

.tableContent {
  width: 100vw;
  height: 100vh;
  padding: 30px 70px 30px 70px !important;

  background-color: var(--background);
  margin-left: 56px !important;
}

.v-card,
.v-card-text,
.v-card-title,
.v-card-actions,
.v-col,
.v-row,
.v-tab {
  background-color: var(--background) !important;
  color: var(--text) !important;
}

.v-table,
table,
tr,
td,
th,
thead,
ul {
  background-color: var(--general) !important;
  color: var(--text) !important;
}

.v-field:not(.input-container .v-field) {
  background-color: var(--inputs) !important;
  color: var(--text) !important;
}

textarea {
  color: white;
}

p {
  color: var(--text);
}

@font-face {
  font-family: 'Inter';
  src: url(./assets/fonts/Inter-Regular.ttf) format('truetype');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'Inter' !important;
}
</style>
