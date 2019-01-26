import {html, PolymerElement} from '@polymer/polymer';
import '@polymer/app-layout/app-layout';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
import '@polymer/paper-styles/shadow';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import './course-list/course-list';
import {tracks32} from './tracks32';
import {SplitsIOService} from './splitsio-service';

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
              <hr>
              <div class="layout horizontal">
                <paper-button on-tap="_uploadSplits">Upload to Splits.io</paper-button>
                <a href="[[claimLink]]" target="_blank" hidden=[[claimMessageHidden]]><paper-button >Claim Splits.io Run</paper-button></a>
              </div>
              <paper-input id="splitsio-id" class="splitsio-id" readonly always-float-label label="splits.io ID" value="[[splitsioId]]">
                <paper-icon-button slot="suffix" icon="content-copy" on-tap="_copyClicked">
                </paper-icon-button>
              </paper-input>
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
				computed: '_categoryList(selectedTrackCount)'
			},
			categoryLabel: {
				type: String,
				computed: '_categoryLabel(selectedTrackCount)'
			},
			courses: {
				type: Array
			},
			attrSelected: {
				type: String
			},
			claimLink: {
				type: String
			},
			claimMessageHidden: {
				type: Boolean,
				value: true
			},
			splitsioId: {
				type: String
			}

		};
	}

	_calculateTime() {
		let invalid = false;
		let hours = 0;
		let minutes = 0;
		let seconds = 0;
		let milliseconds = 0;
		this.courses.forEach(course => {
			const minInt = parseInt(course.minutes, 10);
			const secInt = parseInt(course.seconds, 10);
			const milliInt = parseInt(course.milliseconds, 10);
			minutes += minInt;
			seconds += secInt;
			milliseconds += milliInt;
			invalid = invalid || this._timesInvalid(minInt, secInt, milliInt);
		});
		seconds += Math.floor(milliseconds / 1000);
		milliseconds %= 1000;
		minutes += Math.floor(seconds / 60);
		seconds %= 60;
		hours += Math.floor(minutes / 60);
		minutes %= 60;
		if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds) || invalid) {
			this.total = 'Invalid input';
		} else {
			this.total = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
			if (hours > 0) {
				this.total = `${hours}:` + this.total;
			}
		}
	}

	_timesInvalid(minInt, secInt, milliInt) {
		return isNaN(minInt) || minInt > 9 || minInt < 0 ||
      isNaN(secInt) || secInt > 59 || minInt < 0 ||
      isNaN(milliInt) || milliInt > 999 || milliInt < 0;
	}

	async _uploadSplits() {
		this.claimMessageHidden = true;
		this._calculateTime();
		if (this.total === 'Invalid input') {
			this.splitsioId = null;
			this.claimMessageHidden = true;
		} else {
			// Get category name
			let categoryNameLong;
			if (this.selectedTrackCount === 0) {
				categoryNameLong = '32 Tracks';
			} else if (this.selectedTrackCount > 0) {
				categoryNameLong = this.categoryList[this.selectedCategory];
			}

			// Get split list
			const segments = [];
			this.courses.forEach(course => {
				let duration = parseInt(course.minutes, 10) * 60000;
				duration += parseInt(course.seconds, 10) * 1000;
				duration += parseInt(course.milliseconds, 10);
				segments.push({
					name: course.name,
					duration
				});
			});

			const SplitsIO = new SplitsIOService(segments);
			const exchange = SplitsIO.generateExchangeJSON(categoryNameLong);
			let uploadResp;
			try {
				uploadResp = await SplitsIO.uploadSplits(exchange);
			} catch (e) {
				console.error(e);
			}

			this.claimLink = uploadResp.claimUri;
			this.splitsioId = uploadResp.id;
			this.claimMessageHidden = false;
		}
	}

	_categoryList(trackCount) {
		if (trackCount === 0) { // 32 Tracks
			return tracks32.map(elem => elem.name);
		}

		if (trackCount === 1) { // 16 Tracks
			return [
				'Nitro Tracks',
				'Retro Tracks'
			];
		}

		if (trackCount === 2) { // Individual Cups
			return [
				'Mushroom Cup',
				'Flower Cup',
				'Star Cup',
				'Special Cup',
				'Shell Cup',
				'Banana Cup',
				'Leaf Cup',
				'Lightning Cup'
			];
		}
	}

	_categoryLabel(trackCount) {
		if (trackCount === 0) {
			return 'Starting Track';
		}

		if (trackCount === 1 || trackCount === 2) {
			return 'Category';
		}
	}

	_trackCountChanged() {
		this.selectedCategory = -1;
		this.$.categoryTemplate.render();
		this.$.categoryListbox.forceSynchronousItemUpdate();
		this.selectedCategory = 0;
	}

	_categoryChanged(newVal) {
		if (this.selectedTrackCount === 0) { // 32 Track
			const rotatedTrackOrder = rotate(tracks32, newVal);
			// Let rotatedTrackOrder = tracks32.slice(0, 32 - newVal).concat(tracks32.slice(32 - newVal));
			this.courses = this._mapTracks(rotatedTrackOrder);
		} else if (this.selectedTrackCount === 1) {
			const trackOrder = tracks32.slice(newVal * 16, (newVal * 16) + 16);
			this.courses = this._mapTracks(trackOrder);
		} else if (this.selectedTrackCount === 2) { // Individual Cups
			const trackOrder = tracks32.slice(newVal * 4, (newVal * 4) + 4);
			this.courses = this._mapTracks(trackOrder);
		}

		this.claimMessageHidden = true;
		this.total = '';
		this.splitsioId = null;
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
				milliseconds: null
			};
		});
	}

	_copyClicked() {
		const input = this.$['splitsio-id'].inputElement.inputElement;
		input.select();
		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Oops, unable to copy');
		}

		input.selectionEnd = input.selectionStart;
		input.blur();
	}
}

function rotate(ary, n) {
	const l = ary.length;
	const offset = (n + l) % l;
	return ary.slice(offset).concat(ary.slice(0, offset));
}

window.customElements.define('mkwii-igt-calc-app', MkwiiIgtCalcApp);

