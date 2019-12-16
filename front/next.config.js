const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  }
}

// const nextEnv = require('next-env');
// const dotenvLoad = require('dotenv-load');
 
// dotenvLoad();
 
// const withNextEnv = nextEnv();
 
// module.exports = withNextEnv({
//   // Your Next.js config.
// });