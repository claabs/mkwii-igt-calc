import { TrackCountEnum } from './types';

export enum TrackClass {
  NITRO,
  RETRO,
}

export enum TrackCup {
  MUSHROOM,
  FLOWER,
  STAR,
  SPECIAL,
  SHELL,
  BANANA,
  LEAF,
  LIGHTNING,
}

export interface TrackData {
  name: string;
  short: string;
  avgMinutes: number;
  avgSeconds: number;
  avgMilliseconds: number;
  cup: TrackCup;
  class: TrackClass;
}

export const tracks32: TrackData[] = [
  {
    name: `Luigi Circuit`,
    short: 'LC',
    avgMinutes: 1,
    avgSeconds: 20,
    avgMilliseconds: 887,
    class: TrackClass.NITRO,
    cup: TrackCup.MUSHROOM,
  },
  {
    name: `Moo Moo Meadows`,
    short: 'MMM',
    avgMinutes: 1,
    avgSeconds: 29,
    avgMilliseconds: 926,
    class: TrackClass.NITRO,
    cup: TrackCup.MUSHROOM,
  },
  {
    name: `Mushroom Gorge`,
    short: 'MG',
    avgMinutes: 1,
    avgSeconds: 56,
    avgMilliseconds: 931,
    class: TrackClass.NITRO,
    cup: TrackCup.MUSHROOM,
  },
  {
    name: `Toad's Factory`,
    short: 'TF',
    avgMinutes: 2,
    avgSeconds: 8,
    avgMilliseconds: 491,
    class: TrackClass.NITRO,
    cup: TrackCup.MUSHROOM,
  },
  {
    name: `Mario Circuit`,
    short: 'MC',
    avgMinutes: 1,
    avgSeconds: 35,
    avgMilliseconds: 223,
    class: TrackClass.NITRO,
    cup: TrackCup.FLOWER,
  },
  {
    name: `Coconut Mall`,
    short: 'CM',
    avgMinutes: 2,
    avgSeconds: 2,
    avgMilliseconds: 305,
    class: TrackClass.NITRO,
    cup: TrackCup.FLOWER,
  },
  {
    name: `DK's Snowboard Cross`,
    short: 'DKSC',
    avgMinutes: 2,
    avgSeconds: 12,
    avgMilliseconds: 965,
    class: TrackClass.NITRO,
    cup: TrackCup.FLOWER,
  },
  {
    name: `Wario's Gold Mine`,
    short: 'WGM',
    avgMinutes: 2,
    avgSeconds: 7,
    avgMilliseconds: 749,
    class: TrackClass.NITRO,
    cup: TrackCup.FLOWER,
  },
  {
    name: `Daisy Circuit`,
    short: 'DC',
    avgMinutes: 1,
    avgSeconds: 41,
    avgMilliseconds: 804,
    class: TrackClass.NITRO,
    cup: TrackCup.STAR,
  },
  {
    name: `Koopa Cape`,
    short: 'KC',
    avgMinutes: 2,
    avgSeconds: 38,
    avgMilliseconds: 197,
    class: TrackClass.NITRO,
    cup: TrackCup.STAR,
  },
  {
    name: `Maple Treeway`,
    short: 'MT',
    avgMinutes: 2,
    avgSeconds: 36,
    avgMilliseconds: 557,
    class: TrackClass.NITRO,
    cup: TrackCup.STAR,
  },
  {
    name: `Grumble Volcano`,
    short: 'GV',
    avgMinutes: 1,
    avgSeconds: 45,
    avgMilliseconds: 392,
    class: TrackClass.NITRO,
    cup: TrackCup.STAR,
  },
  {
    name: `Dry Dry Ruins`,
    short: 'DDR',
    avgMinutes: 2,
    avgSeconds: 13,
    avgMilliseconds: 857,
    class: TrackClass.NITRO,
    cup: TrackCup.SPECIAL,
  },
  {
    name: `Moonview Highway`,
    short: 'MH',
    avgMinutes: 1,
    avgSeconds: 59,
    avgMilliseconds: 914,
    class: TrackClass.NITRO,
    cup: TrackCup.SPECIAL,
  },
  {
    name: `Bowser's Castle`,
    short: 'BC',
    avgMinutes: 2,
    avgSeconds: 44,
    avgMilliseconds: 10,
    class: TrackClass.NITRO,
    cup: TrackCup.SPECIAL,
  },
  {
    name: `Rainbow Road`,
    short: 'RR',
    avgMinutes: 2,
    avgSeconds: 49,
    avgMilliseconds: 251,
    class: TrackClass.NITRO,
    cup: TrackCup.SPECIAL,
  },
  {
    name: `GCN Peach Beach`,
    short: 'rPB',
    avgMinutes: 1,
    avgSeconds: 23,
    avgMilliseconds: 911,
    class: TrackClass.RETRO,
    cup: TrackCup.SHELL,
  },
  {
    name: `DS Yoshi Falls`,
    short: 'rYF',
    avgMinutes: 1,
    avgSeconds: 8,
    avgMilliseconds: 338,
    class: TrackClass.RETRO,
    cup: TrackCup.SHELL,
  },
  {
    name: `SNES Ghost Valley 2`,
    short: 'rGV2',
    avgMinutes: 1,
    avgSeconds: 1,
    avgMilliseconds: 539,
    class: TrackClass.RETRO,
    cup: TrackCup.SHELL,
  },
  {
    name: `N64 Mario Raceway`,
    short: 'rMR',
    avgMinutes: 1,
    avgSeconds: 57,
    avgMilliseconds: 346,
    class: TrackClass.RETRO,
    cup: TrackCup.SHELL,
  },
  {
    name: `N64 Sherbet Land`,
    short: 'rSL',
    avgMinutes: 2,
    avgSeconds: 26,
    avgMilliseconds: 136,
    class: TrackClass.RETRO,
    cup: TrackCup.BANANA,
  },
  {
    name: `GBA Shy Guy Beach`,
    short: 'rSGB',
    avgMinutes: 1,
    avgSeconds: 37,
    avgMilliseconds: 933,
    class: TrackClass.RETRO,
    cup: TrackCup.BANANA,
  },
  {
    name: `DS Delfino Square`,
    short: 'rDS',
    avgMinutes: 2,
    avgSeconds: 24,
    avgMilliseconds: 306,
    class: TrackClass.RETRO,
    cup: TrackCup.BANANA,
  },
  {
    name: `GCN Waluigi Stadium`,
    short: 'rWS',
    avgMinutes: 2,
    avgSeconds: 17,
    avgMilliseconds: 716,
    class: TrackClass.RETRO,
    cup: TrackCup.BANANA,
  },
  {
    name: `DS Desert Hills`,
    short: 'rDH',
    avgMinutes: 1,
    avgSeconds: 51,
    avgMilliseconds: 520,
    class: TrackClass.RETRO,
    cup: TrackCup.LEAF,
  },
  {
    name: `GBA Bowser Castle 3`,
    short: 'rBC3',
    avgMinutes: 2,
    avgSeconds: 35,
    avgMilliseconds: 917,
    class: TrackClass.RETRO,
    cup: TrackCup.LEAF,
  },
  {
    name: `N64 DK's Jungle Parkway`,
    short: 'rDKJP',
    avgMinutes: 2,
    avgSeconds: 34,
    avgMilliseconds: 544,
    class: TrackClass.RETRO,
    cup: TrackCup.LEAF,
  },
  {
    name: `GCN Mario Circuit`,
    short: 'rMC',
    avgMinutes: 1,
    avgSeconds: 50,
    avgMilliseconds: 642,
    class: TrackClass.RETRO,
    cup: TrackCup.LEAF,
  },
  {
    name: `SNES Mario Circuit 3`,
    short: 'rMC3',
    avgMinutes: 1,
    avgSeconds: 28,
    avgMilliseconds: 934,
    class: TrackClass.RETRO,
    cup: TrackCup.LIGHTNING,
  },
  {
    name: `DS Peach Gardens`,
    short: 'rPG',
    avgMinutes: 2,
    avgSeconds: 18,
    avgMilliseconds: 968,
    class: TrackClass.RETRO,
    cup: TrackCup.LIGHTNING,
  },
  {
    name: `GCN DK Mountain`,
    short: 'rDKM',
    avgMinutes: 2,
    avgSeconds: 26,
    avgMilliseconds: 636,
    class: TrackClass.RETRO,
    cup: TrackCup.LIGHTNING,
  },
  {
    name: `N64 Bowser's Castle`,
    short: 'rBC',
    avgMinutes: 2,
    avgSeconds: 52,
    avgMilliseconds: 638,
    class: TrackClass.RETRO,
    cup: TrackCup.LIGHTNING,
  },
];

export function getSubSegments(trackNames: string[]): Set<TrackCountEnum> {
  const validSegments = new Set<TrackCountEnum>();
  const trackDataMap = trackNames.map((name) =>
    tracks32.find((elem) => elem.name === name)
  );
  if (
    trackDataMap[0]?.cup === trackDataMap[3]?.cup &&
    trackDataMap.length > 4
  ) {
    validSegments.add(TrackCountEnum.INDIVIDUAL_CUP);
  }
  if (
    trackDataMap[0]?.class === trackDataMap[15]?.class &&
    trackDataMap.length > 16
  ) {
    validSegments.add(TrackCountEnum.TRACKS_16);
  }
  return validSegments;
}
