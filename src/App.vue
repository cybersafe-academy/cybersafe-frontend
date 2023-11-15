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
* {
  scrollbar-color: var(--alternate-background) var(--divider);
}

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
  --divider: #393646;
  --background: #4f4557;
  --inputs: #4f4557;
  --general: #35393f;
  --alternate-background: #6d5d6e;
  --green: #285430;
  --red: #801a1a;
  --question-background: #6d5d6e;
  --alternative-hover: #363342;
  --alternative-selected: #4f4557;
}

:root {
  --text: black;
  --divider: #ffefef;
  --background: rgb(177, 162, 162);
  --inputs: rgb(216, 206, 206);
  --general: rgb(233, 233, 233);
  --alternate-background: #ced9e0;
  --green: #4caf50;
  --red: #f44336;
  --question-background: #beb4be;
  --alternative-hover: #d6d3d3;
  --alternative-selected: #d6d6d6;
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
.v-table,
table,
tr,
td,
th,
thead,
ul {
  background-color: var(--divider) !important;
  color: var(--text) !important;
}

.v-tab {
  color: var(--text) !important;
}

.v-btn__content {
  font-family: 'Inter';
}

.v-field:not(.input-container .v-field) {
  background-color: var(--inputs) !important;
  color: var(--text) !important;
}

.closeDialogBtn {
  background-color: var(--red) !important;
  color: white !important;
}

.v-toast__item--warning p {
  color: black !important;
}

.saveCourseBtn,
.saveUserBtn,
.saveCompanyBtn,
.editUserBtn {
  background-color: var(--green) !important;
  color: white !important;
}

.save textarea {
  color: white;
}

p {
  color: var(--text);
  overflow-wrap: break-word !important;
  max-width: 300px !important;
}

@font-face {
  font-family: 'Inter';
  src: url(../public/fonts/Inter-Regular.ttf) format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
