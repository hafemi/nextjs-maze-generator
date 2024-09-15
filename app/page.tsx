"use client";
import styles from "./page.module.css";
import {
  handleGenerationButtonClicked,
  handleSolutionButtonClicked,
} from "./maze-button-handler";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.heading}>MAZE GENERATOR</h1>
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="width">Width</label>
            <input
              type="number"
              id="width"
              name="width"
              placeholder="20"
            ></input>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="height">Height</label>
            <input
              type="number"
              id="height"
              name="height"
              placeholder="20"
            ></input>
          </div>
        </div>
        <div>
          <button
            className={styles.button}
            id="generate"
            onClick={handleGenerationButtonClicked}
          >
            ⚙️ Generate
          </button>
          <button
            className={styles.button}
            id="solution"
            onClick={handleSolutionButtonClicked}
          >
            🚩 Solution
          </button>
        </div>
      </main>
    </div>
  );
}