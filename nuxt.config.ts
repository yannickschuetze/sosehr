export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'so sehr',
      meta: [
        {
          name: 'description',
          content: 'Ein offener Raum für Worte, die bleiben.'
        }
      ],
      htmlAttrs: { lang: 'de' }
    }
  },
  runtimeConfig: {
    supabaseSecretKey: '',
    public: {
      supabaseUrl: ''
    }
  }
})
