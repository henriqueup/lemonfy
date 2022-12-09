import { DragEvent, FunctionComponent, useState } from "react";
import Note, { NoteDuration } from "../../entities/note";
import Pitch, { NUMBER_OF_OCTAVES, NUMBER_OF_PICHES_IN_OCTAVE, Octave, PitchDictionary } from "../../entities/pitch";
import { useSheet } from "./SheetContext";
import Track from "./Track";

type SheetEditorProps = {};

const SheetEditor: FunctionComponent<SheetEditorProps> = ({}) => {
  const { sheet, refresh: refreshSheet } = useSheet();
  const [selectedOctave, setSelectedOctave] = useState<Octave>(0);
  const [selectedDuration, setSelectedDuration] = useState<string>("LONG");
  // const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);

  const handleDragStart = (_event: DragEvent<HTMLDivElement>, pitchName: string) => {
    const noteData = new Note(
      NoteDuration[selectedDuration],
      new Pitch(pitchName.substring(0, pitchName.length - 1), selectedOctave),
    );
    refreshSheet({ ...sheet, noteToAdd: noteData });
  };

  return (
    <div style={{ height: "100vh", background: "black", color: "lightgray" }}>
      <div style={{ height: "60%", padding: "16px 16px 8px 16px" }}>
        <fieldset style={{ height: "100%", border: "1px solid lightgray", borderRadius: "4px" }}>
          <legend>Bars</legend>
          {sheet.bars.length === 0 ? (
            <div
              style={{ width: "fit-content", margin: "auto", marginTop: "16px", fontSize: "3rem", cursor: "pointer" }}
              onClick={() => {
                sheet.addBar(4, 4, 60);
                refreshSheet(sheet);
              }}
            >
              +
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              {sheet.bars.map((bar, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    padding: "16px",
                    border: "1px solid lightgray",
                    borderRadius: "4px",
                    width: "50%",
                    marginRight: "8px",
                  }}
                >
                  <span>{`${bar.beatCount}/${bar.dibobinador}`}</span>
                  <div
                    style={{
                      width: "100%",
                      height: "100px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {bar.tracks.map((track, j) => (
                      <Track key={j} bar={bar} track={track} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* {barMenuIsOpen ? (
            <div style={{ width: "25vw", border: "1px solid lightgray", borderRadius: "4px", margin: "auto" }}>
              <h3 style={{ width: "fit-content", margin: "8px auto" }}>New Bar</h3>
            </div>
          ) : null} */}
        </fieldset>
      </div>
      <div style={{ height: "40%", padding: "8px 16px 16px 16px" }}>
        <fieldset style={{ height: "100%", padding: "16px", border: "1px solid lightgray", borderRadius: "4px" }}>
          <legend>Note Selector</legend>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <fieldset style={{ borderRadius: "8px", padding: "5px", width: "6rem", margin: "0px 4px" }}>
              <legend>Octave</legend>
              <select
                value={selectedOctave}
                onChange={event => setSelectedOctave(Number(event.target.value))}
                style={{ width: "100%", cursor: "pointer" }}
              >
                {[...Array(NUMBER_OF_OCTAVES).keys()].map((octave, i) => (
                  <option key={i}>{octave}</option>
                ))}
              </select>
            </fieldset>
            <fieldset style={{ borderRadius: "8px", padding: "5px", width: "calc(12rem + 8px)", margin: "0px 4px" }}>
              <legend>Duration</legend>
              <select
                value={selectedDuration}
                onChange={event => setSelectedDuration(event.target.value)}
                style={{ width: "100%", cursor: "pointer" }}
              >
                {Object.keys(NoteDuration).map((noteDuration, i) => (
                  <option key={i}>{noteDuration}</option>
                ))}
              </select>
            </fieldset>
          </div>
          <div style={{ display: "flex" }}>
            {Object.keys(PitchDictionary)
              .slice(0, NUMBER_OF_PICHES_IN_OCTAVE)
              .concat(["XX"])
              .map((pitchName, i) => (
                <div
                  key={i}
                  draggable={true}
                  onDragStart={event => handleDragStart(event, pitchName)}
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    minWidth: "6rem",
                    minHeight: "6rem",
                    margin: "4px",
                    border: "1px solid lightgray",
                    borderRadius: "16px",
                    cursor: "pointer",
                  }}
                >
                  {pitchName.substring(0, pitchName.length - 1)}
                </div>
              ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default SheetEditor;
