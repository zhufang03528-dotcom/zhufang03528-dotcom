import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設定 base 為 './' 可以讓部署在 GitHub Pages 任何子路徑時都能正常運作
  base: './',
  define: {
    // 這行非常重要：它會在建置時將 process.env.API_KEY 替換為實際的 API Key 字串
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});