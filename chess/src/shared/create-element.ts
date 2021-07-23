export function createElement(classNames: string[]): HTMLElement {
  const elem = document.createElement('div');
  elem.classList.add(...classNames);
  return elem;
}
