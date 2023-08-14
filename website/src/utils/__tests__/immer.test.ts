import { getCompleteMoonlightSonataMockSheet } from "@/mocks/entities/sheet";
import { getMockSong } from "@/mocks/entities/song";
import { NOTE_DURATIONS, createNote } from "@/server/entities/note";
import { createPitch } from "@/server/entities/pitch";
import SheetModule from "@/server/entities/sheet";
import { handleChangeHistory, produceUndoneableAction } from "@/utils/immer";

jest.unmock("immer");

describe("Undo", () => {
  it("Does nothing with no previous patches", () => {
    const song = getMockSong();
    song.instruments[0] = getCompleteMoonlightSonataMockSheet();

    const undoResult = handleChangeHistory(song, "undo");
    const redoResult = handleChangeHistory(undoResult, "redo");

    expect(undoResult).toMatchObject(song);
    expect(redoResult).toMatchObject(song);
  });

  it("Undoes and redos same tagged patches", () => {
    const song = getMockSong();
    song.instruments[0] = getCompleteMoonlightSonataMockSheet();

    // remove some notes
    const songAfterFirstChange = produceUndoneableAction(song, draft => {
      SheetModule.removeNotesFromSheet(draft.instruments[0]!, 2, [
        draft.instruments[0]!.tracks[2]![2]!,
        draft.instruments[0]!.tracks[2]![3]!,
      ]);

      SheetModule.fillBarTracksInSheet(draft.instruments[0]!, 2);
    });

    // add a note
    const songAfterSecondChange = produceUndoneableAction(
      songAfterFirstChange,
      draft => {
        SheetModule.addNoteToSheet(
          draft.instruments[0]!,
          2,
          createNote(
            NOTE_DURATIONS.EIGHTH_TRIPLET,
            NOTE_DURATIONS.EIGHTH_TRIPLET * 2,
            createPitch("C", 5),
          ),
        );

        SheetModule.fillBarTracksInSheet(draft.instruments[0]!, 2);
      },
    );

    const undoResult = handleChangeHistory(songAfterSecondChange, "undo");

    expect(undoResult).toMatchObject(songAfterFirstChange);

    const redoResult = handleChangeHistory(undoResult, "redo");

    expect(redoResult).toMatchObject(songAfterSecondChange);
  });
});
