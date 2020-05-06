module.exports = {
  stripPrefix: '../dist/public/',
  staticFileGlobs: [
    '../dist/public/*.html',
    '../dist/public/manifest.json',
    '../dist/public/static/**/!(*map*)'
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  //swFilePath: '../public/service-worker.js'
  swFilePath: '../public/custom-sw.js'
};
