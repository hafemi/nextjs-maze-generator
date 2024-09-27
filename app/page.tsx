'use client';
import { useState } from 'react';
import { FaFlag, FaGear } from 'react-icons/fa6';
import {
  handleGenerationButtonClicked,
  handleSolutionButtonClicked,
} from './maze-button-handler';
import styles from './page.module.css';

const minValues: Record<string, number> = {
  width: 7,
  height: 7,
  innerWidth: 0,
  innerHeight: 0,
};

const maxValues: Record<string, number> = {
  width: 200,
  height: 200,
  innerWidth: 195,
  innerHeight: 195,
};

export default function Home() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [innerWidth, setInnerWidth] = useState('');
  const [innerHeight, setInnerHeight] = useState('');
  const [startingPoint, setStartingPoint] = useState('top');
  const [invalidElements, setInvalidElements] = useState<string[]>([]);

  const validateElement = ({
    value,
    min,
    max,
    elementId,
  }: {
    value: number;
    min: number;
    max: number;
    elementId: string;
  }): void => {
    if ((!isNaN(value) && value < min) || value > max) {
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
              ${invalidElements.includes('width') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="width"
            type="number"
            placeholder={`${minValues.width}-${maxValues.width}`}
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.width,
                max: maxValues.width,
                elementId: 'width',
              });
            }}
          />
          <br />
          <label htmlFor="height">Height</label>
          <input
            className={`
              ${invalidElements.includes('height') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="height"
            type="number"
            placeholder={`${minValues.height}-${maxValues.height}`}
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.height,
                max: maxValues.height,
                elementId: 'height',
              });
            }}
          />
          <br />
          <label htmlFor="innerWidth">Inner Width</label>
          <input
            className={`
              ${invalidElements.includes('innerWidth') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="innerWidth"
            type="number"
            placeholder={`${minValues.innerWidth}-${maxValues.innerWidth}`}
            value={innerWidth}
            onChange={(e) => {
              setInnerWidth(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.innerWidth,
                max: maxValues.innerWidth,
                elementId: 'innerWidth',
              });
            }}
          />
          <br />
          <label htmlFor="innerHeight">Inner Height</label>
          <input
            className={`
              ${invalidElements.includes('innerHeight') ? styles.invalid : ''}
              ${styles.input}
            `}
            id="innerHeight"
            type="number"
            placeholder={`${minValues.innerHeight}-${maxValues.innerHeight}`}
            value={innerHeight}
            onChange={(e) => {
              setInnerHeight(e.target.value);
              validateElement({
                value: parseInt(e.target.value),
                min: minValues.innerHeight,
                max: maxValues.innerHeight,
                elementId: 'innerHeight',
              });
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
            <option value="side">Side</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <button
            onClick={() =>
              handleGenerationButtonClicked({
                width: getNumber(width),
                height: getNumber(height),
                innerWidth: getNumber(innerWidth) ?? 0,
                innerHeight: getNumber(innerHeight) ?? 0,
                invalidElements,
                minValues,
                maxValues,
                startingPoint,
              })
            }
          >
            <FaGear /> Generate
          </button>
          <button onClick={handleSolutionButtonClicked}>
            <FaFlag /> Solution
          </button>
        </div>
        <canvas id="mazeCanvas" width="0" height="0"></canvas>
      </main>
    </div>
  );
}

function getNumber(value: string): number {
  return isNaN(parseInt(value)) ? 0 : parseInt(value);
}
