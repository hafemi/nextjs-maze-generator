"use client";
import { useState } from "react";
import { FaFlag, FaGear } from "react-icons/fa6";
import {
  handleGenerationButtonClicked,
  handleSolutionButtonClicked,
} from "./maze-button-handler";
import styles from "./page.module.css";

export default function Home() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [innerWidth, setInnerWidth] = useState("");
  const [innerHeight, setInnerHeight] = useState("");
  const [startingPoint, setStartingPoint] = useState("top");
  const [invalidElements, setInvalidElements] = useState<string[]>([]);

  const validateElement = (
    value: number,
    min: number,
    max: number,
    elementId: string
  ): void => {
    if (!value || value < min || value > max) {
      setInvalidElements([...invalidElements, elementId]);
      return;
    }

    setInvalidElements(invalidElements.filter((id) => id !== elementId));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>MAZE GENERATOR</h1>
        <div>
          <label htmlFor="width">Width</label>
          <input
            className={`
              ${invalidElements.includes("width") ? styles.invalid : ""}
              ${styles.input}
            `}
            id="width"
            type="number"
            placeholder="1-100"
            value={width}
            max={30}
            onChange={(e) => {
              setWidth(e.target.value);
              validateElement(parseInt(e.target.value), 1, 100, "width");
            }}
          />
          <br />
          <label htmlFor="height">Height</label>
          <input
            className={`
              ${invalidElements.includes("height") ? styles.invalid : ""}
              ${styles.input}
            `}
            id="height"
            type="number"
            placeholder="1-100"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              validateElement(parseInt(e.target.value), 1, 100, "height");
            }}
          />
          <br />
          <label htmlFor="innerWidth">Inner Width</label>
          <input
            className={`
              ${invalidElements.includes("innerWidth") ? styles.invalid : ""}
              ${styles.input}
            `}
            id="innerWidth"
            type="number"
            placeholder="1-5"
            value={innerWidth}
            onChange={(e) => {
              setInnerWidth(e.target.value);
              validateElement(parseInt(e.target.value), 1, 5, "innerWidth");
            }}
          />
          <br />
          <label htmlFor="innerHeight">Inner Height</label>
          <input
            className={`
              ${invalidElements.includes("innerHeight") ? styles.invalid : ""}
              ${styles.input}
            `}
            id="innerHeight"
            type="number"
            placeholder="1-5"
            value={innerHeight}
            onChange={(e) => {
              setInnerHeight(e.target.value);
              validateElement(parseInt(e.target.value), 1, 5, "innerHeight");
            }}
          />
          <br />
          <label htmlFor="startingPoint">Starting Point</label>
          <select
            id="startingPoint"
            value={startingPoint}
            onChange={(e) => setStartingPoint(e.target.value)}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div>
          <button
            onClick={() =>
              handleGenerationButtonClicked({
                width: parseInt(width),
                height: parseInt(height),
                innerWidth: parseInt(innerWidth),
                innerHeight: parseInt(innerHeight),
                startingPoint,
                invalidElements,
              })
            }
          >
            <FaGear /> Generate
          </button>
          <button onClick={handleSolutionButtonClicked}>
            <FaFlag /> Solution
          </button>
        </div>
      </main>
    </div>
  );
}
