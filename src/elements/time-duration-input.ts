import { TextField } from '@material/mwc-textfield';
import { LitElement, html, customElement, property, css } from 'lit-element';

export interface TimeDurationInputAttr {
  minutes?: string;
  seconds?: string;
  milliseconds?: string;
  plcMinutes: string;
  plcSeconds: string;
  plcMilliseconds: string;
  label?: string;
  index?: number;
  name: string;
}

@customElement('time-duration-input')
export class TimeDurationInput extends LitElement {
  // static get properties() {
  //   return {
  //     minutes: {
  //       type: Number,
  //       notify: true,
  //     },
  //     seconds: {
  //       type: Number,
  //       notify: true,
  //     },
  //     milliseconds: {
  //       type: Number,
  //       notify: true,
  //     },
  //     plcMinutes: {
  //       type: Number,
  //     },
  //     plcSeconds: {
  //       type: Number,
  //       observer: '_padObserver',
  //     },
  //     plcMilliseconds: {
  //       type: Number,
  //       observer: '_padObserver',
  //     },
  //     label: {
  //       type: String,
  //     },
  //     index: {
  //       type: Number,
  //     },
  //   };
  // }

  @property({ type: String, attribute: true })
  private minutes = '';

  @property({ type: String, attribute: true })
  private seconds = '';

  @property({ type: String, attribute: true })
  private milliseconds = '';

  @property({ type: String, attribute: true })
  private plcMinutes = '';

  @property({ type: String, attribute: true })
  private plcSeconds = '';

  @property({ type: String, attribute: true })
  private plcMilliseconds = '';

  // @property({ type: String, attribute: true })
  // private label = '';

  @property({ type: Number, attribute: true })
  private index = 0;

  static styles = css`
    :host {
      display: block;
      font-size: 24px;
    }

    :host([focused]) {
      outline: none;
    }

    :host([hidden]) {
      display: none !important;
    }

    .separator-char {
      line-height: 28px;
      padding: 8px 0 10px 0;
      color: var(--paper-input-container-shared-input-style_-_color);
    }

    .minute {
      --paper-input-container-shared-input-style: {
        width: 1ch;
        -webkit-appearance: textfield;
      }
      text-align: right;
    }

    .second {
      --paper-input-container-shared-input-style: {
        width: 2ch;
        -webkit-appearance: textfield;
      }
      text-align: right;
    }

    .millisecond {
      --paper-input-container-shared-input-style: {
        width: 3ch;
        -webkit-appearance: textfield;
      }
      text-align: left;
    }

    paper-input {
      --paper-input-container-input-webkit-spinner: {
        -webkit-appearance: none;
      }
      --paper-input-container-input: {
        font-size: 24px;
      }
    }
    /* 
    .floated-label-placeholder {
      @apply --paper-font-caption;
      color: var(--paper-input-container-color, var(--secondary-text-color));
    } */
  `;

  render() {
    return html`
      <style include="iron-flex iron-flex-alignment"></style>
      <div class="floated-label-placeholder">[[label]]</div>
      <div class="layout horizontal center">
        <mwc-textfield
          id="minute"
          class="minute"
          @keydown=${this.minuteKeydown}
          @blur=${this.minuteBlur}
          ?autoValidate=${true}
          max="9"
          min="0"
          placeholder="${this.plcMinutes}"
          type="number"
          value="${this.minutes}"
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
          placeholder="${this.plcSeconds}"
          type="number"
          value="${this.seconds}"
          pattern="[0-9]"
        ></mwc-textfield>
        <div class="separator-char">.</div>
        <mwc-textfield
          id="millisecond"
          class="millisecond"
          @keydown=${this.msKeydown}
          @blur=${this.msBlur}
          ?autoValidate=${true}
          max="999"
          min="0"
          placeholder="${this.plcMilliseconds}"
          type="number"
          value="${this.milliseconds}"
          pattern="[0-9]"
        ></mwc-textfield>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.padPlaceholders();
  }

  private minuteKeydown(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      const notifyChange = new CustomEvent('notify-change', {
        detail: { index: this.index, slot: 'minutes', value: target.value },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(notifyChange);
      if (e.keyCode === 186 || e.keyCode === 110 || e.keyCode === 13) {
        // Semicolon, dot, or enter
        const { shadowRoot } = this;
        if (!shadowRoot) throw new Error('Missing shadowRoot');
        const secondElem = shadowRoot.getElementById(
          'millisecond'
        ) as TextField | null;
        if (!secondElem) throw new Error('Missing secondElem');
        secondElem.focus();
      }
    }
  }

  private secondKeydown(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      const notifyChange = new CustomEvent('notify-change', {
        detail: { index: this.index, slot: 'seconds', value: target.value },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(notifyChange);
      if (e.keyCode === 110 || e.keyCode === 13) {
        // Dot or enter
        const { shadowRoot } = this;
        if (!shadowRoot) throw new Error('Missing shadowRoot');
        const msElem = shadowRoot.getElementById(
          'millisecond'
        ) as TextField | null;
        if (!msElem) throw new Error('Missing msElem');
        msElem.focus();
      }
    }
  }

  private msKeydown(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      const notifyChange = new CustomEvent('notify-change', {
        detail: {
          index: this.index,
          slot: 'milliseconds',
          value: target.value,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(notifyChange);

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
      if (!target.value) {
        target.setCustomValidity('Missing');
      }
    }
  }

  private secondBlur(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      if (!target.value) {
        target.setCustomValidity('Missing');
      } else {
        target.value = target.value.padStart(2, '0');
        // Doesn't work on Firefox due to old bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1005603
      }
    }
  }

  private msBlur(e: KeyboardEvent) {
    if (e.target) {
      const target = e.target as TextField;
      if (!target.value) {
        target.setCustomValidity('Missing');
      } else {
        target.value = target.value.padEnd(3, '0');
      }
    }
  }

  // private padObserver() {
  //   this.padPlaceholders();
  // }

  private padPlaceholders() {
    const { shadowRoot } = this;
    if (shadowRoot) {
      const secondElem = shadowRoot.getElementById(
        'second'
      ) as TextField | null;
      if (secondElem)
        secondElem.placeholder = secondElem.placeholder
          .toString()
          .padStart(2, '0');

      const msElem = shadowRoot.getElementById(
        'millisecond'
      ) as TextField | null;
      if (msElem)
        msElem.placeholder = msElem.placeholder.toString().padEnd(3, '0');
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-duration-input': TimeDurationInput;
  }
}
