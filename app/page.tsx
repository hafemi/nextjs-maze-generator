"use client";
import {
  handleGenerationButtonClicked,
  handleSolutionButtonClicked,
} from "./maze-button-handler";
import {
  inputBuilder,
  dropdownBuilder,
  buttonBuilder
} from "./page-utils";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>MAZE GENERATOR</h1>
        <div className={styles.inputContainer}>
          {inputBuilder("width", "Width", "number", "1-100")}
          {inputBuilder("height", "Height", "number", "1-100")}
          {inputBuilder("inner width", "Inner Width", "number", "1-5")}
          {inputBuilder("inner height", "Inner Height", "number", "1-5")}
          {dropdownBuilder("startingpoint", "Starts at:", ["Top", "Bottom", "Left", "Right"])}
        </div>
        <div>
          {buttonBuilder("generate", "⚙️ Generate", handleGenerationButtonClicked)}
          {buttonBuilder("solution", "🚩 Solution", handleSolutionButtonClicked)}
        </div>
      </main>
    </div>
  );
}