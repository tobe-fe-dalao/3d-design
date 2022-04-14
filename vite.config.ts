import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'], // 将被插件转换管道排除在外
  plugins: [
    vue(),
  ],
  base: './',
  server: {
    host: '0.0.0.0',
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#FF6900',
          'body-background': '#212121',
          'card-actions-background': '#212121',
          'card-padding-base': '16px',
          'card-head-padding': '10px',
          'slider-margin': '0px',
          'slider-handle-color': '#FF6900',
          'slider-handle-color-hover': '#FF6900',
          'slider-track-background-color': '#FF6900',
          'slider-track-background-color-hover': '#FF6900'
        },
        javascriptEnabled: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
})
