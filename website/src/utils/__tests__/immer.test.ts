import { getMockInsturment } from "@/mocks/entities/instrument";
import { getCompleteMoonlightSonataMockSheet } from "@/mocks/entities/sheet";
import { getMockSong } from "@/mocks/entities/song";
import { NOTE_DURATIONS, createNote } from "@/server/entities/note";
import { createPitch } from "@/server/entities/pitch";
import {
  addNoteToSheet,
  fillBarTracksInSheet,
  removeNotesFromSheet,
} from "@/server/entities/sheet";
import { handleChangeHistory, produceUndoneableAction } from "@/utils/immer";

jest.unmock("immer");

describe("Undo", () => {
  it("Does nothing with no previous patches", () => {
    const song = getMockSong();
    song.instruments[0] = getMockInsturment(
      getCompleteMoonlightSonataMockSheet(),
    );

    const undoResult = handleChangeHistory(song, "undo");
    const redoResult = handleChangeHistory(undoResult, "redo");

    expect(undoResult).toMatchObject(song);
    expect(redoResult).toMatchObject(song);
  });

  it("Undoes and redos same tagged patches", () => {
    const song = getMockSong();
    song.instruments[0] = getMockInsturment(
      getCompleteMoonlightSonataMockSheet(),
    );

    // remove some notes
    const songAfterFirstChange = produceUndoneableAction(song, draft => {
      removeNotesFromSheet(draft.instruments[0]!.sheet!, 2, [
        draft.instruments[0]!.sheet!.tracks[2]![2]!,
        draft.instruments[0]!.sheet!.tracks[2]![3]!,
      ]);

      fillBarTracksInSheet(draft.instruments[0]!.sheet!, 2);
    });

    // add a note
    const songAfterSecondChange = produceUndoneableAction(
      songAfterFirstChange,
      draft => {
        addNoteToSheet(
          draft.instruments[0]!.sheet!,
          2,
          createNote(
            NOTE_DURATIONS.EIGHTH_TRIPLET,
            NOTE_DURATIONS.EIGHTH_TRIPLET * 2,
            createPitch("C", 5),
          ),
        );

        fillBarTracksInSheet(draft.instruments[0]!.sheet!, 2);
      },
    );

    const undoResult = handleChangeHistory(songAfterSecondChange, "undo");

    expect(undoResult).toMatchObject(songAfterFirstChange);

    const redoResult = handleChangeHistory(undoResult, "redo");

    expect(redoResult).toMatchObject(songAfterSecondChange);
  });
});
