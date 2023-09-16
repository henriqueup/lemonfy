import type { Patch } from "immer";

export const produce = <T>(state: T, callback: (draft: T) => T | void): T => {
  const result = callback(state);

  return { ...state, ...result };
};

export const enablePatches = jest.fn();
export const produceWithPatches = <T>(
  state: T,
  callback: (draft: T) => T | void,
): [T, Patch[], Patch[]] => {
  const result = produce(state, callback);

  return [result, [], []];
};
