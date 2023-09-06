import { type Draft, produce } from "immer";

import { type Bar, convertDurationInBarToSeconds } from "@entities/bar";
import { getCurrentSheet, useEditorStore } from "@/store/editor";
import {
  INITIAL_STATE,
  type PlayerStore,
  usePlayerStore,
} from "@/store/player";
import { createBarAudioNodes } from "@/utils/audioContext";

const createNextBarTimeout = (
  audioContext: AudioContext,
  originalDraft: Draft<PlayerStore>,
  barWithCursor: Bar | undefined,
  startPosition = 0,
): NodeJS.Timeout | undefined => {
  if (barWithCursor === undefined) {
    stopCallback(originalDraft);
    return undefined;
  }

  const barDurationInSeconds = convertDurationInBarToSeconds(
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
        const secondNextBar = currentSheet.bars[nextBarIndex + 1];

        const startTime = new Date();
        const timeout = createNextBarTimeout(audioContext, draft, nextBar);
        if (timeout === undefined) return;

        draft.currentTimeoutStartTime = startTime;
        draft.cursor.barIndex = nextBarIndex;
        draft.cursor.position = 0;
        draft.nextBarTimeout = timeout;

        if (nextBar) {
          //for each note, 2 audio nodes are created
          const audioNodesFromPreviousBarCount =
            (barWithCursor?.tracks.flat().length ?? 0) * 2;

          draft.audioNodes = draft.audioNodes
            .slice(audioNodesFromPreviousBarCount)
            .concat(
              createBarAudioNodes(
                secondNextBar,
                audioContext,
                nextBar.capacity,
              ),
            );
        }
      }),
    );
  }, barDurationInSeconds * 1000);
};

export const play = (audioContext: AudioContext) => {
  usePlayerStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet();
      if (currentSheet === undefined || (draft.isPlaying && !draft.isPaused))
        return;

      const editorCursor = useEditorStore.getState().cursor;
      const barWithCursor = currentSheet.bars[editorCursor.barIndex];
      const nextBar = currentSheet.bars[editorCursor.barIndex + 1];

      let audioNodes = createBarAudioNodes(
        barWithCursor,
        audioContext,
        0,
        editorCursor.position,
      );

      if (barWithCursor) {
        audioNodes = audioNodes.concat(
          createBarAudioNodes(
            nextBar,
            audioContext,
            barWithCursor.capacity - editorCursor.position,
          ),
        );
      }
      const startTime = new Date();

      const timeout = createNextBarTimeout(
        audioContext,
        draft,
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

const clearPlayback = (draft: Draft<PlayerStore>) => {
  clearAudioNodes(draft.audioNodes);
  clearTimeout(draft.nextBarTimeout);
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
      const totalBarTime = convertDurationInBarToSeconds(
        barWithCursor,
        barWithCursor.capacity,
      );
      const positionTraveled =
        barWithCursor.capacity * (timeElapsed / totalBarTime);
      const currentBarPosition = positionTraveled + draft.cursor.position;

      clearPlayback(draft);

      useEditorStore.setState(editorState =>
        produce(editorState, editorDraft => {
          editorDraft.cursor.barIndex = draft.cursor.barIndex;
          editorDraft.cursor.position = currentBarPosition;
        }),
      );

      draft.isPaused = true;
      draft.cursor.position = currentBarPosition;
      draft.audioNodes = [];
    }),
  );

const stopCallback = (draft: Draft<PlayerStore>) => {
  clearPlayback(draft);

  draft.audioNodes = [];
  draft.currentTimeoutStartTime = INITIAL_STATE.currentTimeoutStartTime;

  draft.cursor.barIndex = INITIAL_STATE.cursor.barIndex;
  draft.cursor.position = INITIAL_STATE.cursor.position;

  draft.isPaused = INITIAL_STATE.isPaused;
  draft.isPlaying = INITIAL_STATE.isPlaying;
  draft.nextBarTimeout = INITIAL_STATE.nextBarTimeout;
};

export const stop = () =>
  usePlayerStore.setState(state =>
    produce(state, draft => stopCallback(draft)),
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

      if (isRewind) {
        let nextBarIndex = isFull ? 0 : currentBarIndex;

        if (!draft.isPlaying && editorCursor.position === 0) {
          nextBarIndex -= 1;
          nextBarIndex = Math.max(0, nextBarIndex);
        }

        useEditorStore.setState(editorState =>
          produce(editorState, editorDraft => {
            editorDraft.cursor.barIndex = nextBarIndex;
            editorDraft.cursor.position = 0;
          }),
        );

        stopCallback(draft);
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

      stopCallback(draft);
      draft.cursor.barIndex = nextBarIndex;
      draft.cursor.position = 0;
    }),
  );
};
