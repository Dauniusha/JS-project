import './field.css';
import { BaseComponents } from '../base-component';

export class Field extends BaseComponents {
  readonly contantsField: BaseComponents;

  constructor(sectionName: string[], ownContainerName?: string) {
    super('section', sectionName);
    this.contantsField = ownContainerName ? new BaseComponents('div', ['container-field', ownContainerName])
      : new BaseComponents('div', ['container-field']);
    this.element.appendChild(this.contantsField.element);
  }
}
