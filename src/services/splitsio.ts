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
    webstie: string;
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
        version: '1.0.0',
        webstie: 'https://charlocharlie.github.io/mkwii-igt-calc/',
      },
      game: {
        longname: 'Mario Kart Wii',
        shortname: 'mkwii',
      },
      category: {
        longname: categoryLong,
      },
      segments,
    };

    return exchangeJSON;
  }

  /**
   * Throws error if the response is not 'ok'
   * @param input The resource that you wish to fetch
   * @param init An options object containing any custom settings that you want to apply to the request.
   * @return A promise that resolves a Response object
   */
  async validatedFetch(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const r = await fetch(input, init);

    if (!r.ok) {
      throw r;
    }

    return r;
  }

  /**
   * Upload a validly formatted JSON to splits.io
   * @param exchangeJSON Splits I/O Exchange Format object
   * @return URI for the run with its claim token
   */
  async uploadSplits(exchangeJSON: ExchangeJSON): Promise<SplitUploadResponse> {
    const response = await this.validatedFetch(
      'https://splits.io/api/v4/runs',
      {
        method: 'POST',
      }
    );
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

    await this.validatedFetch(request.uri, {
      method: request.method,
      body: formData,
    });

    return { claimUri, id };
  }
}
