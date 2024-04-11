module.exports = {
  extends: 'nestjs',
  plugins: ['import-newlines'],
  rules: {
    'import-newlines/enforce': 'error',
  },
};
