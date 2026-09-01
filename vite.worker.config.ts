import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist/server',
    emptyOutDir: false,
    copyPublicDir: false,
    target: 'es2022',
    lib: {
      entry: 'src/worker.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
})
