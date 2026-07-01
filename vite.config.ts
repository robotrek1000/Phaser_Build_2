import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

import { APP_NAME, BASE_REM, DESIGN_HEIGHT, DESIGN_WIDTH } from './src/shared/constants';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), createHtmlPlugin({
      inject: {
        data: {
          APP_NAME,
          BASE_REM,
          DESIGN_WIDTH,
          DESIGN_HEIGHT
        },
      },
    }),
    ],
    base: env.VITE_BASE_URL || '/',
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 800,
      sourcemap: 'hidden',
      rollupOptions: {
        treeshake: true,
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return
            }

            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor'
            }

            if (id.includes('phaser')) {
              return 'phaser-vendor'
            }

            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor'
            }

            if (id.includes('motion')) {
              return 'motion-vendor'
            }

            return 'vendor'
          },
        },
      },
    }
  }
})
