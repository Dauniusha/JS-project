function randomColorElement(): string {
  return Math.round(Math.random() * 255).toString(16);
}

export function getRandomColor(): string {
  const red = randomColorElement();
  const green = randomColorElement();
  const blue = randomColorElement();
  return `#${red}${green}${blue}`;
}
