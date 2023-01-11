// import { fillBeat } from "../../entities/bar";
// import { createNote, NoteDuration } from "../../entities/note";
// import { createPitch } from "../../entities/pitch";

// describe("Bar entity tests", () => {
//   it("should throw error when filling an incomplete bar", () => {
//     expect(() => fillBeat(4, 0, [createNote(NoteDuration.EIGHTH, createPitch("C", 3))])).toThrow(
//       `Invalid beat notes, expected total duration: '${1 / 4}', actual: '${1 / 8}'`,
//     );
//   });
//   it("should throw error when filling an overfilled bar", () => {
//     expect(() => fillBeat(4, 0, [createNote(NoteDuration.HALF, createPitch("C", 3))])).toThrow(
//       `Invalid beat notes, expected total duration: '${1 / 4}', actual: '${1 / 2}'`,
//     );
//   });
//   it("should set the start of notes on first beat", () => {
//     const firstBeat = fillBeat(4, 0, [
//       createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("G#", 2)),
//       createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("C#", 3)),
//       createNote(NoteDuration.EIGHTH_TRIPLET, createPitch("E", 3)),
//     ]);

//     expect(firstBeat.length).toBe(3);
//     expect(firstBeat[0].start).toBe(0);
//     expect(firstBeat[1].start).toBe(NoteDuration.EIGHTH_TRIPLET);
//     expect(firstBeat[2].start).toBe(NoteDuration.EIGHTH_TRIPLET * 2);
//   });
//   it("should set the start of notes on third beat", () => {
//     const firstBeat = fillBeat(4, 2, [
//       createNote(NoteDuration.SIXTEENTH, createPitch("G#", 2)),
//       createNote(NoteDuration.EIGHTH, createPitch("C#", 3)),
//       createNote(NoteDuration.SIXTEENTH, createPitch("A", 3)),
//     ]);

//     const baseStart = (1 / 4) * 2;

//     expect(firstBeat.length).toBe(3);
//     expect(firstBeat[0].start).toBe(baseStart);
//     expect(firstBeat[1].start).toBe(baseStart + NoteDuration.SIXTEENTH);
//     expect(firstBeat[2].start).toBe(baseStart + NoteDuration.SIXTEENTH * 3);
//   });
// });
