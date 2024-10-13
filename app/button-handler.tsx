import { Dispatch, SetStateAction } from 'react';

enum MazeCellValue {
  Path = 0,
  Wall = 1,
  Solution = 2,
}

export enum StartingPoint {
  Top = 'top',
  Side = 'side',
  TopLeft = 'topleft',
  LeftTop = 'lefttop',
  Random = 'random',
  None = 'none',
}

interface MazeGenerationConfig {
  width: number;
  height: number;
  invalidElements: string[];
  minValues: Record<string, number>;
  maxValues: Record<string, number>;
  startingPoint: StartingPoint;
  animateCheckbox: boolean;
  animationSpeed: number;
  showSolutionCheckbox: boolean;
  showEntryExitCheckbox: boolean;
  pathColor: string;
  wallColor: string;
  solutionColor: string;
  entryColor: string;
  exitColor: string;
  maze: MazeGenerator | null;
  setMaze: Dispatch<SetStateAction<MazeGenerator | null>>;
}

interface Coordinate {
  row: number;
  col: number;
}

export function handleGenerationButtonClicked(values: MazeGenerationConfig): void {
  const isValid = validateElements(values);
  if (!isValid) return;
  if (values.maze) values.maze.isGenerating = false;

  const mazeGenerator = new MazeGenerator(
    values.width,
    values.height,
    values.startingPoint,
    values.animateCheckbox,
    values.animationSpeed,
    values.showSolutionCheckbox,
    values.showEntryExitCheckbox,
    values.pathColor,
    values.wallColor,
    values.solutionColor,
    values.entryColor,
    values.exitColor
  );
  values.setMaze(mazeGenerator);
  mazeGenerator.generateMaze();
}

export class MazeGenerator {
  maze: number[][];
  entryPoint: Coordinate = { row: 0, col: 0 };
  exitPoint: Coordinate = { row: 0, col: 0 };
  isGenerating: boolean = true;

  constructor(
    public width: number,
    public height: number,
    public startingPoint: StartingPoint,
    public animate: boolean,
    public animationSpeed: number,
    public showSolution: boolean,
    public showEntryExit: boolean,
    public pathColor: string,
    public wallColor: string,
    public solutionColor: string,
    public entryColor: string,
    public exitColor: string
  ) {
    this.width = this.turnToOddNumber(this.width);
    this.height = this.turnToOddNumber(this.height);
    this.maze = this.initMaze();
  }

  initMaze(): number[][] {
    const maze = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(MazeCellValue.Wall);
      }
      maze.push(row);
    }
    return maze;
  }

  async generateMaze(): Promise<void> {
    const x = this.randomOddNumber(1, this.width - 2);
    const y = this.randomOddNumber(1, this.height - 2);

    this.maze = this.initMaze();
    this.maze[y][x] = MazeCellValue.Path;
    await this.carveMaze(x, y);

    if (this.isGenerating) {
      this.createEntryAndExitForMaze();
      await this.solveMaze(this.entryPoint.row, this.entryPoint.col);
      this.updateMazeCanvas(this.showSolution, this.showEntryExit);
      this.isGenerating = false;
    }
  }

  async carveMaze(x: number, y: number): Promise<void> {
    if (!this.isGenerating) return;

    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => Math.random() - 0.5);

    for (let i = 0; i < dirs.length; i++) {
      const [dx, dy] = dirs[i];
      const nx = x + dx;
      const ny = y + dy;

      if (
        ny > 0 &&
        ny < this.height - 1 &&
        nx > 0 &&
        nx < this.width - 1 &&
        this.maze[ny][nx] === MazeCellValue.Wall &&
        this.isGenerating
      ) {
        this.maze[ny - dy / 2][nx - dx / 2] = MazeCellValue.Path;
        this.maze[ny][nx] = MazeCellValue.Path;

        if (this.animate) {
          this.updateMazeCanvas(false, false);
          await sleep(this.animationSpeed);
          await this.carveMaze(nx, ny);
        } else {
          this.carveMaze(nx, ny);
        }
      }
    }
  }

  createEntryAndExitForMaze(): void {
    const middlePointX = this.turnToOddNumber(Math.floor(this.width / 2));
    const middlePointY = this.turnToOddNumber(Math.floor(this.height / 2));
    const OFFSET_ONE = 1;
    const OFFSET_TWO = 2;

    const setEntryAndExit = (entryRow: number, entryCol: number, exitRow: number, exitCol: number) => {
      this.maze[entryRow][entryCol] = MazeCellValue.Path;
      this.maze[exitRow][exitCol] = MazeCellValue.Path;
      this.entryPoint = { row: entryRow, col: entryCol };
      this.exitPoint = { row: exitRow, col: exitCol };
    };

    let startingPoint = this.startingPoint;
    if (startingPoint == StartingPoint.Random)
      startingPoint = [
        StartingPoint.Top,
        StartingPoint.Side,
        StartingPoint.TopLeft,
        StartingPoint.LeftTop,
        StartingPoint.None
      ][Math.floor(Math.random() * 5)];

    switch (startingPoint) {
      case StartingPoint.Top:
        setEntryAndExit(0, middlePointX, this.height - 1, middlePointX);
        break;
      case StartingPoint.Side:
        setEntryAndExit(middlePointY, 0, middlePointY, this.width - 1);
        break;
      case StartingPoint.TopLeft:
        setEntryAndExit(0, OFFSET_ONE, this.height - 1, this.width - OFFSET_TWO);
        break;
      case StartingPoint.LeftTop:
        setEntryAndExit(OFFSET_ONE, 0, this.height - OFFSET_TWO, this.width - 1);
        break;
      default:
        break;
    }
  }

  async solveMaze(startRow: number, startCol: number): Promise<void> {
    if (this.startingPoint !== StartingPoint.None && (await this.explore(startRow, startCol))) {
      this.maze[this.exitPoint.row][this.exitPoint.col] = MazeCellValue.Solution;
    }
  }

  async explore(row: number, col: number): Promise<boolean> {
    const directionOffsets: { [key: string]: Coordinate; } = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };
    const directions = ['up', 'down', 'left', 'right'];
    if (!isValid(row, col, this.maze) || this.maze[row][col] !== MazeCellValue.Path || !this.isGenerating) {
      return false;
    }

    this.maze[row][col] = MazeCellValue.Solution;
    if (this.showSolution && this.animate) {
      this.updateMazeCanvas(this.showSolution, false);
      await sleep(this.animationSpeed);
    }

    if (row === this.exitPoint.row && col === this.exitPoint.col) {
      return true;
    }

    for (const direction of directions) {
      const { row: dRow, col: dCol } = directionOffsets[direction];
      if (await this.explore(row + dRow, col + dCol)) {
        return true;
      }
    }

    this.maze[row][col] = MazeCellValue.Path;
    return false;

    function isValid(row: number, col: number, maze: number[][]): boolean {
      return row >= 0 && row < maze.length && col >= 0 && col < maze[row].length;
    }
  }

  updateMazeCanvas(showSolution: boolean, showEntryExit: boolean): void {
    const mazeCanvas = document.getElementById('mazeCanvas') as HTMLCanvasElement;
    const ctx = mazeCanvas.getContext('2d');
    const multiplier = 10;
    if (!ctx) return;

    mazeCanvas.width = this.width * multiplier;
    mazeCanvas.height = this.height * multiplier;

    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[y].length; x++) {
        this.setFillColor({ ctx, coordinate: { row: y, col: x }, showSolution, showEntryExit });
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier);
      }
    }
  }

  setFillColor(options: {
    ctx: CanvasRenderingContext2D,
    coordinate: Coordinate,
    showSolution: boolean,
    showEntryExit: boolean;
  }): void {
    if (
      options.showEntryExit &&
      this.startingPoint !== StartingPoint.None &&
      this.startingPoint !== StartingPoint.Random
    ) {
      if (options.coordinate.row === this.entryPoint.row && options.coordinate.col === this.entryPoint.col) {
        options.ctx.fillStyle = this.entryColor;
        return;
      } else if (options.coordinate.row === this.exitPoint.row && options.coordinate.col === this.exitPoint.col) {
        options.ctx.fillStyle = this.exitColor;
        return;
      }
    }
    
    switch (this.maze[options.coordinate.row][options.coordinate.col]) {
      case MazeCellValue.Wall:
        options.ctx.fillStyle = this.wallColor;
        break
      case MazeCellValue.Solution:
        options.ctx.fillStyle = options.showSolution ? this.solutionColor : this.pathColor;
        break
      default:
        options.ctx.fillStyle = this.pathColor;
        break
    }
  }

  turnToOddNumber(value: number): number {
    return value % 2 === 0 ? value + 1 : value;
  }

  randomOddNumber(min: number, max: number): number {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num % 2 === 0 ? num + 1 : num;
  }
}

function validateElements({ width, height, invalidElements, minValues, maxValues }: MazeGenerationConfig): boolean {
  if (invalidElements.length > 0) return false;

  // prettier-ignore
  const dimensions = [
    { value: width, min: minValues.width, max: maxValues.width },
    { value: height, min: minValues.height, max: maxValues.height },
  ];

  for (const { value, min, max } of dimensions) {
    if (value < min || value > max) return false;
  }

  return true;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
