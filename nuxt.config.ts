// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    ssr: false,

    modules: ['nuxt-primevue'],

    primevue: {
        options: {
            ripple: true,
            inputStyle: 'filled'
        },
    },

    css: [
        'primeflex/primeflex.css',
        'primeicons/primeicons.css',
        'primevue/resources/themes/aura-dark-noir/theme.css',
    ],
});
