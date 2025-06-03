const { ProvidePlugin } = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url/'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert/'),
    util: require.resolve('util/'),
  };

  config.plugins = [
    ...config.plugins,
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};