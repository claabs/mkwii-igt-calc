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

  @query('#minute')
  private minuteElem!: TextField | null;

  @query('#second')
  private secondElem!: TextField | null;

  @query('#millisecond')
  private millisecondElem!: TextField | null;

  static styles = css`
    :host {
      display: block;
      font-family: var(
        --mdc-typography-subtitle1-font-family,
        var(--mdc-typography-font-family, Roboto, sans-serif)
      );
    }

    :host([focused]) {
      outline: none;
    }

    /* :host([hidden]) {
      display: none !important;
    } */

    .separator-char {
      padding: 1em 0 0 0;
      /* font-size: 24px; */
    }

    .minute {
      width: 1ch;
      text-align: right;
    }

    .second {
      width: 2ch;
      text-align: right;
    }

    .millisecond {
      width: 3ch;
      text-align: left;
    }

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
  `;

  render() {
    return html`
      <div class="floated-label-placeholder">${this.label}</div>
      <div class="layout horizontal">
        <mwc-textfield
          id="minute"
          class="minute"
          @keydown=${this.minuteKeydown}
          @input=${this.minuteInput}
          @blur=${this.minuteBlur}
          ?autoValidate=${true}
          placeholder=${this.plcMinutes}
          type="text"
          ?required=${true}
          value=${this.minutes}
          pattern="[0-9]+"
          inputMode="numeric"
          maxLength="1"
          .validityTransform=${this.minuteValidator}
          ?fullwidth=${true}
        ></mwc-textfield>
        <div class="separator-char">:</div>
        <mwc-textfield
          id="second"
          class="second"
          @keydown=${this.secondKeydown}
          @input=${this.secondInput}
          @blur=${this.secondBlur}
          ?autoValidate=${true}
          placeholder=${this.plcSeconds}
          type="text"
          ?required=${true}
          value=${this.seconds}
          pattern="[0-9]+"
          inputMode="numeric"
          maxLength="2"
          .validityTransform=${this.secondValidator}
          ?fullwidth=${true}
        ></mwc-textfield>
        <div class="separator-char">.</div>
        <mwc-textfield
          id="millisecond"
          class="millisecond"
          @keydown=${this.msKeydown}
          @input=${this.msInput}
          @blur=${this.msBlur}
          ?autoValidate=${true}
          placeholder=${this.plcMilliseconds}
          type="text"
          ?required=${true}
          value=${this.milliseconds}
          pattern="[0-9]+"
          inputMode="numeric"
          maxLength="3"
          .validityTransform=${this.msValidator}
          ?fullwidth=${true}
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

  private minuteInput(e: InputEvent) {
    if (e.target) {
      if (!this.minuteElem) throw new Error('Missing minuteElem');
      const val = this.minuteElem.value.replace(/[^0-9]/, '');
      this.minuteElem.value = val;
    }
  }

  private minuteValidator(
    value: string,
    nativeValidity: ValidityState
  ): Partial<ValidityState> {
    return validateTime(value, nativeValidity, 0, 9);
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

  private secondKeydown(e: KeyboardEvent) {
    if (e.target) {
      if (e.keyCode === 110 || e.keyCode === 13) {
        // Dot or enter
        if (!this.millisecondElem) throw new Error('Missing msElem');
        this.millisecondElem.focus();
      }
    }
  }

  private secondInput(e: InputEvent) {
    if (e.target) {
      if (!this.secondElem) throw new Error('Missing secondElem');
      const val = this.secondElem.value.replace(/[^0-9]/, '');
      this.secondElem.value = val;
    }
  }

  private secondValidator(
    value: string,
    nativeValidity: ValidityState
  ): Partial<ValidityState> {
    return validateTime(value, nativeValidity, 0, 59);
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

  private msInput(e: InputEvent) {
    if (e.target) {
      if (!this.millisecondElem) throw new Error('Missing msElem');
      const val = this.millisecondElem.value.replace(/[^0-9]/, '');
      this.millisecondElem.value = val;
    }
  }

  private msValidator(
    value: string,
    nativeValidity: ValidityState
  ): Partial<ValidityState> {
    return validateTime(value, nativeValidity, 0, 999);
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

function validateTime(
  value: string,
  nativeValidity: ValidityState,
  min: number,
  max: number
): Partial<ValidityState> {
  if (!nativeValidity.valid) return nativeValidity;
  const valueNumber = Number(value);
  const isNotInteger = !Number.isInteger(valueNumber);
  const tooSmall = valueNumber < min;
  const tooLarge = valueNumber > max;
  return {
    valid: !(isNotInteger || tooLarge || tooSmall),
    typeMismatch: isNotInteger,
    rangeOverflow: tooLarge,
    rangeUnderflow: tooSmall,
  };
}
