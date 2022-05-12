# Mario Kart Wii In-game Time Calculator

Most [Mario Kart Wii RTA speedruns](https://www.speedrun.com/mkw) require that each track's in-game time be summed up and provided with the submission to the leaderboard.
This is a convenient user interface to assist with adding up the times when scrubbing through a video.

As a bonus, runs can be exported to and imported from [Splits.io](https://splits.io/) for convenient storage and retreival.

## Technical

This project was originally written in Polymer, which became lit-element, and then just [lit](https://lit.dev/).
It builds with [rollup](https://rollupjs.org/) and generates a service worker for PWA offline functionality.
