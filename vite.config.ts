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
            sourcemap: false,
            target: 'es2015',
            commonjsOptions: {
              transformMixedEsModules: true,
            },
            minify: 'esbuild',
            cssCodeSplit: false,
            chunkSizeWarningLimit: 1000,
            reportCompressedSize: false,
            rollupOptions: {
              maxParallelFileOps: 2,
              plugins: [rollupNodePolyFill()],
              output: {
                compact: true,
                manualChunks: (id: string) => {
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
                    if (id.includes('chart.js') || id.includes('react-chartjs')) {
                      return 'chart-vendor'
                    }
                    if (id.includes('lottie')) {
                      return 'lottie-vendor'
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
