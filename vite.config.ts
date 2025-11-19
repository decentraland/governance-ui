import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import react from '@vitejs/plugin-react-swc'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import { UserConfig, defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    // Required because the CatalystClient tries to access it
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'process.env': {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        VITE_REACT_APP_DCL_DEFAULT_ENV: envVariables.VITE_REACT_APP_DCL_DEFAULT_ENV,
      },
    },
    server: {
      proxy: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '/auth': {
          target: 'https://decentraland.zone',
          followRedirects: true,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    ...(command === 'build'
      ? {
          base: envVariables.VITE_BASE_URL,
          optimizeDeps: {
            esbuildOptions: {
              // Node.js global to browser globalThis
              define: {
                global: 'globalThis',
              },
              // Enable esbuild polyfill plugins
              plugins: [
                NodeGlobalsPolyfillPlugin({
                  buffer: true,
                  process: true,
                }),
                NodeModulesPolyfillPlugin(),
              ],
            },
          },
          build: {
            commonjsOptions: {
              transformMixedEsModules: true,
            },
            minify: 'esbuild',
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
              plugins: [rollupNodePolyFill()],
              output: {
                manualChunks: (id) => {
                  if (id.includes('node_modules')) {
                    if (id.includes('react') || id.includes('react-dom')) {
                      return 'react-vendor'
                    }
                    if (id.includes('@dcl')) {
                      return 'dcl-vendor'
                    }
                    if (id.includes('ethers') || id.includes('@snapshot-labs')) {
                      return 'crypto-vendor'
                    }
                    return 'vendor'
                  }
                },
              },
            },
            sourcemap: !envVariables.VERCEL,
          },
        }
      : undefined),
  } as unknown as UserConfig
})
