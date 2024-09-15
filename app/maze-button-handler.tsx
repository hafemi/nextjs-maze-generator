export function handleGenerationButtonClicked({
  width,
  height,
  innerWidth,
  innerHeight,
  startingPoint,
  invalidElements,
}: {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  startingPoint: string;
  invalidElements: string[];
}): void {
  if (invalidElements.length > 0) return;
  console.log(width, height, innerWidth, innerHeight, startingPoint);
}

export function handleSolutionButtonClicked(): void {
  console.log("clicked solution");
}
