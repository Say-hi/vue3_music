import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import path from 'path'

function reoslve(dir: string) {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueSetupExtend()],
  base: './',
  resolve: {
    alias: { // 设置别名 同时需要在ts.config.js中设置对应的path
      '@': reoslve('./src'),
      "@store": reoslve('./src/store')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variable.scss"; @import "@/assets/scss/mixin.scss";` // 引入变量
      }
    }
  },
  server: {
    port: 9527,
    proxy: {
      "/api": {
        target: 'http://localhost:9002/',
        changeOrigin: true,
      }
    }
  }
})
