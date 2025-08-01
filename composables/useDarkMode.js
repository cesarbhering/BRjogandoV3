import { ref, onMounted, watch, readonly } from 'vue'

const isDarkMode = ref(false)

export const useDarkMode = () => {
  // Initialize dark mode from localStorage
  const initializeDarkMode = () => {
    if (process.client) {
      const stored = localStorage.getItem('brjogando-dark-mode')
      if (stored !== null) {
        isDarkMode.value = JSON.parse(stored)
      } else {
        // Default to system preference
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyDarkMode()
    }
  }

  // Apply dark mode to document
  const applyDarkMode = () => {
    if (process.client) {
      const htmlElement = document.documentElement
      const bodyElement = document.body
      
      if (isDarkMode.value) {
        htmlElement.setAttribute('data-theme', 'dark')
        bodyElement.setAttribute('data-theme', 'dark')
      } else {
        htmlElement.removeAttribute('data-theme')
        bodyElement.removeAttribute('data-theme')
      }
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    if (process.client) {
      localStorage.setItem('brjogando-dark-mode', JSON.stringify(isDarkMode.value))
      applyDarkMode()
    }
  }

  // Watch for changes
  watch(isDarkMode, applyDarkMode)

  // Initialize on mount
  onMounted(() => {
    initializeDarkMode()
  })

  return {
    isDarkMode: readonly(isDarkMode),
    toggleDarkMode
  }
}