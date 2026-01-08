import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = ref(localStorage.getItem('user-theme') || 'theme-hello-kitty')

    function setTheme(theme) {
        currentTheme.value = theme
    }

    watch(currentTheme, (newTheme) => {
        localStorage.setItem('user-theme', newTheme)
        document.documentElement.className = newTheme
    }, { immediate: true })

    return { currentTheme, setTheme }
})
