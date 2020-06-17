import { TextFieldBase } from '@material/mwc-textfield/mwc-textfield-base';
import { style } from '@material/mwc-textfield/mwc-textfield-css';
import { customElement, css } from 'lit-element';

const myStyle = css`
  .mdc-text-field__input {
    font-size: 24px;
  }
  .mdc-text-field-helper-line {
    display: none;
  }
  .mdc-text-field {
    height: 2.5ex;
  }
  .mdc-text-field--invalid .mdc-text-field__input {
    caret-color: #b00020;
    background-color: #8f021c20;
  }
`;

@customElement('mkw-textfield')
export class TextField extends TextFieldBase {
  static styles = [style, myStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    'mkw-textfield': TextField;
  }
}
