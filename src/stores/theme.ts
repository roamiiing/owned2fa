import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

const LOCAL_STORAGE_THEME_KEY = 'owned2fa-theme'
const DARK_THEME_CLASS = 'dark'

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export const useThemeStore = defineStore('layout/theme', () => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')

  const currentTheme = ref<Theme>(
    (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme) ??
      (darkThemeMq.matches ? Theme.Dark : Theme.Light),
  )

  const toggleCurrentTheme = () => {
    const themeToSet =
      currentTheme.value === Theme.Dark ? Theme.Light : Theme.Dark

    currentTheme.value = themeToSet
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, themeToSet)

    const html = document.querySelector('html')!

    if (themeToSet === Theme.Dark) {
      html.classList.add(DARK_THEME_CLASS)
    } else {
      html.classList.remove(DARK_THEME_CLASS)
    }
  }

  return {
    currentTheme: readonly(currentTheme),
    toggleCurrentTheme,
  }
})
