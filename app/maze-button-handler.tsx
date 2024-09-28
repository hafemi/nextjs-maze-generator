export function handleGenerationButtonClicked(
  values: MazeGenerationConfig
): void {
  const isValid = validateElements(values);
  if (!isValid) return;

  const mazeGenerator = new MazeGenerator(
    values.width,
    values.height,
    values.startingPoint,
    values.animateCheckbox,
    values.animationSpeed
  );
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
}

class MazeGenerator {
  maze: number[][];

  constructor(
    public width: number,
    public height: number,
    public startingPoint: string,
    public animateCheckbox: boolean,
    public animationSpeed: number
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
        row.push(1);
      }
      maze.push(row);
    }
    return maze;
  }

  generateMaze(): void {
    this.maze = this.initMaze();
    this.createEntryForMaze();

    const x = this.randomOddNumber(1, this.width - 2);
    const y = this.randomOddNumber(1, this.height - 2);

    this.maze[y][x] = 0;
    this.carveMaze(x, y);
    this.updateMazeCanvas();
  }

  async carveMaze(x: number, y: number ): Promise<void> {
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
        this.maze[ny][nx] === 1
      ) {
        this.maze[ny - dy / 2][nx - dx / 2] = 0;
        this.maze[ny][nx] = 0;

        if (this.animateCheckbox) {
          this.updateMazeCanvas();
          await sleep(this.animationSpeed);
          await this.carveMaze(nx, ny)
        } else {
          this.carveMaze(nx, ny);
        }
      }
    }
  }

  updateMazeCanvas(): void {
    const mazeCanvas = document.getElementById(
      'mazeCanvas'
    ) as HTMLCanvasElement;
    const ctx = mazeCanvas.getContext('2d');
    const multiplier = 10;
    const newWidth = this.width * multiplier;
    const newHeight = this.height * multiplier;
    if (!ctx) return;

    mazeCanvas.width = newWidth;
    mazeCanvas.height = newHeight;

    for (let y = 0; y < this.maze.length; y++) {
      for (let x = 0; x < this.maze[y].length; x++) {
        if (this.maze[y][x] === 1) {
          ctx.fillStyle = 'black';
        } else {
          ctx.fillStyle = 'white';
        }
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier);
      }
    }
  }

  createEntryForMaze(): void {
    switch (this.startingPoint) {
      case 'top':
        const middlePointX = this.turnToOddNumber(Math.floor(this.width / 2));
        this.maze[0][middlePointX] = 0;
        this.maze[this.height - 1][middlePointX] = 0;
        break;
      case 'side':
        const middlePointY = this.turnToOddNumber(Math.floor(this.height / 2));
        this.maze[middlePointY][0] = 0;
        this.maze[middlePointY][this.width - 1] = 0;
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

export function handleSolutionButtonClicked(): void {
  console.log('clicked solution');
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}