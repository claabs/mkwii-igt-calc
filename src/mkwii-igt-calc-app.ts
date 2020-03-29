import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
} from 'lit-element';
import '@material/mwc-top-app-bar';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import { TextField } from '@material/mwc-textfield';
import { SelectedEvent } from '@material/mwc-list/mwc-list-foundation';
import { Select } from '@material/mwc-select';
import { tracks32, TrackData } from './data/tracks32';
import { SplitsIOService, Split } from './services/splitsio';

import './time-duration-input';
import { TimeDurationInputAttr, TimeDurationInputEvent } from './data/types';

@customElement('mkwii-igt-calc-app')
class MkwiiIgtCalcApp extends LitElement {
  static styles = css`
    :host {
      --paper-font-common-base {
        font-family: sans-serif;
      }
      font-size: 14px;
      background-color: var(--paper-grey-50);
    }

    .content {
      display: block;
      position: relative;
      max-width: 600px;
      padding: 0 5px;
      margin: 5px auto;
    }

    /* paper-card {
      display: inline-block;
      width: 100%;
      color: black;
      text-decoration: none;
    }

    app-header {
      background-color: var(--paper-blue-500);
      color: #fff;
    }

    paper-icon-button {
      --paper-icon-button-ink-color: black;
    }

    app-drawer-layout:not([narrow]) [drawer-toggle] {
      display: none;
    } */

    /* paper-button {
      background-color: var(--paper-blue-500);
      color: var(--paper-grey-50);
      font-weight: 600;
    }  */
    .splitsio-id {
      width: calc(4ch + 40px);
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

  render() {
    return html`
      <mwc-top-app-bar dense>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Mario Kart Wii IGT Calculator</div>

        <!-- TODO: Splits.io button here? -->
        <mwc-icon-button icon="favorite" slot="actionItems"></mwc-icon-button>

        <div class="content">
          <div class="card-content">
            <mwc-select
              label="Track Count"
              id="trackCountSelect"
              index=${this.selectedTrackCount}
              @selected=${this.trackCountChanged}
            >
              <mwc-list-item>32 Tracks</mwc-list-item>
              <mwc-list-item>16 Tracks</mwc-list-item>
              <mwc-list-item>Individual Cup</mwc-list-item>
            </mwc-select>
            <mwc-select
              label="${this.categoryLabelProp}"
              id="category-select"
              index=${this.selectedCategory}
              @selected=${this.categoryChanged}
            >
              ${this.categoryListProp.map(
                (item) =>
                  html`
                    <mwc-list-item>${item}</mwc-list-item>
                  `
              )}
            </mwc-select>
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
            <mwc-button @click=${this.calculateTime}>Calculate</mwc-button>
            <h2>Total: ${this.total}</h2>
            <hr />
            <div class="layout horizontal">
              <mwc-button @click=${this.uploadSplits}
                >Upload to Splits.io</mwc-button
              >
              <a
                href="${this.claimLink}"
                target="_blank"
                ?hidden=${this.claimMessageHidden}
                ><mwc-button>Claim Splits.io Run</mwc-button></a
              >
            </div>
            <mwc-textfield
              id="splitsio-id"
              class="splitsio-id"
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
  private claimMessageHidden = true;

  @property({ type: String })
  private splitsioId: string | null = '';

  @query('#category-select')
  private categorySelectElem!: Select | null;

  @query('#splitsio-id')
  private splitsIOIdElem!: TextField | null;

  private calculateTime(): boolean {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    try {
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
      const rotatedTrackOrder = rotate(tracks32, index);
      // Let rotatedTrackOrder = tracks32.slice(0, 32 - newVal).concat(tracks32.slice(32 - newVal));
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
    };
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

function rotate<K>(ary: K[], n: number): K[] {
  const l = ary.length;
  const offset = (n + l) % l;
  return ary.slice(offset).concat(ary.slice(0, offset));
}

declare global {
  interface HTMLElementTagNameMap {
    'mkwii-igt-calc-app': MkwiiIgtCalcApp;
  }
}
