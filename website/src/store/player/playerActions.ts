import { produce } from "immer";

import { default as BarModule, type Bar } from "@entities/bar";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import { INITIAL_STATE, usePlayerStore } from "@/store/player";

const createNextBarTimeout = (
  barWithCursor: Bar | undefined,
  startPosition = 0,
): NodeJS.Timeout | undefined => {
  if (barWithCursor === undefined) {
    stop();
    return undefined;
  }

  const barDurationInSeconds = BarModule.convertDurationInBarToSeconds(
    barWithCursor,
    barWithCursor.capacity - startPosition,
  );

  return setTimeout(() => {
    usePlayerStore.setState(state =>
      produce(state, draft => {
        const currentSheet = getCurrentSheet();
        if (currentSheet === undefined) return;

        const nextBarIndex = draft.cursor.barIndex + 1;
        const nextBar = currentSheet.bars[nextBarIndex];

        const startTime = new Date();
        const timeout = createNextBarTimeout(nextBar);
        if (timeout === undefined) return;

        draft.currentTimeoutStartTime = startTime;
        draft.cursor.barIndex = nextBarIndex;
        draft.cursor.position = 0;
        draft.nextBarTimeout = timeout;
      }),
    );
  }, barDurationInSeconds * 1000);
};

export const play = (audioNodes: AudioNode[]) => {
  usePlayerStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet();
      if (currentSheet === undefined || (draft.isPlaying && !draft.isPaused))
        return;

      const editorCursor = useEditorStore.getState().cursor;
      const barWithCursor = currentSheet.bars[editorCursor.barIndex];
      const startTime = new Date();

      const timeout = createNextBarTimeout(
        barWithCursor,
        editorCursor.position,
      );
      if (timeout === undefined) return;

      return {
        isPlaying: true,
        isPaused: false,
        currentTimeoutStartTime: startTime,
        nextBarTimeout: timeout,
        cursor: {
          barIndex: editorCursor.barIndex,
          position: editorCursor.position,
        },
        audioNodes,
      };
    }),
  );
};

const clearAudioNodes = (audioNodes: AudioNode[]) => {
  audioNodes.forEach(audioNode => audioNode.disconnect());
};

export const pause = () =>
  usePlayerStore.setState(state =>
    produce(state, draft => {
      if (
        !draft.isPlaying ||
        draft.currentTimeoutStartTime === undefined ||
        draft.isPaused
      )
        return;

      const currentSheet = getCurrentSheet();
      if (currentSheet === undefined) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;

      const timeElapsed =
        (new Date().getTime() - draft.currentTimeoutStartTime.getTime()) / 1000;
      const totalBarTime = BarModule.convertDurationInBarToSeconds(
        barWithCursor,
        barWithCursor.capacity,
      );
      const positionTraveled =
        barWithCursor.capacity * (timeElapsed / totalBarTime);
      const currentBarPosition = positionTraveled + draft.cursor.position;

      clearAudioNodes(draft.audioNodes);
      clearTimeout(draft.nextBarTimeout);

      useEditorStore.setState(editorState => ({
        cursor: {
          ...editorState.cursor,
          barIndex: draft.cursor.barIndex,
          position: currentBarPosition,
        },
      }));

      draft.isPaused = true;
      draft.cursor.position = currentBarPosition;
      draft.audioNodes = [];
    }),
  );

export const stop = () =>
  usePlayerStore.setState(state =>
    produce(state, draft => {
      clearAudioNodes(draft.audioNodes);
      if (draft.nextBarTimeout) clearTimeout(draft.nextBarTimeout);

      return { ...INITIAL_STATE, nextBarTimeout: undefined };
    }),
  );

export const windUp = (isRewind = false, isFull = false) => {
  usePlayerStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet();
      if (currentSheet === undefined) return;

      const editorCursor = useEditorStore.getState().cursor;
      const currentBarIndex = draft.isPlaying
        ? draft.cursor.barIndex
        : editorCursor.barIndex;
      if (currentBarIndex >= currentSheet.bars.length) return;

      //TODO: fix produce nesting
      stop();

      if (isRewind) {
        let nextBarIndex = isFull ? 0 : currentBarIndex;

        const cursorPosition = draft.isPlaying
          ? draft.cursor.position
          : editorCursor.position;
        if (cursorPosition === 0) nextBarIndex -= 1;

        nextBarIndex = Math.max(0, nextBarIndex);

        useEditorStore.setState(editorState =>
          produce(editorState, editorDraft => {
            editorDraft.cursor.barIndex = nextBarIndex;
            editorDraft.cursor.position = 0;
          }),
        );

        draft.cursor.barIndex = nextBarIndex;
        draft.cursor.position = 0;
        return;
      }

      const lastBarIndex = currentSheet.bars.length - 1;
      let nextBarIndex = isFull ? lastBarIndex : currentBarIndex + 1;
      nextBarIndex = Math.min(lastBarIndex, nextBarIndex);

      useEditorStore.setState(editorState =>
        produce(editorState, editorDraft => {
          editorDraft.cursor.barIndex = nextBarIndex;
          editorDraft.cursor.position = 0;
        }),
      );

      draft.cursor.barIndex = nextBarIndex;
      draft.cursor.position = 0;
    }),
  );
};
