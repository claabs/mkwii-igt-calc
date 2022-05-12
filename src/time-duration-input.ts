import { LitElement, html, css } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import './elements/mkw-textfield';
import { TextField } from './elements/mkw-textfield';
import { TimeDurationInputEvent } from './data/types';

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

@customElement('time-duration-input')
export class TimeDurationInput extends LitElement {
  @property({ type: String, reflect: true })
  public minutes = '';

  @property({ type: String, reflect: true })
  public seconds = '';

  @property({ type: String, reflect: true })
  public milliseconds = '';

  @property({ type: String, attribute: true })
  public plcMinutes = '';

  @property({
    type: String,
    attribute: true,
    converter: {
      fromAttribute: (value: string): string => value.padStart(2, '0'),
    },
  })
  public plcSeconds = '';

  @property({
    type: String,
    attribute: true,
    converter: {
      fromAttribute: (value: string): string => value.padEnd(3, '0'),
    },
  })
  public plcMilliseconds = '';

  @property({ type: String, attribute: true })
  public label = '';

  @property({ type: Number, attribute: true })
  public index = 0;

  @query('#minute')
  private minuteElem!: TextField | null;

  @query('#second')
  private secondElem!: TextField | null;

  @query('#millisecond')
  private millisecondElem!: TextField | null;

  static override styles = css`
    :host {
      display: block;
      font-family: var(
        --mdc-typography-subtitle1-font-family,
        var(--mdc-typography-font-family, Roboto, sans-serif)
      );
    }

    .floated-label-placeholder {
      margin-bottom: 4px;
    }

    .separator-char {
      padding-top: calc(2.5ex - 56px);
      /* font-size: 24px; */
    }

    .time-inputs {
      font-size: 24px;
      margin-bottom: 12px;
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
  `;

  override render() {
    return html`
      <div class="floated-label-placeholder">${this.label}</div>
      <div class="layout horizontal time-inputs">
        <mkw-textfield
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
        ></mkw-textfield>
        <div class="separator-char">:</div>
        <mkw-textfield
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
        ></mkw-textfield>
        <div class="separator-char">.</div>
        <mkw-textfield
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
        ></mkw-textfield>
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
        valid: this.checkValidity(),
      },
    });
    this.dispatchEvent(changeEvt);
  }

  checkValidity(): boolean {
    if (!this.minuteElem) throw new Error('Missing minuteElem');
    if (!this.secondElem) throw new Error('Missing secondElem');
    if (!this.millisecondElem) throw new Error('Missing millisecondElem');
    this.minuteElem.checkValidity();
    this.secondElem.checkValidity();
    this.millisecondElem.checkValidity();
    return (
      this.minuteElem.validity.valid &&
      this.secondElem.validity.valid &&
      this.millisecondElem.validity.valid
    );
  }

  reportValidity(): boolean {
    if (!this.minuteElem) throw new Error('Missing minuteElem');
    if (!this.secondElem) throw new Error('Missing secondElem');
    if (!this.millisecondElem) throw new Error('Missing millisecondElem');
    const minuteValid = this.minuteElem.reportValidity();
    const secondValid = this.secondElem.reportValidity();
    const millisecondValid = this.millisecondElem.reportValidity();
    return minuteValid && secondValid && millisecondValid;
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
      this.minuteElem.setCustomValidity('');
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
      this.secondElem.setCustomValidity('');
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
        const neighbor = (
          this.getRootNode() as TimeDurationInput
        ).querySelector(`#course-${this.index + 1}`);
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
      this.millisecondElem.setCustomValidity('');
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
