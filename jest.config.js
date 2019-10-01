module.exports = {
  verbose: true,
  testRegex: '(src/utils|packages).*/__tests__/.*\\.test\\.[jt]sx?$',
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  preset: 'ts-jest/presets/js-with-babel',
};
