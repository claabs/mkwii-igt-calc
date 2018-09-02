import { html, PolymerElement } from '@polymer/polymer';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
import '@polymer/paper-styles/shadow';
import '@polymer/iron-flex-layout/iron-flex-layout-classes'
import '@polymer/paper-input/paper-input'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'
import './course-list/course-list'
import { tracks32 } from './tracks32'

/**
 * @customElement
 * @polymer
 */
class MkwiiIgtCalcApp extends PolymerElement {
  static get template() {
    return html`
    <custom-style>
      <style is="custom-style" include="iron-flex iron-flex-alignment">
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
          --paper-icon-button-ink-color: white;
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
      </style>
    </custom-style>
    
    <app-drawer-layout>
      <!-- <app-drawer slot="drawer" swipe-open>
                <app-toolbar>Getting Started</app-toolbar>
              </app-drawer> -->
      <app-header-layout>
        <app-header slot="header" reveals="" effects="waterfall">
          <app-toolbar>
            <!-- <paper-icon-button icon="menu" drawer-toggle=""></paper-icon-button> -->
            <div main-title="">Mario Kart Wii IGT Calculator</div>
          </app-toolbar>
        </app-header>
    
        <div class="content">
          <paper-card>
            <div class="card-content">
              <paper-dropdown-menu label="Track Count">
                <paper-listbox slot="dropdown-content" selected="{{selectedTrackCount}}">
                  <paper-item>32 Tracks</paper-item>
                  <paper-item>16 Tracks</paper-item>
                  <paper-item>Individual Cup</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>
              <paper-dropdown-menu label="[[categoryLabel]]">
                <paper-listbox slot="dropdown-content" id="categoryListbox" selected="{{selectedCategory}}">
                  <template is="dom-repeat" id="categoryTemplate" items="{{categoryList}}">
                    <paper-item>{{item}}</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <course-list id="course-list" courses={{courses}}></course-list>
              <paper-button on-tap="_calculateTime">Calculate</paper-button>
              <h2>Total: {{total}}</h2>
            </div>
          </paper-card>
        </div>
      </app-header-layout>
    </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      total: {
        type: String
      },
      selectedTrackCount: {
        type: Number,
        value: 0,
        observer: '_trackCountChanged'
      },
      selectedCategory: {
        type: Number,
        value: 0,
        observer: '_categoryChanged'
      },
      categoryList: {
        type: Array,
        computed: '_categoryList(selectedTrackCount)',
      },
      categoryLabel: {
        type: String,
        computed: '_categoryLabel(selectedTrackCount)',
      },
      courses: {
        type: Array
      },
      attrSelected: {
        type: String
      }

    };
  }

  _calculateTime() {
    let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
    // let minutes, seconds, milliseconds = 0;
    this.courses.forEach(course => {
      minutes += parseInt(course.minutes, 10);
      seconds += parseInt(course.seconds, 10);
      milliseconds += parseInt(course.milliseconds, 10);
    });
    seconds += Math.floor(milliseconds / 1000);
    milliseconds = milliseconds % 1000;
    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
    if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
      this.total = 'Invalid input'
    } else {
      this.total = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
      if (hours > 0 ) {
        this.total = `${hours}:` + this.total;
      }
    }
  }

  _categoryList(trackCount) {
    if (trackCount == 0) { // 32 Tracks
      return tracks32.map(elem => elem.name);
    } else if (trackCount == 1) { // 16 Tracks
      return [
        `Nitro Tracks`,
        `Retro Tracks`
      ];
    } else if (trackCount == 2) { // Individual Cups
      return [
        `Mushroom Cup`,
        `Flower Cup`,
        `Star Cup`,
        `Special Cup`,
        `Shell Cup`,
        `Banana Cup`,
        `Leaf Cup`,
        `Lightning Cup`
      ];
    }
  }

  _categoryLabel(trackCount) {
    if (trackCount == 0) {
      return 'Starting Track'
    } else if (trackCount == 1 || trackCount == 2) {
      return 'Category'
    }
  }

  _trackCountChanged(newVal, oldVal) {
    this.selectedCategory = -1;
    this.$.categoryTemplate.render();
    this.$.categoryListbox.forceSynchronousItemUpdate();
    this.selectedCategory = 0;
  }

  _categoryChanged(newVal, oldVal) {
    if (this.selectedTrackCount == 0) { // 32 Track
      let rotatedTrackOrder = rotate(tracks32, newVal);
      // let rotatedTrackOrder = tracks32.slice(0, 32 - newVal).concat(tracks32.slice(32 - newVal));
      this.courses = this._mapTracks(rotatedTrackOrder);
    } else if (this.selectedTrackCount == 1) {
      let trackOrder = tracks32.slice(newVal * 16, newVal * 16 + 16);
      this.courses = this._mapTracks(trackOrder);
    } else if (this.selectedTrackCount == 2) { // Individual Cups
      let trackOrder = tracks32.slice(newVal * 4, newVal * 4 + 4);
      this.courses = this._mapTracks(trackOrder);
    }
  }

  _mapTracks(modTrackList) {
    return modTrackList.map(elem => {
      return {
        name: elem.name,
        plcMinutes: elem.avgMinutes,
        plcSeconds: elem.avgSeconds,
        plcMilliseconds: elem.avgMilliseconds,
        minutes: null,
        seconds: null,
        milliseconds: null,
      }
    });
  }
}

function rotate(ary, n) {
  const l = ary.length
  const offset = (n + l) % l;
  return ary.slice(offset).concat(ary.slice(0, offset));
}

window.customElements.define('mkwii-igt-calc-app', MkwiiIgtCalcApp);

