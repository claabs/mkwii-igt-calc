import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
} from 'lit-element';
import { TextField } from '@material/mwc-textfield';
import '@material/mwc-textfield';
import { TimeDurationInputEvent } from './data/types';

@customElement('time-duration-input')
export class TimeDurationInput extends LitElement {
  @property({ type: String, reflect: true })
  private minutes = '';

  @property({ type: String, reflect: true })
  private seconds = '';

  @property({ type: String, reflect: true })
  private milliseconds = '';

  @property({ type: String, attribute: true })
  private plcMinutes = '';

  @property({
    type: String,
    attribute: true,
    converter: {
      fromAttribute: (value: string): string => value.padStart(2, '0'),
    },
  })
  private plcSeconds = '';

  @property({
    type: String,
    attribute: true,
    converter: {
      fromAttribute: (value: string): string => value.padEnd(3, '0'),
    },
  })
  private plcMilliseconds = '';

  @property({ type: String, attribute: true })
  private label = '';

  @property({ type: Number, attribute: true })
  private index = 0;

  // @query('#minute')
  // private minuteElem!: TextField | null;

  @query('#second')
  private secondElem!: TextField | null;

  @query('#millisecond')
  private millisecondElem!: TextField | null;

  static styles = css`
    :host {
      display: block;
      font-size: 24px;
    }

    :host([focused]) {
      outline: none;
    }

    /* :host([hidden]) {
      display: none !important;
    } */

    .separator-char {
      line-height: 28px;
      padding: 8px 0 10px 0;
      /* color: var(--paper-input-container-shared-input-style_-_color); */
    }

    .minute {
      /* --paper-input-container-shared-input-style: {
        width: 1ch;
        -webkit-appearance: textfield;
      } */
      text-align: right;
    }

    .second {
      /* --paper-input-container-shared-input-style: {
        width: 2ch;
        -webkit-appearance: textfield;
      } */
      text-align: right;
    }

    .millisecond {
      /* --paper-input-container-shared-input-style: {
        width: 3ch;
        -webkit-appearance: textfield;
      } */
      text-align: left;
    }
    /* 
    paper-input {
      --paper-input-container-input-webkit-spinner: {
        -webkit-appearance: none;
      }
      --paper-input-container-input: {
        font-size: 24px;
      }
    } */

    .layout {
      display: flex;
    }

    .layout.horizontal {
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      flex-direction: row;
    }

    .layout.center,
    .layout.center-center {
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }

    /* 
    .floated-label-placeholder {
      @apply --paper-font-caption;
      color: var(--paper-input-container-color, var(--secondary-text-color));
    } */
  `;

  render() {
    return html`
      <div class="floated-label-placeholder">${this.label}</div>
      <div class="layout horizontal center">
        <mwc-textfield
          id="minute"
          class="minute"
          @keydown=${this.minuteKeydown}
          @blur=${this.minuteBlur}
          ?autoValidate=${true}
          max="9"
          min="0"
          placeholder=${this.plcMinutes}
          type="number"
          value=${this.minutes}
          pattern="[0-9]"
        ></mwc-textfield>
        <div class="separator-char">:</div>
        <mwc-textfield
          id="second"
          class="second"
          @keydown=${this.secondKeydown}
          @blur=${this.secondBlur}
          ?autoValidate=${true}
          max="59"
          min="0"
          placeholder=${this.plcSeconds}
          type="number"
          value=${this.seconds}
          pattern="[0-9]"
        ></mwc-textfield>
        <div class="separator-char">.</div>
        <mwc-textfield
          id="millisecond"
          class="millisecond"
          @keydown=${this.msKeydown}
          @input=${this.msInput}
          @blur=${this.msBlur}
          ?autoValidate=${true}
          max="999"
          min="0"
          placeholder=${this.plcMilliseconds}
          type="number"
          value=${this.milliseconds}
          pattern="[0-9]"
        ></mwc-textfield>
      </div>
    `;
  }

  change() {
    const changeEvt: TimeDurationInputEvent = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        index: this.index,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
      },
    });
    this.dispatchEvent(changeEvt);
  }

  private minuteKeydown(e: KeyboardEvent) {
    if (e.target) {
      if (e.keyCode === 186 || e.keyCode === 110 || e.keyCode === 13) {
        // Semicolon, dot, or enter
        if (!this.secondElem) throw new Error('Missing secondElem');
        this.secondElem.focus();
      }
    }
  }

  private secondKeydown(e: KeyboardEvent) {
    if (e.target) {
      if (e.keyCode === 110 || e.keyCode === 13) {
        // Dot or enter
        if (!this.millisecondElem) throw new Error('Missing msElem');
        this.millisecondElem.focus();
      }
    }
  }

  private msInput(e: InputEvent) {
    if (e.target) {
      if (!this.millisecondElem) throw new Error('Missing secondElem');
      const val = this.millisecondElem.value.replace(/[.n]/, '');
      this.millisecondElem.value = val;
    }
  }

  private msKeydown(e: KeyboardEvent) {
    if (e.target) {
      if (e.keyCode === 13) {
        // Enter
        const neighbor = (this.getRootNode() as TimeDurationInput).querySelector(
          `#course-${this.index + 1}`
        );
        if (neighbor) {
          const { shadowRoot } = neighbor;
          if (!shadowRoot) throw new Error('Missing shadow root');
          const minuteElem = shadowRoot.getElementById(
            'minute'
          ) as TextField | null;
          if (!minuteElem) throw new Error('Missing minute elem');
          minuteElem.focus();
        }
      }
    }
  }

  private minuteBlur(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      this.minutes = target.value;
      if (!target.value) {
        target.setCustomValidity('Missing');
      }
      this.change();
    }
  }

  private secondBlur(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;

      if (!target.value) {
        target.setCustomValidity('Missing');
      } else {
        if (!this.secondElem) throw new Error('Missing secondElem');
        this.secondElem.value = target.value.padStart(2, '0');
      }
      this.seconds = target.value;
      this.change();
    }
  }

  private msBlur(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      if (!target.value) {
        target.setCustomValidity('Missing');
      } else {
        if (!this.millisecondElem) throw new Error('Missing secondElem');
        this.millisecondElem.value = target.value.padEnd(3, '0');
      }
      this.milliseconds = target.value;
      this.change();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-duration-input': TimeDurationInput;
  }
}
