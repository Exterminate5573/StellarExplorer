import { init, register, getLocaleFromNavigator } from 'svelte-i18n'

const defaultLocale = 'en'

//TODO: If people want more languages, add them here
register('en', () => import('$lib/locales/en.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: getLocaleFromNavigator(),
})