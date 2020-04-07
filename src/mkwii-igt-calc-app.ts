import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
} from 'lit-element';
import '@material/mwc-top-app-bar';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import './elements/mkw-select';
import { TextField } from '@material/mwc-textfield';
import { SelectedEvent } from '@material/mwc-list/mwc-list-foundation';
import { Select } from '@material/mwc-select';
import { tracks32, TrackData } from './data/tracks32';
import { SplitsIOService, Split } from './services/splitsio';

import './time-duration-input';
import './time-table-output';
import { TimeDurationInputAttr, TimeDurationInputEvent } from './data/types';
import { TimeDurationInput } from './time-duration-input';
import { TimeTableOutput } from './time-table-output';
import { rotateArray } from './services/utils';

@customElement('mkwii-igt-calc-app')
class MkwiiIgtCalcApp extends LitElement {
  static styles = css`
    :host {
      font-size: 14px;
      background-color: rgb(245, 245, 245);
      font-family: var(--mdc-typography-font-family, Roboto, sans-serif);
    }

    .content {
      display: block;
      position: relative;
      max-width: 600px;
      padding: 0 10px;
      margin: 5px auto;
      background-color: rgb(245, 245, 245);
    }

    .select-boxes {
      margin-bottom: 16px;
    }

    .splitsio-input {
      margin: 0 8px 8px 0;
    }

    .splitsio-id {
      width: calc(76px + 32px);
    }

    .layout {
      display: flex;
    }

    .layout[hidden] {
      display: none;
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
      <mwc-top-app-bar dense>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Mario Kart Wii IGT Calculator</div>
        <div class="content">
          <div class="select-boxes">
            <mkw-select
              label="Track Count"
              id="trackCountSelect"
              @selected=${this.trackCountChanged}
            >
              <mwc-list-item selected value="0">32 Tracks</mwc-list-item>
              <mwc-list-item value="1">16 Tracks</mwc-list-item>
              <mwc-list-item value="2">Individual Cup</mwc-list-item>
            </mkw-select>
            <mkw-select
              label="${this.categoryLabelProp}"
              id="category-select"
              @selected=${this.categoryChanged}
            >
              ${this.categoryListProp.map(
                (item, index) =>
                  html`
                    <mwc-list-item value="${index}">${item}</mwc-list-item>
                  `
              )}
            </mkw-select>
          </div>
          <div id="course-list">
            ${this.courses.map(
              (item, index) => html`
                <time-duration-input
                  index="${index}"
                  id="course-${index}"
                  plcMinutes="${item.plcMinutes}"
                  plcSeconds="${item.plcSeconds}"
                  plcMilliseconds="${item.plcMilliseconds}"
                  minutes="${item.minutes || ''}"
                  seconds="${item.seconds || ''}"
                  milliseconds="${item.milliseconds || ''}"
                  label="${item.label || ''}"
                  @change=${this.timeDurationInputChange}
                ></time-duration-input>
              `
            )}
          </div>
          <mwc-button
            ?disabled=${this.calculateDisabled}
            @click=${this.calculateTime}
            raised
            >Calculate</mwc-button
          >
          <h2>Total: ${this.total}</h2>
          <hr />
          <div ?hidden=${this.calculateDisabled}>
            <mwc-button
              class="splitsio-input"
              outlined
              @click=${this.uploadSplits}
              title="Share the course times as splits you can attach to the run on speedrun.com"
              >Upload to Splits.io</mwc-button
            >
            <a
              href="${this.claimLink}"
              target="_blank"
              ?hidden=${this.claimMessageHidden}
              class="splitsio-input"
              ><mwc-button
                outlined
                title="Give the run ownership to your splits.io account"
                >Claim Splits.io Run</mwc-button
              ></a
            >
            <div
              class="layout horizontal center"
              ?hidden=${this.claimMessageHidden}
            >
              <mwc-textfield
                id="splitsio-id"
                class="splitsio-id splitsio-input"
                readOnly
                label="splits.io ID"
                value="${this.splitsioId || ''}"
              >
              </mwc-textfield>
              <mwc-icon-button
                slot="suffix"
                icon="file_copy"
                @click="${this.copyClicked}"
              >
              </mwc-icon-button>
            </div>
          </div>
          <time-table-output
            id="table-output"
            .courses=${this.courses}
            .category=${this.selectedCategory}
            .trackCount=${this.selectedTrackCount}
          ></time-table-output>
        </div>
      </mwc-top-app-bar>
    `;
  }

  @property({ type: String })
  private total = '';

  @property({ type: Number })
  private selectedTrackCount = 0;

  @property({ type: Number })
  private selectedCategory = 0;

  @property({ type: Array })
  private categoryListProp: string[] = [];

  @property({ type: String })
  private categoryLabelProp = '';

  @property({ type: Array })
  private courses: TimeDurationInputAttr[] = [];

  // @property({ type: String })
  // private attrSelected = '';

  @property({ type: String })
  private claimLink = '';

  @property({ type: Boolean })
  private calculateDisabled = true;

  @property({ type: Boolean })
  private claimMessageHidden = true;

  @property({ type: String })
  private splitsioId: string | null = '';

  @query('#category-select')
  private categorySelectElem!: Select | null;

  @query('#splitsio-id')
  private splitsIOIdElem!: TextField | null;

  @query('#table-output')
  private tableOutputElem!: TimeTableOutput | null;

  private validateAll(): boolean {
    const timeInputElements = this.courses.map((_course, index) => {
      return this.shadowRoot!.querySelector(
        `#course-${index}`
      ) as TimeDurationInput;
    });
    let valid = true;
    timeInputElements.forEach((timeElement) => {
      const timeElementValid = timeElement.reportValidity();
      valid = valid && timeElementValid;
    });
    return valid;
  }

  private calculateTime(): boolean {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    try {
      this.validateAll();
      this.courses.forEach((course) => {
        if (!course.minutes || !course.seconds || !course.milliseconds) {
          throw new Error(`Missing time value on ${course.label}`);
        }
        const minInt = parseInt(course.minutes, 10);
        const secInt = parseInt(course.seconds, 10);
        const milliInt = parseInt(course.milliseconds, 10);
        minutes += minInt;
        seconds += secInt;
        milliseconds += milliInt;
        if (this.timesInvalid(minInt, secInt, milliInt)) {
          throw new Error(`Time value out of range on ${course.label}`);
        }
      });
      seconds += Math.floor(milliseconds / 1000);
      milliseconds %= 1000;
      minutes += Math.floor(seconds / 60);
      seconds %= 60;
      hours += Math.floor(minutes / 60);
      minutes %= 60;
      if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        throw new Error('Invalid total time value');
      }
      this.total = `${minutes}:${seconds
        .toString()
        .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      if (hours > 0) {
        this.total = `${hours}:${this.total}`;
      }
      return true;
    } catch (err) {
      console.error(err);
      this.total = 'Invalid input';
      return false;
    }
  }

  private timesInvalid(minInt: number, secInt: number, milliInt: number) {
    return (
      isNaN(minInt) ||
      minInt > 9 ||
      minInt < 0 ||
      isNaN(secInt) ||
      secInt > 59 ||
      minInt < 0 ||
      isNaN(milliInt) ||
      milliInt > 999 ||
      milliInt < 0
    );
  }

  private async uploadSplits() {
    this.claimMessageHidden = true;
    if (!this.calculateTime()) {
      this.splitsioId = null;
    } else {
      // Get category name
      let categoryNameLong = '';
      if (this.selectedTrackCount === 0) {
        categoryNameLong = '32 Tracks';
      } else {
        categoryNameLong = this.categoryListProp[this.selectedCategory];
      }

      // Get split list
      const segments: Split[] = [];
      this.courses.forEach((course) => {
        let duration = parseInt(course.minutes as string, 10) * 60000;
        duration += parseInt(course.seconds as string, 10) * 1000;
        duration += parseInt(course.milliseconds as string, 10);
        segments.push({
          name: course.label,
          duration,
        });
      });

      const SplitsIO = new SplitsIOService(segments);
      const exchange = SplitsIO.generateExchangeJSON(categoryNameLong);
      try {
        const uploadResp = await SplitsIO.uploadSplits(exchange);
        this.claimLink = uploadResp.claimUri;
        this.splitsioId = uploadResp.id;
        this.claimMessageHidden = false;
      } catch (e) {
        console.error(e);
      }
    }
  }

  private categoryList(trackCount: number): string[] {
    if (trackCount === 0) {
      // 32 Tracks
      return tracks32.map((elem) => elem.name);
    }

    if (trackCount === 1) {
      // 16 Tracks
      return ['Nitro Tracks', 'Retro Tracks'];
    }

    if (trackCount === 2) {
      // Individual Cups
      return [
        'Mushroom Cup',
        'Flower Cup',
        'Star Cup',
        'Special Cup',
        'Shell Cup',
        'Banana Cup',
        'Leaf Cup',
        'Lightning Cup',
      ];
    }
    return [];
  }

  private categoryLabel(trackCount: number): 'Starting Track' | 'Category' {
    if (trackCount === 0) {
      return 'Starting Track';
    }

    if (trackCount === 1 || trackCount === 2) {
      return 'Category';
    }
    throw new Error('Invalid track count value');
  }

  // TODO: unneccessary?
  private trackCountChanged(event: SelectedEvent): void {
    const index = event.detail.index as number;
    this.selectedTrackCount = index;

    this.categoryListProp = this.categoryList(index);
    this.categoryLabelProp = this.categoryLabel(index);

    if (!this.categorySelectElem) throw new Error('Missing categorySelect');
    this.selectedCategory = -1;
    this.categorySelectElem.select(-1);
    this.categorySelectElem.layout(true);
    this.courses = [];
  }

  private categoryChanged(newVal: SelectedEvent) {
    const index = newVal.detail.index as number;
    this.selectedCategory = index;
    if (this.selectedTrackCount === 0) {
      // 32 Track
      const rotatedTrackOrder = rotateArray(tracks32, index);
      this.courses = this.mapTracks(rotatedTrackOrder);
    } else if (this.selectedTrackCount === 1) {
      const trackOrder = tracks32.slice(index * 16, index * 16 + 16);
      this.courses = this.mapTracks(trackOrder);
    } else if (this.selectedTrackCount === 2) {
      // Individual Cups
      const trackOrder = tracks32.slice(index * 4, index * 4 + 4);
      this.courses = this.mapTracks(trackOrder);
    } else {
      this.courses = [];
    }

    this.calculateDisabled = index < 0;
    this.claimMessageHidden = true;
    this.total = '';
    this.splitsioId = null;
  }

  private timeDurationInputChange(evt: TimeDurationInputEvent) {
    this.courses[evt.detail.index] = {
      ...this.courses[evt.detail.index],
      minutes: evt.detail.minutes,
      seconds: evt.detail.seconds,
      milliseconds: evt.detail.milliseconds,
      valid: evt.detail.valid,
    };
    if (!this.tableOutputElem) throw new Error('Missing tableOutputElem');
    this.tableOutputElem.requestUpdate();
  }

  private mapTracks(modTrackList: TrackData[]): TimeDurationInputAttr[] {
    return modTrackList.map((elem) => {
      return {
        label: elem.name,
        plcMinutes: elem.avgMinutes.toString(),
        plcSeconds: elem.avgSeconds.toString(),
        plcMilliseconds: elem.avgMilliseconds.toString(),
      };
    });
  }

  private copyClicked(): void {
    if (!this.splitsIOIdElem) throw new Error('Missing splitsElem');

    this.splitsIOIdElem.select();
    document.execCommand('copy');
    // splitsElem.selectionEnd = splitsElem.selectionStart;
    this.splitsIOIdElem.blur();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mkwii-igt-calc-app': MkwiiIgtCalcApp;
  }
}
