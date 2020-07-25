/**
 * Manipulates a list of segments and interfaces with splits.io
 * Partial credit to https://github.com/LiveSplit/LiveSplitOne/blob/84f66004ba23a15288e08454fa9ee59b32a56ac8/src/util/SplitsIO.ts
 */
export interface Split {
  name: string;
  endedAt?: number;
  duration: number;
}

export interface SplitWithEndTimes extends Split {
  endedAt: number;
}

export interface ExchangeJSON {
  _schemaVersion: string;
  timer: {
    shortname: string;
    longname: string;
    version: string;
    website: string;
  };
  game: {
    longname: string;
    shortname: string;
  };
  category: {
    longname: string;
  };
  segments: Segment[];
}

export interface Segment {
  name: string;
  endedAt: {
    gametimeMS: number;
  };
}

export interface SplitUploadResponse {
  claimUri: string;
  id: string;
}

export interface Runner {
  avatar: string;
  created_at: string;
  display_name: string;
  id: string;
  name: string;
  twitch_id: string;
  twitch_name: string;
  updated_at: string;
}

export interface RunResponse {
  run: Run;
}

export interface Run {
  attempts: number | null;
  category: Category | null;
  created_at: string;
  default_timing: string;
  game: Category | null;
  gametime_duration_ms: number;
  gametime_sum_of_best_ms: number;
  id: string;
  image_url: string | null;
  parsed_at: string | null;
  program: string;
  realtime_duration_ms: number;
  realtime_sum_of_best_ms: string | null;
  runners: Runner[];
  segments: RunSegment[];
  srdc_id: string | null;
  updated_at: string;
  video_url: string | null;
}

export interface Category {
  created_at: string;
  id: string;
  name: string;
  srdc_id: string;
  updated_at: string;
  shortname?: string;
}

export interface RunSegment {
  display_name: string;
  gametime_duration_ms: number;
  gametime_end_ms: number;
  gametime_gold: boolean;
  gametime_reduced: boolean;
  gametime_shortest_duration_ms: number | null;
  gametime_skipped: boolean;
  gametime_start_ms: number;
  id: string;
  name: string;
  realtime_duration_ms: number;
  realtime_end_ms: number;
  realtime_gold: boolean;
  realtime_reduced: boolean;
  realtime_shortest_duration_ms: number | null;
  realtime_skipped: boolean;
  realtime_start_ms: number;
  segment_number: number;
}

/**
 * Throws error if the response is not 'ok'
 * @param input The resource that you wish to fetch
 * @param init An options object containing any custom settings that you want to apply to the request.
 * @return A promise that resolves a Response object
 */
export async function validatedFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const r = await fetch(input, init);

  if (!r.ok) {
    throw r;
  }

  return r;
}

export class SplitsIOService {
  private splits: Split[];

  /**
   * Create a new instance of the service for a set of splits
   * @param splits An array of objects containing name and duration in milliseconds of the segment
   */
  constructor(splits: Split[]) {
    this.splits = splits;
  }

  /**
   * Calculate the end time of each split using the durations of each segment
   */
  updateSegmentEndTimes(): SplitWithEndTimes[] {
    let sum = 0;
    return this.splits.map((split) => {
      sum += split.duration; // TODO: make sure this accumulator works
      return { ...split, endedAt: sum };
    });
  }

  /**
   * Format splits into a valid Splits I/O Exchange Format with proper metadata.
   * @param categoryLong Longname is a human-readable category name, intended for display to users.
   * @return Exchange JSON object
   */
  generateExchangeJSON(categoryLong: string): ExchangeJSON {
    const splitsWithEndTimes = this.updateSegmentEndTimes();
    const segments: Segment[] = splitsWithEndTimes.map((split) => {
      return {
        name: split.name,
        endedAt: {
          gametimeMS: split.endedAt,
        },
      };
    });
    const exchangeJSON: ExchangeJSON = {
      _schemaVersion: 'v1.0.0',
      timer: {
        shortname: 'mkwii-igt-calc',
        longname: 'Mario Kart Wii In-game Time Calculator',
        version: '2.0.0',
        website: 'https://charlocharlie.github.io/mkwii-igt-calc/',
      },
      game: {
        longname: 'Mario Kart Wii',
        shortname: 'mkw',
      },
      category: {
        longname: categoryLong,
      },
      segments,
    };

    return exchangeJSON;
  }

  /**
   * Upload a validly formatted JSON to splits.io
   * @param exchangeJSON Splits I/O Exchange Format object
   * @return URI for the run with its claim token
   */
  async uploadSplits(exchangeJSON: ExchangeJSON): Promise<SplitUploadResponse> {
    const response = await validatedFetch('https://splits.io/api/v4/runs', {
      method: 'POST',
    });
    const json = await response.json();
    const claimUri = json.uris.claim_uri;
    const request = json.presigned_request;
    const { id } = json;

    const formData = new FormData();
    const { fields } = request;

    formData.append('key', fields.key);
    formData.append('policy', fields.policy);
    formData.append('x-amz-credential', fields['x-amz-credential']);
    formData.append('x-amz-algorithm', fields['x-amz-algorithm']);
    formData.append('x-amz-date', fields['x-amz-date']);
    formData.append('x-amz-signature', fields['x-amz-signature']);
    formData.append('file', JSON.stringify(exchangeJSON));

    await validatedFetch(request.uri, {
      method: request.method,
      body: formData,
    });

    return { claimUri, id };
  }
}

/**
 * Get data for a run
 * @param id Splits I/O base 36 run ID
 * @return The data for the run
 */
export async function getRun(id: string): Promise<Run> {
  const response = await validatedFetch(`https://splits.io/api/v4/runs/${id}`, {
    method: 'GET',
  });
  const json: RunResponse = await response.json();
  return json.run;
}
