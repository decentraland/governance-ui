import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const envVariables = loadEnv(mode, process.cwd())
  return {
    plugins: [
      react(),
      // web3 dependencies expect Node's Buffer, process and global, plus some core modules (events, stream,
      // util...). This polyfills them in both dev (dependency optimizer) and build (Rolldown inject).
      // crypto, http, https and zlib stay externalized (empty in the browser), as they were with the
      // previous esbuild/rollup polyfills, so no extra crypto-browserify & co. end up in the bundle.
      nodePolyfills({
        exclude: ['crypto', 'http', 'https', 'zlib'],
        globals: {
          Buffer: true,
          global: true,
          // Build only. In dev, Vite exposes the `define`d process.env on globalThis.process (via
          // /@vite/env), but the plugin would rewrite `process` in src to its own shim, whose env is
          // empty, so VITE_REACT_APP_DCL_DEFAULT_ENV would be ignored. ('build' is not enough: the
          // plugin still injects the shim into src modules in dev with that value.)
          process: command === 'build',
        },
        protocolImports: true,
      }),
    ],
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
    css: {
      lightningcss: {
        // Vite 8 minifies CSS with Lightning CSS, which rejects a few selectors in semantic-ui-css that no
        // browser can match (e.g. `[data-tooltip]:after .header`). Drop those rules instead of failing.
        errorRecovery: true,
      },
    },
    optimizeDeps: {
      exclude: ['thirdweb', '@base-org/account'],
    },
    ...(command === 'build'
      ? {
          // Set by scripts/prebuild.js: the CDN path of this version on CI, empty (relative) locally.
          base: envVariables.VITE_BASE_URL,
          build: {
            // Vite 4's default target. Vite 7+ defaults to the "baseline widely available" browsers
            // (chrome111, firefox114, safari16.4...), which would stop lowering class fields and private
            // methods and drop CSS prefixes, breaking e.g. Safari/iOS 14-15. Keep today's browser support.
            target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
            sourcemap: false,
          },
        }
      : {}),
  }
})
