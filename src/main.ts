import "bootstrap/dist/css/bootstrap.min.css"
import "./styles/styles.scss"

//************************************************
//*** Create Vue app
//************************************************
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(createPinia());
app.use(router).mount('#app');
