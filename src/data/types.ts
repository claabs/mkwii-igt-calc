export interface TimeDurationInputAttr {
  minutes?: string;
  seconds?: string;
  milliseconds?: string;
  plcMinutes: string;
  plcSeconds: string;
  plcMilliseconds: string;
  label: string;
  valid?: boolean;
  index?: number;
}

export interface TimeDurationInputChangeDetail {
  index: number;
  minutes: string;
  seconds: string;
  milliseconds: string;
  valid: boolean;
}

export type TimeDurationInputEvent = CustomEvent<TimeDurationInputChangeDetail>;

export enum TrackCountEnum {
  TRACKS_32,
  TRACKS_16,
  INDIVIDUAL_CUP,
}

export enum Category16Enum {
  NITRO,
  RETRO,
}

export enum CategoryCupEnum {
  MUSHROOM,
  FLOWER,
  STAR,
  SPECIAL,
  SHELL,
  BANANA,
  LEAF,
  LIGHTNING,
}
