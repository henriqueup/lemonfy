/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  produceWithPatches,
  type Patch,
  applyPatches,
  type Draft,
  enablePatches,
} from "immer";

enablePatches();

export interface TaggedPatch extends Patch {
  tag: string;
}

const createPatchTag = (): string => new Date().toISOString();

const popLastPatches = (patches: TaggedPatch[]): TaggedPatch[] => {
  const lastPatches: TaggedPatch[] = [];

  let currentPatch = patches.pop();
  while (currentPatch !== undefined) {
    lastPatches.push(currentPatch);

    if (currentPatch.tag !== lastPatches[0]!.tag) break;

    currentPatch = patches.pop();
  }

  return lastPatches;
};

let undoneablePatches: TaggedPatch[] = [];
let redoablePatches: TaggedPatch[] = [];

export const produceUndoneableAction = <T>(
  state: T,
  recipe: (draft: Draft<T>) => Draft<T> | void,
): T => {
  const [result, , inversePatches] = produceWithPatches(state, recipe);

  const tag = createPatchTag();
  undoneablePatches = undoneablePatches.concat(
    inversePatches.map(patch => ({ ...patch, tag })),
  );
  redoablePatches = [];

  return result;
};

export const handleChangeHistory = <T extends object>(
  state: T,
  operation: "undo" | "redo",
) => {
  const patchesToPop =
    operation === "undo" ? undoneablePatches : redoablePatches;
  const patchesToPush =
    operation === "undo" ? redoablePatches : undoneablePatches;

  const [result, , inversePatches] = produceWithPatches(state, draft => {
    const patchesToUndo = popLastPatches(patchesToPop);

    if (patchesToUndo.length) {
      applyPatches(draft, patchesToUndo);
    }
  });

  const tag = createPatchTag();
  patchesToPush.push(...inversePatches.map(patch => ({ ...patch, tag })));

  return result;
};
