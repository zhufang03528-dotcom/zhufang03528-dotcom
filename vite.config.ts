import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設定 base 為 './' 確保在 GitHub Pages 子路徑下資源路徑正確
  base: './',
  define: {
    // 將環境變數注入到前端程式碼中
    // 在 GitHub Actions 中，process.env.API_KEY 會來自 secrets
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});