import { BaseComponents } from '../base-component';
import './input-field.css';

export class InputField extends BaseComponents {
  readonly name: HTMLInputElement;
  readonly color: HTMLInputElement;
  readonly confirmButton: HTMLButtonElement;

  constructor(purpose: string) {
    super('div', ['input-field']);

    this.name = <HTMLInputElement>this.initInput(['car-name']);
    this.name.type = 'text';

    this.color = <HTMLInputElement>this.initInput(['car-color']);
    this.color.type = 'color';
    
    this.confirmButton = <HTMLButtonElement>this.initInput(['confirm-btn'], purpose);
  }

  private initInput(className: string[], purpose?: string): HTMLElement {
    let input: HTMLInputElement | HTMLButtonElement;
    if (purpose) {
      input = document.createElement('button');
      input.innerHTML = purpose;
    } else {
      input = document.createElement('input');
    }
    input.classList.add(...className);
    this.element.appendChild(input);
    return input;
  }
}