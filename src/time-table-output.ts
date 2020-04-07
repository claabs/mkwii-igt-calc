import {
  LitElement,
  html,
  customElement,
  property,
  css,
  TemplateResult,
  query,
} from 'lit-element';
import { TimeDurationInputAttr, TrackCountEnum } from './data/types';
import { rotateArray } from './mkwii-igt-calc-app';
import { tracks32 } from './data/tracks32';
import '@material/mwc-button';

@customElement('time-table-output')
export class TimeTableOutput extends LitElement {
  @property({ type: Array })
  private courses: TimeDurationInputAttr[] = [];

  @property({ type: Number })
  private trackCount = -1;

  @property({ type: Number })
  private category = -1;

  @query('#data-row')
  private dataRowElem!: HTMLTableRowElement | null;

  @query('#copy-input')
  private copyInputElem!: HTMLInputElement | null;

  static styles = css`
    .copy-table {
      position: absolute;
      left: -1000px;
      top: -1000px;
    }
  `;

  render() {
    return html`
      <mwc-button
        label="Copy Table Data"
        slot="suffix"
        icon="file_copy"
        @click="${this.copyClicked}"
        title="For copying into a spreadsheet"
      >
      </mwc-button>
      <input id="copy-input" class="copy-table" />
      <table class="copy-table">
        ${this.renderHeader()}${this.renderDataRow()}
      </table>
    `;
  }

  private renderHeader(): TemplateResult {
    const baseHeader = html`<th>Runner</th>
      <th>Category</th>
      <th>Platform</th>
      <th>Real Time</th>
      <th>IGT</th>
      <th>Non-play</th>
      <th>Comments</th>`;
    if (this.trackCount === TrackCountEnum.TRACKS_32) {
      const rotatedTracks = rotateArray(tracks32, this.category);
      return html`<thead>
        <tr>
          ${baseHeader}
          <th>First Track</th>
          ${rotatedTracks.map((track) => html`<th>${track.short}</th>`)}
        </tr>
      </thead>`;
    }
    if (this.trackCount === TrackCountEnum.TRACKS_16) {
      const trackOrder = tracks32.slice(
        this.category * 16,
        this.category * 16 + 16
      );
      return html`<thead>
        <tr>
          ${baseHeader}
          ${trackOrder.map((track) => html`<th>${track.short}</th>`)}
        </tr>
      </thead>`;
    }
    if (this.trackCount === TrackCountEnum.INDIVIDUAL_CUP) {
      const trackOrder = tracks32.slice(
        this.category * 4,
        this.category * 4 + 4
      );
      return html`<thead>
        <tr>
          ${baseHeader}
          ${trackOrder.map((track) => html`<th>${track.short}</th>`)}
        </tr>
      </thead>`;
    }
    return html`ERROR`;
  }

  private renderDataRow(): TemplateResult {
    const baseData = html`<td>Runner</td>
      <td></td>
      <td></td>
      <td></td>
      <td>TODO</td>
      <td>TODO</td>
      <td></td>`;
    if (this.trackCount === TrackCountEnum.TRACKS_32) {
      const rotatedTracks = rotateArray(tracks32, this.category);
      return html`<tbody>
        <tr id="data-row">
          ${baseData}
          <td>${rotatedTracks[0].short}</td>
          ${this.renderCourseTimes()}
        </tr>
      </tbody>`;
    }
    return html`<tbody>
      <tr id="data-row">
        ${baseData} ${this.renderCourseTimes()}
      </tr>
    </tbody>`;
  }

  private renderCourseTimes(): TemplateResult {
    return html`${this.courses.map(
      (c) =>
        html`<td>
          ${c.valid
            ? html`0:${c.minutes?.padStart(
                2,
                '0'
              )}:${c.seconds}.${c.milliseconds}`
            : null}
        </td>`
    )}`;
  }

  private copyClicked() {
    if (!this.dataRowElem) throw new Error('Missing dataRowElem');
    if (!this.copyInputElem) throw new Error('Missing copyInputElem');

    const finalString = Array.from(this.dataRowElem.cells)
      .map((cell) => cell.innerText)
      .reduce(
        (prevString: string, curString: string) => `${prevString}\t${curString}`
      );

    this.copyInputElem.value = finalString;
    this.copyInputElem.select();
    document.execCommand('copy');
    this.copyInputElem.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-table-output': TimeTableOutput;
  }
}
