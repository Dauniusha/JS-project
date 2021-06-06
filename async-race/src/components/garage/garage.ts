import { BaseComponents } from "../models/base-component";
import { Field } from "../models/field/field";
import { InputField } from "../models/input-field/input-field";

export class Garage extends Field {
  private readonly createInput: InputField;
  private readonly updateInput: InputField;

  constructor() {
    super(['garage']);

    this.createInput = new InputField('create');
    this.element.appendChild(this.createInput.element);

    this.updateInput = new InputField('update');
    this.element.appendChild(this.updateInput.element);

  }

  private generateInputs() {
    
  }
}