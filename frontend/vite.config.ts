import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/ProjectHub/",   // 👈 VERY IMPORTANT
  plugins: [react()],
})
