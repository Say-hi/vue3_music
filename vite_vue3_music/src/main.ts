import { createApp } from 'vue'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/scss/index.scss'
import loadingImg from '@/assets/images/default.png'

createApp(App).use(store).use(router).use(lazyPlugin, {
    loading: loadingImg
}).directive('loading',  loadingDirective).directive('no-result', noResultDirective).mount('#app')
