module.exports = {
  env: {
    "browser": false,
    "es6": false,
    "es2017": true,
    "jquery": false,
    "node": true
  },
  rules: {
    "no-console": 0,
    "no-unused-vars": ["error", { "destructuredArrayIgnorePattern": "^_" }]
  }
};
