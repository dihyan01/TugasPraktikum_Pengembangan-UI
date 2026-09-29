import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <-- Tambahkan router

const app = createApp(App)

app.use(router) // <-- Pasang router ke app
app.mount('#app')