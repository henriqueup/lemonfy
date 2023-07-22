export const produce = <T>(state: T, callback: (draft: T) => T | void): T => {
  const result = callback(state);

  return { ...state, ...result };
};
