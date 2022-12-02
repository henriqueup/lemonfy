import { NextPage } from "next";
import { useState } from "react";
import Bar from "../../entities/bar";
import { NoteDuration } from "../../entities/note";
import { NUMBER_OF_OCTAVES, NUMBER_OF_PICHES_IN_OCTAVE, PitchDictionary } from "../../entities/pitch";

const Editor: NextPage = () => {
  const [bars, setBars] = useState<Bar[]>([]);

  return (
    <div style={{ height: "100vh" }}>
      <div style={{ height: "60%", padding: "16px 16px 8px 16px" }}>
        <fieldset style={{ height: "100%", border: "1px solid black", borderRadius: "4px" }}>
          <legend>Bars</legend>
          {bars.length === 0 ? (
            <div
              style={{ width: "fit-content", margin: "auto", marginTop: "16px", fontSize: "3rem", cursor: "pointer" }}
            >
              +
            </div>
          ) : (
            <div>
              {bars.map((bar, i) => (
                <span key={i}>{`${bar.beats}/${bar.dibobinador}`}</span>
              ))}
            </div>
          )}
        </fieldset>
      </div>
      <div style={{ height: "40%", padding: "8px 16px 16px 16px" }}>
        <fieldset style={{ height: "100%", padding: "16px", border: "1px solid black", borderRadius: "4px" }}>
          <legend>Note Selector</legend>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <fieldset style={{ borderRadius: "8px", padding: "5px", width: "6rem", margin: "0px 4px" }}>
              <legend>Octave</legend>
              <select style={{ width: "100%", cursor: "pointer" }}>
                {[...Array(NUMBER_OF_OCTAVES).keys()].map((n, i) => (
                  <option key={i}>{n}</option>
                ))}
              </select>
            </fieldset>
            <fieldset style={{ borderRadius: "8px", padding: "5px", width: "calc(12rem + 8px)", margin: "0px 4px" }}>
              <legend>Duration</legend>
              <select style={{ width: "100%", cursor: "pointer" }}>
                {Object.keys(NoteDuration).map((noteDuration, i) => (
                  <option key={i}>{noteDuration}</option>
                ))}
              </select>
            </fieldset>
          </div>
          <div style={{ display: "flex" }}>
            {Object.keys(PitchDictionary)
              .slice(0, NUMBER_OF_PICHES_IN_OCTAVE)
              .map((key, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    minWidth: "6rem",
                    minHeight: "6rem",
                    margin: "4px",
                    border: "1px solid black",
                    borderRadius: "16px",
                    cursor: "pointer",
                  }}
                >
                  {key.substring(0, key.length - 1)}
                </div>
              ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Editor;
