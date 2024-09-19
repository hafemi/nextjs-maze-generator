class MazeGenerator {
  maze: number[][];

  constructor(public width: number, public height: number) {
    this.maze = this.initMaze();
  }

  initMaze(): number[][] {
    const maze = [];
    for (let y = 0; y < this.height * 2 + 1; y++) {
      const row = [];
      for (let x = 0; x < this.width * 2 + 1; x++) {
        row.push(1);
      }
      maze.push(row);
    }
    return maze;
  }

  generateMaze(): void {
    // Randomly select a starting point, ensure it's an odd number.
    const x = Math.floor(Math.random() * this.width) * 2 + 1;
    const y = Math.floor(Math.random() * this.height) * 2 + 1;
    this.maze[y][x] = 0;

    this.carveMaze(x, y);

    // Create an entry and an exit
    this.maze[1][0] = 0; // Entry
    this.maze[this.height * 2 - 1][this.width * 2] = 0; // Exit
  }

  // Carve maze using recursive backtracking
  carveMaze(x: number, y: number) {
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
        ny < this.height * 2 &&
        nx > 0 &&
        nx < this.width * 2 &&
        this.maze[ny][nx] === 1
      ) {
        this.maze[ny - dy / 2][nx - dx / 2] = this.maze[ny][nx] = 0;
        this.carveMaze(nx, ny);
      }
    }
  }
}

interface MazeGenerationConfig {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  invalidElements: string[];
  minValues: Record<string, number>;
  maxValues: Record<string, number>;
}

export function handleGenerationButtonClicked(
  values: MazeGenerationConfig
): void {
  const isValid = validateElements(values);
  if (!isValid) return;

  const mazeGenerator = new MazeGenerator(values.width, values.height);
  mazeGenerator.generateMaze();

  console.log(createStringFromMaze(mazeGenerator.maze));
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

function createStringFromMaze(maze: number[][]): string {
  let string = "";
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 1) {
        string += "#";
      } else {
        string += " ";
      }
    }
    string += "\n";
  }
  return string;
}

export function handleSolutionButtonClicked(): void {
  console.log("clicked solution");
}
