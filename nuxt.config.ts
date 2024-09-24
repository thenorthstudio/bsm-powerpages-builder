// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  
  imports: {
    dirs: ['utils/*/*.{ts,js}']
  },
  modules: ['nuxt-primevue'],
  
  primevue: {
    options: {
      ripple: true,
      inputStyle: 'outlined'
    },
  },
  
  css: [
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    'primevue/resources/themes/aura-dark-noir/theme.css',
  ],
});
