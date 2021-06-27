export class BaseComponents {
  readonly element: HTMLElement;

  constructor(tag: keyof HTMLElementTagNameMap = 'div', classes: string[] = []) {
    this.element = document.createElement(tag);
    this.element.classList.add(...classes);
  }
}