<script setup>
import { RouterView } from 'vue-router'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import './assets/themes.css'
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <header class="p-3 d-flex justify-content-between align-items-center shadow-sm"
            style="background-color: var(--bs-header-bg); color: var(--bs-header-color); transition: background-color 0.3s;">
      <h1 class="h3 mb-0 fw-bold">Venta Web</h1>
      <ThemeSwitcher />
    </header>

    <main class="flex-grow-1 p-4">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global styles to use bootstrap variables */
body {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  transition: background-color 0.3s, color 0.3s;
}
</style>
