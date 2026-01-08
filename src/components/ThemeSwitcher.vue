<script setup>
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const themes = [
  { value: 'theme-hello-kitty', label: 'Hello Kitty 🎀' },
  { value: 'theme-aot', label: 'Attack on Titan ⚔️' },
  { value: 'theme-dark', label: 'Dark Mode 🌙' }
]
</script>

<template>
  <div class="dropdown">
    <button
      class="btn dropdown-toggle"
      style="color: var(--bs-header-color); border-color: var(--bs-header-color);"
      type="button"
      id="themeDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Tema
    </button>
    <ul class="dropdown-menu" aria-labelledby="themeDropdown">
      <li v-for="theme in themes" :key="theme.value">
        <button
          class="dropdown-item"
          :class="{ active: themeStore.currentTheme === theme.value }"
          @click="themeStore.setTheme(theme.value)"
        >
          {{ theme.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
