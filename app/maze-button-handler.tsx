export function handleGenerationButtonClicked(): void {
  const widthElement = document.getElementById("width") as HTMLInputElement;
  const heightElement = document.getElementById("height") as HTMLInputElement;
  let HasEmptyValue: boolean = false;
  
  if (widthElement.value.trim() == '') {
    widthElement.style.backgroundColor = 'red'
    HasEmptyValue = true
  } else if (widthElement.style.backgroundColor == 'red')
    widthElement.style.backgroundColor = '';

  if (heightElement.value.trim() == '') {
    heightElement.style.backgroundColor = 'red'
    HasEmptyValue = true
  } else if (heightElement.style.backgroundColor == 'red')
    heightElement.style.backgroundColor = '';
  
  if (HasEmptyValue)
    return;
}

export function handleSolutionButtonClicked(): void {
  console.log("clicked");
}