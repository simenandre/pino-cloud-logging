module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: [
    '.*.utils.ts',
    '.*/fixtures.ts',
    '.*/*.fixtures.ts',
    '.*/dist/.*',
    '.*dist.*',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
};
