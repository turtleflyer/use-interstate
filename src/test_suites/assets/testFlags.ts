export type TestFlags = {
  SHOULD_TEST_IMPLEMENTATION: boolean;

  SHOULD_TEST_PERFORMANCE: boolean;
};

const defFlags: TestFlags = {
  SHOULD_TEST_IMPLEMENTATION: false,
  SHOULD_TEST_PERFORMANCE: false,
};

const flags = { ...defFlags };

export const flagManager = {
  reset: (): void => {
    Object.assign(flags, defFlags);
  },

  set: (newFlags: Partial<TestFlags>): void => {
    Object.assign(flags, newFlags);
  },

  read: <FQ extends keyof TestFlags>(flagName: FQ): TestFlags[FQ] => flags[flagName],
};
