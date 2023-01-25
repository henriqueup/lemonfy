import { useEditorStore } from "./editorStore";
import { NOTE_DURATIONS } from "../../server/entities/note";
import { findNoteByTime } from "../../server/entities/bar";

export const increaseCursorTrackIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.cursor.trackIndex === state.currentSheet.trackCount - 1) return {};

    return { cursor: { ...state.cursor, trackIndex: state.cursor.trackIndex + 1 } };
  });

export const decreaseCursorTrackIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.cursor.trackIndex === 0) return {};

    return { cursor: { ...state.cursor, trackIndex: state.cursor.trackIndex - 1 } };
  });

export const increaseCursorBarIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.cursor.barIndex === state.currentSheet.bars.length - 1) return {};

    return { cursor: { ...state.cursor, barIndex: state.cursor.barIndex + 1, position: 0 } };
  });

export const decreaseCursorBarIndex = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.cursor.barIndex === 0) return {};

    return { cursor: { ...state.cursor, barIndex: state.cursor.barIndex - 1, position: 0 } };
  });

export const increaseCursorPosition = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    const barWithCursor = state.currentSheet.bars[state.cursor.barIndex];

    if (barWithCursor === undefined) return {};
    if (state.cursor.position === barWithCursor.capacity) return {};

    let amountToIncrease = NOTE_DURATIONS[state.selectedNoteDuration];
    const nextNote = findNoteByTime(barWithCursor, state.cursor.trackIndex, state.cursor.position);

    if (nextNote && nextNote.start !== undefined) {
      amountToIncrease = nextNote.start + nextNote.duration - state.cursor.position;
    }
    let resultPosition = state.cursor.position + amountToIncrease;

    if (resultPosition > barWithCursor.capacity) resultPosition = barWithCursor.capacity;

    return { cursor: { ...state.cursor, position: resultPosition } };
  });

export const decreaseCursorPosition = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};
    if (state.cursor.position === 0) return {};

    const barWithCursor = state.currentSheet.bars[state.cursor.barIndex];

    if (barWithCursor === undefined) return {};

    let amountToDecrease = NOTE_DURATIONS[state.selectedNoteDuration];
    const previousNote = findNoteByTime(barWithCursor, state.cursor.trackIndex, state.cursor.position, false);

    if (previousNote && previousNote.start !== undefined) {
      amountToDecrease = state.cursor.position - previousNote.start;
    }
    let resultPosition = state.cursor.position - amountToDecrease;

    if (resultPosition < 0) resultPosition = 0;

    return { cursor: { ...state.cursor, position: resultPosition } };
  });

export const moveCursorToEndOfBar = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    const barWithCursor = state.currentSheet.bars[state.cursor.barIndex];

    if (barWithCursor === undefined) return {};

    return { cursor: { ...state.cursor, position: barWithCursor.capacity } };
  });

export const moveCursorToStartOfBar = () =>
  useEditorStore.setState(state => {
    if (state.currentSheet === undefined) return {};

    return { cursor: { ...state.cursor, position: 0 } };
  });
