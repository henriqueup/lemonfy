/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { produceWithPatches, type Patch, applyPatches } from "immer";

export interface TaggedPatch extends Patch {
  tag: string;
}

export const createPatchTag = (): string => new Date().toISOString();

export const popLastPatches = (patches: TaggedPatch[]): TaggedPatch[] => {
  const lastPatches: TaggedPatch[] = [];

  let currentPatch = patches.pop();
  while (currentPatch !== undefined) {
    lastPatches.push(currentPatch);

    if (currentPatch.tag !== lastPatches[0]!.tag) break;

    currentPatch = patches.pop();
  }

  return lastPatches;
};

export const handleChangeHistory = <T extends object>(
  state: T,
  patchesToPop: TaggedPatch[],
  patchesToPush: TaggedPatch[],
) => {
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
