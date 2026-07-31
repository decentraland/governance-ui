// Only jest uses babel here: the app is built by vite with @vitejs/plugin-react-swc.
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript', ['@babel/preset-react', { runtime: 'automatic' }]],
}
