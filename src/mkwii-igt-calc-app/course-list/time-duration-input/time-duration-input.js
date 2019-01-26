import {html, PolymerElement} from '@polymer/polymer';
import '@polymer/paper-input/paper-input';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/iron-validator-behavior/iron-validator-behavior';

/**
 * @customElement
 * @polymer
 */
class TimeDurationInput extends PolymerElement {
	static get template() {
		return html`
    <style include="iron-flex iron-flex-alignment">
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
            color: var(--paper-input-container-shared-input-style_-_color)
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
            };
        }
        
        .floated-label-placeholder {
            @apply --paper-font-caption;
            color: var(--paper-input-container-color, var(--secondary-text-color));
        }
    </style>
    <div class="floated-label-placeholder">[[label]]</div>
    <div class="layout horizontal center">
        <paper-input id="minute" class="minute" on-keydown="_minuteKeydown" on-blur="_minuteBlur" auto-validate max="9" min="0" no-label-float
            placeholder="[[plcMinutes]]" type="number" value="{{minutes}}" allowed-pattern="[0-9]"></paper-input>
        <div class="separator-char">:</div>
        <paper-input id="second" class="second" on-keydown="_secondKeydown" on-blur="_secondBlur" auto-validate max="59" min="0"
            no-label-float placeholder="[[plcSeconds]]" type="number" value="{{seconds}}" allowed-pattern="[0-9]"></paper-input>
        <div class="separator-char">.</div>
        <paper-input id="millisecond" class="millisecond" on-keydown="_msKeydown" on-blur="_msBlur" auto-validate max="999" min="0"
            no-label-float placeholder="[[plcMilliseconds]]" type="number" value="{{milliseconds}}" allowed-pattern="[0-9]"></paper-input>
    </div>
    `;
	}

	ready() {
		super.ready();
		this._padPlaceholders();
	}

	_minuteKeydown(e) {
		this.getRootNode().host.notifyChange(this.index, 'minutes', e.target.value);
		if (e.keyCode === 186 || e.keyCode === 110 || e.keyCode === 13) { // Semicolon, dot, or enter
			this.$.second.focus();
		}
	}

	_secondKeydown(e) {
		this.getRootNode().host.notifyChange(this.index, 'seconds', e.target.value);
		if (e.keyCode === 110 || e.keyCode === 13) { // Dot or enter
			this.$.millisecond.focus();
		}
	}

	_msKeydown(e) {
		this.getRootNode().host.notifyChange(this.index, 'milliseconds', e.target.value);
		if (e.keyCode === 13) { // Enter
			const neighbor = this.getRootNode().querySelector(`#course-${this.index + 1}`);
			if (neighbor) {
				neighbor.$.minute.focus();
			}
		}
	}

	_minuteBlur(e) {
		if (!e.target.value) {
			this.$.minute.invalid = true;
		}
	}

	_secondBlur(e) {
		if (!e.target.value) {
			this.$.second.invalid = true;
		}

		if (e.target.value) {
			e.target.value = e.target.value.padStart(2, '0');
			// Doesn't work on Firefox due to old bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1005603
		}
	}

	_msBlur(e) {
		if (!e.target.value) {
			this.$.millisecond.invalid = true;
		}

		if (e.target.value) {
			e.target.value = e.target.value.padEnd(3, '0');
		}
	}

	_padObserver() {
		this._padPlaceholders();
	}

	_padPlaceholders() {
		this.$.second.placeholder = this.$.second.placeholder.toString().padStart(2, '0');
		this.$.millisecond.placeholder = this.$.millisecond.placeholder.toString().padEnd(3, '0');
	}

	static get properties() {
		return {
			minutes: {
				type: Number,
				notify: true
			},
			seconds: {
				type: Number,
				notify: true
			},
			milliseconds: {
				type: Number,
				notify: true
			},
			plcMinutes: {
				type: Number
			},
			plcSeconds: {
				type: Number,
				observer: '_padObserver'
			},
			plcMilliseconds: {
				type: Number,
				observer: '_padObserver'
			},
			label: {
				type: String
			},
			index: {
				type: Number
			}
		};
	}
}

window.customElements.define('time-duration-input', TimeDurationInput);
