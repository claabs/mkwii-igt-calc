import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base';
import { styles } from '@material/mwc-textfield/mwc-textfield.css';
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

const myStyle = css`
  .mdc-text-field__input {
    font-size: 24px;
  }
  .mdc-text-field-helper-line {
    display: none;
  }
  .mdc-text-field {
    height: 2.5ex;
    padding: 0;
  }
  .mdc-text-field--invalid .mdc-text-field__input {
    caret-color: #b00020;
    background-color: #8f021c20;
  }
`;

@customElement('mkw-textfield')
export class TextField extends TextFieldBase {
  static override styles = [styles, myStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    'mkw-textfield': TextField;
  }
}
