export function createSwitchBtns(name: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('confirm-btn', 'switch-page__btn');
  button.innerHTML = name;
  return button;
}
