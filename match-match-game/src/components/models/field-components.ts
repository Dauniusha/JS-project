import { BaseComponents } from './base-conponents';

export class Field extends BaseComponents {
  readonly contantsField: BaseComponents;

  constructor(sectionName = 'about', ownName?: string) {
    super('section', [sectionName]);
    const FIELD = new BaseComponents('div', ['container-field']);
    if (ownName) {
      this.contantsField = new BaseComponents('div', ['container-main', ownName]);
    } else {
      this.contantsField = new BaseComponents('div', ['container-main']);
    }
    this.element.appendChild(FIELD.element).appendChild(this.contantsField.element);
  }
}
