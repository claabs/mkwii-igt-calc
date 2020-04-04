export interface TimeDurationInputAttr {
  minutes?: string;
  seconds?: string;
  milliseconds?: string;
  plcMinutes: string;
  plcSeconds: string;
  plcMilliseconds: string;
  label: string;
  index?: number;
}

export interface TimeDurationInputChangeDetail {
  index: number;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

export type TimeDurationInputEvent = CustomEvent<TimeDurationInputChangeDetail>;
