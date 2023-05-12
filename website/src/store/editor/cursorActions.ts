import { getCurrentSheet, useEditorStore } from "./editorStore";
import { NOTE_DURATIONS } from "@entities/note";
import BarModule from "@entities/bar";
import { TimeEvaluation } from "src/utils/timeEvaluation";

export const increaseCursorTrackIndex = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);

    if (currentSheet === undefined) return {};
    if (state.cursor.trackIndex === currentSheet.trackCount - 1) return {};

    return {
      cursor: { ...state.cursor, trackIndex: state.cursor.trackIndex + 1 },
    };
  });

export const decreaseCursorTrackIndex = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);

    if (currentSheet === undefined) return {};
    if (state.cursor.trackIndex === 0) return {};

    return {
      cursor: { ...state.cursor, trackIndex: state.cursor.trackIndex - 1 },
    };
  });

export const increaseCursorBarIndex = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);

    if (currentSheet === undefined) return {};
    if (state.cursor.barIndex === currentSheet.bars.length - 1) return {};

    return {
      cursor: {
        ...state.cursor,
        barIndex: state.cursor.barIndex + 1,
        position: 0,
      },
    };
  });

export const decreaseCursorBarIndex = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);

    if (currentSheet === undefined) return {};
    if (state.cursor.barIndex === 0) return {};

    return {
      cursor: {
        ...state.cursor,
        barIndex: state.cursor.barIndex - 1,
        position: 0,
      },
    };
  });

export const increaseCursorPosition = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};
    if (TimeEvaluation.IsEqualTo(state.cursor.position, barWithCursor.capacity))
      return {};

    const nextNote = BarModule.findBarNoteByTime(
      barWithCursor,
      state.cursor.trackIndex,
      state.cursor.position,
      true,
      false,
    );
    let amountToIncrease = NOTE_DURATIONS[state.selectedNoteDuration];

    if (nextNote) {
      amountToIncrease =
        nextNote.start + nextNote.duration - state.cursor.position;

      if (TimeEvaluation.IsSmallerThan(state.cursor.position, nextNote.start))
        amountToIncrease -= nextNote.duration;
    }
    let resultPosition = state.cursor.position + amountToIncrease;

    if (TimeEvaluation.IsGreaterThan(resultPosition, barWithCursor.capacity))
      resultPosition = barWithCursor.capacity;

    return { cursor: { ...state.cursor, position: resultPosition } };
  });

export const decreaseCursorPosition = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);

    if (currentSheet === undefined) return {};
    if (TimeEvaluation.IsEqualTo(state.cursor.position, 0)) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    const previousNote = BarModule.findBarNoteByTime(
      barWithCursor,
      state.cursor.trackIndex,
      state.cursor.position,
      false,
      false,
    );
    let amountToDecrease = NOTE_DURATIONS[state.selectedNoteDuration];

    if (previousNote) {
      amountToDecrease = state.cursor.position - previousNote.start;

      const previousNoteEnd = previousNote.start + previousNote.duration;
      if (TimeEvaluation.IsGreaterThan(state.cursor.position, previousNoteEnd))
        amountToDecrease -= previousNote.duration;
    }
    let resultPosition = state.cursor.position - amountToDecrease;

    if (resultPosition < 0) resultPosition = 0;

    return { cursor: { ...state.cursor, position: resultPosition } };
  });

export const moveCursorToEndOfBar = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    const barWithCursor = currentSheet.bars[state.cursor.barIndex];
    if (barWithCursor === undefined) return {};

    return { cursor: { ...state.cursor, position: barWithCursor.capacity } };
  });

export const moveCursorToStartOfBar = () =>
  useEditorStore.setState(state => {
    const currentSheet = getCurrentSheet(state);
    if (currentSheet === undefined) return {};

    return { cursor: { ...state.cursor, position: 0 } };
  });
