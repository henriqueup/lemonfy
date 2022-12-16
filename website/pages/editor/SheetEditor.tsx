import { DragEvent, FunctionComponent, useState } from "react";
import Note, { NoteDuration } from "../../entities/note";
import Pitch, { NUMBER_OF_OCTAVES, NUMBER_OF_PICHES_IN_OCTAVE, Octave, PitchDictionary } from "../../entities/pitch";
import { playSong } from "../../entities/sheet";
import { useAudioContext } from "../../hooks";
import { Plus } from "../../icons";
import Track from "./Track";
import BarMenu from "./BarMenu";
import { useSheet } from "./Editor";
import { Button } from "../../components/button/button";

type SheetEditorProps = {
  handleLoad: () => void;
};

const SheetEditor: FunctionComponent<SheetEditorProps> = ({ handleLoad }) => {
  const audioContext = useAudioContext();
  const { sheet, refresh: refreshSheet } = useSheet();
  const [selectedOctave, setSelectedOctave] = useState<Octave>(0);
  const [selectedDuration, setSelectedDuration] = useState<string>("LONG");
  const [barMenuIsOpen, setBarMenuIsOpen] = useState(false);

  const handleDragStart = (_event: DragEvent<HTMLDivElement>, pitchName: string) => {
    const noteData = new Note(
      NoteDuration[selectedDuration],
      new Pitch(pitchName.substring(0, pitchName.length - 1), selectedOctave),
    );

    sheet.noteToAdd = noteData;
    refreshSheet();
  };

  const handleAddNote = (barIndex: number, trackIndex: number, note: Note) => {
    sheet.addNote(barIndex, trackIndex, note);
    refreshSheet();
  };

  const handlePlay = () => {
    playSong(sheet, audioContext);
  };

  const handleSave = () => {
    localStorage.setItem("sheet", JSON.stringify(sheet));
  };

  const handleAddBar = (beatCount: number, dibobinador: number, tempo: number) => {
    sheet.addBar(beatCount, dibobinador, tempo);
    refreshSheet();

    setBarMenuIsOpen(false);
  };

  return (
    <>
      <div style={{ height: "60%", padding: "16px 16px 8px 16px" }}>
        <fieldset style={{ height: "100%", border: "1px solid lightgray", borderRadius: "4px" }}>
          <legend>Bars</legend>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              maxHeight: "100%",
              overflowY: "auto",
              columnGap: "8px",
              rowGap: "8px",
            }}
          >
            {sheet.bars.map((bar, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "16px",
                  border: "1px solid lightgray",
                  borderRadius: "4px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span>{`${bar.beatCount}/${bar.dibobinador}`}</span>
                  </div>
                  <div>
                    <span>{bar.tempo}</span>
                  </div>
                </div>
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
                    <Track key={j} bar={bar} track={track} handleAddNote={note => handleAddNote(i, j, note)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                marginTop: "16px",
                padding: "4px",
                cursor: "pointer",
                border: "1px solid lightgray",
                borderRadius: "50%",
              }}
              onClick={() => setBarMenuIsOpen(true)}
            >
              <Plus fill="lightgray" />
            </div>
          </div>
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
            <Button text="Play" variant="success" style={{ margin: "0px 4px", width: "6rem" }} onClick={handlePlay} />
            <Button text="Save" variant="primary" style={{ margin: "0px 4px", width: "6rem" }} onClick={handleSave} />
            <Button text="Load" style={{ margin: "0px 4px", width: "6rem" }} onClick={handleLoad} />
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
      {barMenuIsOpen ? <BarMenu onAdd={handleAddBar} /> : null}
    </>
  );
};

export default SheetEditor;
