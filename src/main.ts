import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './samples/ipc-test'

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
