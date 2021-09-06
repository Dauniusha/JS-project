export function createDivElement(className: string[]): HTMLElement {
  const container = document.createElement('div');
  container.classList.add(...className);
  return container;
}
