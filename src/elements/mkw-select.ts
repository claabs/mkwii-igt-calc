import { SelectBase } from '@material/mwc-select/mwc-select-base';
import { style } from '@material/mwc-select/mwc-select-css';
import { customElement, css } from 'lit-element';

const myStyle = css`
  .mdc-select .mdc-floating-label {
    transform: translateY(-70%) scale(0.75);
    left: 16px;
    right: initial;
    top: 21px;
    pointer-events: none;
  }
`;

@customElement('mkw-select')
export class TextField extends SelectBase {
  static styles = [style, myStyle];
}

declare global {
  interface HTMLElementTagNameMap {
    'mkw-select': TextField;
  }
}
