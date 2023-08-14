import { produce } from "immer";

import { getCurrentSheet, useEditorStore } from "./editorStore";
import { NOTE_DURATIONS } from "@entities/note";
import { findBarNoteByTime } from "@entities/bar";
import { TimeEvaluation } from "src/utils/timeEvaluation";

export const increaseCursorTrackIndex = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);

      if (currentSheet === undefined) return;
      if (draft.cursor.trackIndex === currentSheet.trackCount - 1) return;

      draft.cursor.trackIndex += 1;
    }),
  );

export const decreaseCursorTrackIndex = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);

      if (currentSheet === undefined) return;
      if (draft.cursor.trackIndex === 0) return;

      draft.cursor.trackIndex -= 1;
    }),
  );

export const increaseCursorBarIndex = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);

      if (currentSheet === undefined) return;
      if (draft.cursor.barIndex === currentSheet.bars.length - 1) return;

      draft.cursor.barIndex += 1;
      draft.cursor.position = 0;
    }),
  );

export const decreaseCursorBarIndex = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);

      if (currentSheet === undefined) return;
      if (draft.cursor.barIndex === 0) return;

      draft.cursor.barIndex -= 1;
      draft.cursor.position = 0;
    }),
  );

export const increaseCursorPosition = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;
      if (
        TimeEvaluation.IsEqualTo(draft.cursor.position, barWithCursor.capacity)
      )
        return;

      const nextNote = findBarNoteByTime(
        barWithCursor,
        draft.cursor.trackIndex,
        draft.cursor.position,
        true,
        false,
      );
      let amountToIncrease = NOTE_DURATIONS[draft.selectedNoteDuration];

      if (nextNote) {
        amountToIncrease =
          nextNote.start + nextNote.duration - draft.cursor.position;

        if (TimeEvaluation.IsSmallerThan(draft.cursor.position, nextNote.start))
          amountToIncrease -= nextNote.duration;
      }
      let resultPosition = draft.cursor.position + amountToIncrease;

      if (TimeEvaluation.IsGreaterThan(resultPosition, barWithCursor.capacity))
        resultPosition = barWithCursor.capacity;

      draft.cursor.position = resultPosition;
    }),
  );

export const decreaseCursorPosition = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);

      if (currentSheet === undefined) return;
      if (TimeEvaluation.IsEqualTo(draft.cursor.position, 0)) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;

      const previousNote = findBarNoteByTime(
        barWithCursor,
        draft.cursor.trackIndex,
        draft.cursor.position,
        false,
        false,
      );
      let amountToDecrease = NOTE_DURATIONS[draft.selectedNoteDuration];

      if (previousNote) {
        amountToDecrease = draft.cursor.position - previousNote.start;

        const previousNoteEnd = previousNote.start + previousNote.duration;
        if (
          TimeEvaluation.IsGreaterThan(draft.cursor.position, previousNoteEnd)
        )
          amountToDecrease -= previousNote.duration;
      }
      let resultPosition = draft.cursor.position - amountToDecrease;

      if (resultPosition < 0) resultPosition = 0;

      draft.cursor.position = resultPosition;
    }),
  );

export const moveCursorToEndOfBar = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      const barWithCursor = currentSheet.bars[draft.cursor.barIndex];
      if (barWithCursor === undefined) return;

      draft.cursor.position = barWithCursor.capacity;
    }),
  );

export const moveCursorToStartOfBar = () =>
  useEditorStore.setState(state =>
    produce(state, draft => {
      const currentSheet = getCurrentSheet(draft);
      if (currentSheet === undefined) return;

      draft.cursor.position = 0;
    }),
  );
