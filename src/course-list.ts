import { LitElement, html, customElement, property } from 'lit-element';
import './time-duration-input';
import { TimeDurationInputAttr } from './data/types';

@customElement('course-list')
export class CourseList extends LitElement {
  @property({ type: Array })
  private courses: TimeDurationInputAttr[] = [];

  render() {
    return html`
      ${this.courses.map(
        (item, index) => html`
          <time-duration-input
            index="${index}"
            id="course-${index}"
            plc-minutes="${item.plcMinutes}"
            plc-seconds="${item.plcSeconds}"
            plc-milliseconds="${item.plcMilliseconds}"
            minutes="${item.minutes || ''}"
            seconds="${item.seconds || ''}"
            milliseconds="${item.milliseconds || ''}"
            label="${item.label || ''}"
          ></time-duration-input>
        `
      )}
    `;
  }

  public notifyChange<K extends keyof TimeDurationInputAttr>(
    index: number,
    slot: K,
    value: TimeDurationInputAttr[K]
  ) {
    this.courses[index][slot] = value;
    // this.render();
  }

  // static get properties() {
  //   return {
  //     courses: {
  //       type: Array,
  //       notify: true,
  //       value: [],
  //     },
  //   };
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'course-list': CourseList;
  }
}
