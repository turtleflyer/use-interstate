import type { Config } from '@jest/types';
import type { TsJestGlobalOptions } from 'ts-jest/dist/types';

const config: Config.InitialOptions & {
  globals?: Config.ConfigGlobals & { ['ts-jest']: TsJestGlobalOptions };
} = {
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '.git', './ts/'],
  modulePathIgnorePatterns: ['./ts/'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node', 'd.ts'],
};

export default config;
