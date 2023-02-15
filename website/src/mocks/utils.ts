/* eslint-disable @typescript-eslint/no-explicit-any */
export type WithMockedFunctions<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? jest.MockedFunction<T[K]> : T[K];
};

export const mockModuleFunctions = <T extends object>(module: T) => {
  const entries = Object.entries(module);
  const functionEntries = entries.filter(entry => typeof entry[1] === "function" && !jest.isMockFunction(entry[1])) as [
    string,
    (...args: any[]) => any,
  ][];
  const functionMockEntries = functionEntries.map(
    f => [f[0], jest.fn()] as [string, jest.MockedFunction<(typeof f)[1]>],
  );

  return {
    ...Object.fromEntries(entries),
    ...Object.fromEntries(functionMockEntries),
  } as WithMockedFunctions<T>;
};

export const restoreMocks = <T extends object>(module: T) => {
  const values = Object.values(module);

  values.forEach(value => {
    if (!jest.isMockFunction(value)) return;

    value.mockRestore();
  });
};

export const getModuleWithMocks = <T extends object>(module: T) => {
  const moduleWithMocks = mockModuleFunctions(module);

  beforeEach(() => {
    restoreMocks(moduleWithMocks);
  });

  return moduleWithMocks;
};
