module.exports = {
  packages: {
    'adal-angular4': {
      entryPoints: {
        '.': {
          override: {
            module: './index.js',
          }
        }
      }
    }
  }
};