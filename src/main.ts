import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './samples/ipc-test'
import 'uno.css'

createApp(App)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
