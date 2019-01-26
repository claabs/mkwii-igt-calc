import {html, PolymerElement} from '@polymer/polymer';
import './time-duration-input/time-duration-input';

/**
 * @customElement
 * @polymer
 */
class CourseList extends PolymerElement {
	static get template() {
		return html`
    <template is="dom-repeat" items="[[courses]]">
        <time-duration-input index="[[index]]" id="course-[[index]]" plc-minutes="[[item.plcMinutes]]" plc-seconds="[[item.plcSeconds]]"
            plc-milliseconds="[[item.plcMilliseconds]]" minutes="{{item.minutes}}" seconds="{{item.seconds}}" milliseconds="{{item.milliseconds}}"
            label="[[item.name]]"></time-duration-input>
    </template>
    `;
	}

	notifyChange(index, slot, value) {
		this.set(`courses.${index}.${slot}`, value);
	}

	static get properties() {
		return {
			courses: {
				type: Array,
				notify: true,
				value: []
			}
		};
	}
}

window.customElements.define('course-list', CourseList);
