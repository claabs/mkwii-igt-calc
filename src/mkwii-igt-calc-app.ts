import './elements/course-list';
import { LitElement, html, customElement, property, css } from 'lit-element';
import '@material/mwc-top-app-bar';
import '@material/mwc-select';
import '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
// import { tracks32, TrackData } from './data/tracks32';
import { SplitsIOService, Split } from './services/splitsio';

import { TimeDurationInputAttr } from './elements/time-duration-input';

@customElement('mkwii-igt-calc-app')
class MkwiiIgtCalcApp extends LitElement {
  static styles = css`
    /* :host {
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

    paper-card {
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
    }

    .course-row {
      font-size: 24px;
    }

    paper-button {
      background-color: var(--paper-blue-500);
      color: var(--paper-grey-50);
      font-weight: 600;
    }
    .splitsio-id {
      width: calc(4ch + 40px);
    } */
  `;

  render() {
    return html`
      <custom-style>
        <style
          is="custom-style"
          include="iron-flex iron-flex-alignment"
        ></style>
      </custom-style>
      <mwc-top-app-bar dense>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Mario Kart Wii IGT Calculator</div>

        <!-- TODO: Splits.io button here? -->
        <mwc-icon-button icon="favorite" slot="actionItems"></mwc-icon-button>

        <div class="content">
          <div class="card-content">
            <mwc-select label="Track Count" selected=${this.selectedTrackCount}>
              <mwc-list-item>32 Tracks</mwc-list-item>
              <mwc-list-item>16 Tracks</mwc-list-item>
              <mwc-list-item>Individual Cup</mwc-list-item>
            </mwc-select>
            <mwc-select
              label="${this.categoryLabelProp}"
              id="categoryListbox"
              selected="${this.selectedCategory}"
            >
              ${this.categoryListProp.map(
                (item) =>
                  html`
                    <mwc-list-item>${item}</mwc-list-item>
                  `
              )}
            </mwc-select>
            <course-list
              id="course-list"
              .courses="${this.courses}"
            ></course-list>
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
              iconTrailing="file_copy"
              @click="${this.copyClicked}"
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
  private categoryListProp = [];

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

  // static get properties() {
  //   return {
  //     total: {
  //       type: String,
  //     },
  //     selectedTrackCount: {
  //       type: Number,
  //       value: 0,
  //       observer: 'trackCountChanged',
  //     },
  //     selectedCategory: {
  //       type: Number,
  //       value: 0,
  //       observer: 'categoryChanged',
  //     },
  //     categoryList: {
  //       type: Array,
  //       computed: 'categoryList(selectedTrackCount)',
  //     },
  //     categoryLabel: {
  //       type: String,
  //       computed: 'categoryLabel(selectedTrackCount)',
  //     },
  //     courses: {
  //       type: Array,
  //     },
  //     attrSelected: {
  //       type: String,
  //     },
  //     claimLink: {
  //       type: String,
  //     },
  //     claimMessageHidden: {
  //       type: Boolean,
  //       value: true,
  //     },
  //     splitsioId: {
  //       type: String,
  //     },
  //   };
  // }

  private calculateTime(): boolean {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    try {
      this.courses.forEach((course) => {
        if (!course.minutes || !course.seconds || !course.milliseconds) {
          throw new Error('Missing time value');
        }
        const minInt = parseInt(course.minutes, 10);
        const secInt = parseInt(course.seconds, 10);
        const milliInt = parseInt(course.milliseconds, 10);
        minutes += minInt;
        seconds += secInt;
        milliseconds += milliInt;
        if (this.timesInvalid(minInt, secInt, milliInt)) {
          throw new Error('Time value out of range');
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
    if (this.calculateTime()) {
      this.splitsioId = null;
    } else {
      // Get category name
      let categoryNameLong;
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
          name: course.name,
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

  // private categoryList(trackCount: number): string[] {
  //   if (trackCount === 0) {
  //     // 32 Tracks
  //     return tracks32.map((elem) => elem.name);
  //   }

  //   if (trackCount === 1) {
  //     // 16 Tracks
  //     return ['Nitro Tracks', 'Retro Tracks'];
  //   }

  //   if (trackCount === 2) {
  //     // Individual Cups
  //     return [
  //       'Mushroom Cup',
  //       'Flower Cup',
  //       'Star Cup',
  //       'Special Cup',
  //       'Shell Cup',
  //       'Banana Cup',
  //       'Leaf Cup',
  //       'Lightning Cup',
  //     ];
  //   }
  //   return [];
  // }

  // private categoryLabel(trackCount: number): 'Starting Track' | 'Category' {
  //   if (trackCount === 0) {
  //     return 'Starting Track';
  //   }

  //   if (trackCount === 1 || trackCount === 2) {
  //     return 'Category';
  //   }
  //   throw new Error('Invalid track count value');
  // }

  // TODO: unneccessary?
  // private trackCountChanged(): void {
  //   this.selectedCategory = -1;
  //   // this.$.categoryTemplate.render();
  //   // this.$.categoryListbox.forceSynchronousItemUpdate();
  //   this.selectedCategory = 0;
  // }

  // private categoryChanged(newVal: number) {
  //   if (this.selectedTrackCount === 0) {
  //     // 32 Track
  //     const rotatedTrackOrder = rotate(tracks32, newVal);
  //     // Let rotatedTrackOrder = tracks32.slice(0, 32 - newVal).concat(tracks32.slice(32 - newVal));
  //     this.courses = this.mapTracks(rotatedTrackOrder);
  //   } else if (this.selectedTrackCount === 1) {
  //     const trackOrder = tracks32.slice(newVal * 16, newVal * 16 + 16);
  //     this.courses = this.mapTracks(trackOrder);
  //   } else if (this.selectedTrackCount === 2) {
  //     // Individual Cups
  //     const trackOrder = tracks32.slice(newVal * 4, newVal * 4 + 4);
  //     this.courses = this.mapTracks(trackOrder);
  //   }

  //   this.claimMessageHidden = true;
  //   this.total = '';
  //   this.splitsioId = null;
  // }

  // private mapTracks(modTrackList: TrackData[]): TimeDurationInputAttr[] {
  //   return modTrackList.map((elem) => {
  //     return {
  //       name: elem.name,
  //       plcMinutes: elem.avgMinutes.toString(),
  //       plcSeconds: elem.avgSeconds.toString(),
  //       plcMilliseconds: elem.avgMilliseconds.toString(),
  //       // minutes: null,
  //       // seconds: null,
  //       // milliseconds: null,
  //     };
  //   });
  // }

  private copyClicked(): void {
    try {
      const { shadowRoot } = this;
      if (!shadowRoot) throw new Error('Missing shadowRoot');
      const splitsElem = shadowRoot.getElementById(
        'splitsio-id'
      ) as TextField | null;
      if (!splitsElem) throw new Error('Missing splitsElem');

      splitsElem.select();
      document.execCommand('copy');
      // splitsElem.selectionEnd = splitsElem.selectionStart;
      splitsElem.blur();
    } catch (err) {
      console.error(err);
    }
  }
}

// function rotate<K>(ary: K[], n: number): K[] {
//   const l = ary.length;
//   const offset = (n + l) % l;
//   return ary.slice(offset).concat(ary.slice(0, offset));
// }

declare global {
  interface HTMLElementTagNameMap {
    'mkwii-igt-calc-app': MkwiiIgtCalcApp;
  }
}
