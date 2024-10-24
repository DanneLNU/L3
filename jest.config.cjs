// jest.config.cjs
module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transpile JS files using babel-jest
    },
    testEnvironment: 'node', // Use Node.js environment for tests
    moduleFileExtensions: ['js'], // Recognize .js files
    testMatch: ['**/?(*.)+(spec|test).js'], // Define test file patterns
  };
  