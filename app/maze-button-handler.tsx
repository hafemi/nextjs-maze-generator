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

  generateMaze(values.width, values.height);
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
    { value: innerHeight, min: minValues.innerHeight, max: maxValues.innerHeight},
  ];

  for (const { value, min, max } of dimensions) {
    if (value < min || value > max) return false;
  }

  return true;
}

function generateMaze(width: number, height: number): void {
  const N = 1;
  const S = 2;
  const E = 4;
  const W = 8;

  const grid: number[][] = new Array(height)
    .fill([])
    .map(() => new Array(width).fill(0));

  const dx: Record<number, number> = { [E]: 1, [W]: -1, [N]: 0, [S]: 0 };
  const dy: Record<number, number> = { [E]: 0, [W]: 0, [N]: -1, [S]: 1 };
  const opposite: Record<number, number> = { [E]: W, [W]: E, [N]: S, [S]: N };

  carve_passages_from({ cx: 1, cy: 0, grid });
  const ascii = createASCII({ width, height, grid, S, E });

  console.log(ascii);

  function carve_passages_from({
    cx,
    cy,
    grid,
  }: {
    cx: number;
    cy: number;
    grid: number[][];
  }): void {
    const directions: number[] = shuffleArray([N, S, E, W]);

    directions.forEach((direction) => {
      const nx = cx + dx[direction];
      const ny = cy + dy[direction];

      if (
        ny >= 0 &&
        ny < grid.length &&
        nx >= 0 &&
        nx < grid[ny].length &&
        grid[ny][nx] === 0
      ) {
        grid[cy][cx] |= direction;
        grid[ny][nx] |= opposite[direction];
        carve_passages_from({ cx: nx, cy: ny, grid });
      }
    });
  }
}

function createASCII({
  width,
  height,
  grid,
  S,
  E,
}: {
  width: number;
  height: number;
  grid: number[][];
  S: number;
  E: number;
}): string {
  let ascii = " " + "_".repeat(width * 2 - 1);

  for (let h = 0; h < height; h++) {
    let row = "|";
    for (let w = 0; w < width; w++) {
      row += (grid[h][w] & S) != 0 ? " " : "_";
      if (grid[h][w] & E) {
        row += ((grid[h][w] | grid[h][w + 1]) & S) != 0 ? " " : "_";
      } else {
        row += "|";
      }
    }
    ascii += "\n" + row;
  }

  return ascii;
}

function shuffleArray<T>(arr: T[]): T[] {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

export function handleSolutionButtonClicked(): void {
  console.log("clicked solution");
}
