import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium()]
});
