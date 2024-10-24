// babel.config.cjs
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Ensures compatibility with your current Node.js version
        },
      },
    ],
  ],
};
