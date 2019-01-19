/**
 * Manipulates a list of segments and interfaces with splits.io
 * Partial credit to https://github.com/LiveSplit/LiveSplitOne/blob/84f66004ba23a15288e08454fa9ee59b32a56ac8/src/util/SplitsIO.ts
 */
export class SplitsIOService {

    /**
     * Create a new instance of the service for a set of splits
     * @param {Array<Object<string, number>>} splits An array of objects containing name and duration in milliseconds of the segment
     */
    constructor(splits) {
        this.splits = splits;
        this.exchangeSchema = {};
    }

    /**
     * Calculate the end time of each split using the durations of each segment
     */
    updateSegmentEndTimes() {
        let sum = 0;
        this.splits.forEach((element, index, array) => {
            sum += element.duration;
            this.splits[index].endedAt = sum;
        });
    }
    
    /**
     * Format splits into a valid Splits I/O Exchange Format with proper metadata.
     * @param {string} categoryLong Longname is a human-readable category name, intended for display to users.
     */
    generateExchangeJSON(categoryLong) {
        this.updateSegmentEndTimes();
        const segments = this.splits.map((split) => {
            return {
                name: split.name,
                endedAt: {
                    gametimeMS: split.endedAt
                }
            }
        })
        const exchangeJSON = {
            _schemaVersion: 'v1.0.0',
            timer: {
                shortname: 'mkwii-igt-calc',
                longname: 'Mario Kart Wii In-game Time Calculator',
                version: '1.0.0',
                webstie: 'https://charlocharlie.github.io/mkwii-igt-calc/'
            },
            game: {
                longname: 'Mario Kart Wii',
                shortname: 'mkwii'
            },
            category: {
                longname: categoryLong
            },
            segments: segments
        }
        
        return exchangeJSON;
    }
    
    /**
     * Throws error if the response is not 'ok'
     * @param {*} input The resource that you wish to fetch
     * @param {Object} init An options object containing any custom settings that you want to apply to the request. 
     * @returns A promise that resolves a Response object
     */
    async validatedFetch(input, init) {
        const r = await fetch(input, init);

        if (!r.ok) {
            throw r;
        }

        return r;
    }

    /**
     * Upload a validly formatted JSON to splits.io
     * @param {Object} exchangeJSON Splits I/O Exchange Format object
     * @returns URI for the run with its claim token
     */
    async uploadSplits(exchangeJSON) {
        const response = await this.validatedFetch(
            "https://splits.io/api/v4/runs",
            {
                method: "POST",
            }
        );
        const json = await response.json();
        const claimUri = json.uris.claim_uri;
        const request = json.presigned_request;
        const id = json.id;

        const formData = new FormData();
        const fields = request.fields;

        formData.append("key", fields.key);
        formData.append("policy", fields.policy);
        formData.append("x-amz-credential", fields["x-amz-credential"]);
        formData.append("x-amz-algorithm", fields["x-amz-algorithm"]);
        formData.append("x-amz-date", fields["x-amz-date"]);
        formData.append("x-amz-signature", fields["x-amz-signature"]);
        formData.append("file", JSON.stringify(exchangeJSON));

        await this.validatedFetch(
            request.uri,
            {
                method: request.method,
                body: formData,
            }
        );

        return {claimUri, id};
    }
}