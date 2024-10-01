import { Dispatch, SetStateAction } from 'react';

enum CellValues {
  Path = 0,
  Wall = 1,
  Solution = 2,
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
    values.showSolutionCheckbox
  );
  values.setMaze(mazeGenerator);
  mazeGenerator.generateMaze();
}
interface MazeGenerationConfig {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  invalidElements: string[];
  minValues: Record<string, number>;
  maxValues: Record<string, number>;
  startingPoint: string;
  animateCheckbox: boolean;
  animationSpeed: number;
  showSolutionCheckbox: boolean;
  maze: MazeGenerator | null;
  setMaze: Dispatch<SetStateAction<MazeGenerator | null>>;
}

interface Coordinate {
  row: number;
  col: number;
}

export class MazeGenerator {
  maze: number[][];
  entryPoint: Coordinate = { row: 0, col: 0 };
  exitPoint: Coordinate = { row: 0, col: 0 };
  isGenerating: boolean = true;

  constructor(
    public width: number,
    public height: number,
    public startingPoint: string,
    public animateCheckbox: boolean,
    public animationSpeed: number,
    public showSolutionCheckbox: boolean
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
        row.push(CellValues.Wall);
      }
      maze.push(row);
    }
    return maze;
  }

  async generateMaze(): Promise<void> {
    const x = this.randomOddNumber(1, this.width - 2);
    const y = this.randomOddNumber(1, this.height - 2);

    this.maze = this.initMaze();
    this.maze[y][x] = CellValues.Path;
    await this.carveMaze(x, y);

    if (this.isGenerating) {
      this.createEntryAndExitForMaze();
      await this.solveMaze(this.entryPoint.row, this.entryPoint.col);
      this.updateMazeCanvas(this.showSolutionCheckbox);
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
        this.maze[ny][nx] === CellValues.Wall &&
        this.isGenerating
      ) {
        this.maze[ny - dy / 2][nx - dx / 2] = CellValues.Path;
        this.maze[ny][nx] = CellValues.Path;

        if (this.animateCheckbox) {
          this.updateMazeCanvas(false);
          await sleep(this.animationSpeed);
          await this.carveMaze(nx, ny);
        } else {
          this.carveMaze(nx, ny);
        }
      }
    }
  }

  updateMazeCanvas(showSolutionCheckbox: boolean): void {
    const mazeCanvas = document.getElementById('mazeCanvas') as HTMLCanvasElement;
    const ctx = mazeCanvas.getContext('2d');
    const multiplier = 10;
    const newWidth = this.width * multiplier;
    const newHeight = this.height * multiplier;
    if (!ctx) return;

    mazeCanvas.width = newWidth;
    mazeCanvas.height = newHeight;

    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[y].length; x++) {
        if (this.maze[y][x] === CellValues.Wall) {
          ctx.fillStyle = 'black';
        } else if (this.maze[y][x] === CellValues.Solution && showSolutionCheckbox) {
          ctx.fillStyle = 'red';
        } else {
          ctx.fillStyle = 'white';
        }
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier);
      }
    }
  }

  createEntryAndExitForMaze(): void {
    switch (this.startingPoint) {
      case 'top':
        const middlePointX = this.turnToOddNumber(Math.floor(this.width / 2));
        this.maze[0][middlePointX] = CellValues.Path;
        this.maze[this.height - 1][middlePointX] = CellValues.Path;
        this.entryPoint = { row: 0, col: middlePointX };
        this.exitPoint = { row: this.height - 1, col: middlePointX };
        break;
      case 'side':
        const middlePointY = this.turnToOddNumber(Math.floor(this.height / 2));
        this.maze[middlePointY][0] = CellValues.Path;
        this.maze[middlePointY][this.width - 1] = CellValues.Path;
        this.entryPoint = { row: middlePointY, col: 0 };
        this.exitPoint = { row: middlePointY, col: this.width - 1 };
        break;
      case 'topleft':
        this.maze[0][1] = CellValues.Path;
        this.maze[this.height - 1][this.width - 2] = CellValues.Path;
        this.entryPoint = { row: 0, col: 1 };
        this.exitPoint = { row: this.height - 1, col: this.width - 2 };
        break;
      case 'lefttop':
        this.maze[1][0] = CellValues.Path;
        this.maze[this.height - 2][this.width - 1] = CellValues.Path;
        this.entryPoint = { row: 1, col: 0 };
        this.exitPoint = { row: this.height - 2, col: this.width - 1 };
        break;
      default:
        break;
    }
  }

  turnToOddNumber(value: number): number {
    return value % 2 === 0 ? value + 1 : value;
  }

  randomOddNumber(min: number, max: number): number {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num % 2 === 0 ? num + 1 : num;
  }

  async solveMaze(startRow: number, startCol: number): Promise<void> {
    if (await this.explore(startRow, startCol)) {
      this.maze[this.exitPoint.row][this.exitPoint.col] = CellValues.Solution;
    }
  }

  async explore(row: number, col: number): Promise<boolean> {
    const directionOffsets: { [key: string]: Coordinate } = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };
    const directions = ['up', 'down', 'left', 'right'];
    if (!isValid(row, col, this.maze) || this.maze[row][col] !== CellValues.Path || !this.isGenerating) {
      return false;
    }

    this.maze[row][col] = CellValues.Solution;
    if (this.showSolutionCheckbox && this.animateCheckbox) {
      this.updateMazeCanvas(this.showSolutionCheckbox);
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

    this.maze[row][col] = CellValues.Path;
    return false;

    function isValid(row: number, col: number, maze: number[][]): boolean {
      return row >= 0 && row < maze.length && col >= 0 && col < maze[row].length;
    }
  }
}

function validateElements({
  width,
  height,
  innerWidth,
  innerHeight,
  invalidElements,
  minValues,
  maxValues,
}: MazeGenerationConfig): boolean {
  if (invalidElements.length > 0) return false;

  // prettier-ignore
  const dimensions = [
    { value: width, min: minValues.width, max: maxValues.width },
    { value: height, min: minValues.height, max: maxValues.height },
    { value: innerWidth, min: minValues.innerWidth, max: maxValues.innerWidth },
    { value: innerHeight, min: minValues.innerHeight, max: maxValues.innerHeight },
  ];

  for (const { value, min, max } of dimensions) {
    if (value < min || value > max) return false;
  }

  return true;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
