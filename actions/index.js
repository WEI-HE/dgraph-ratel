import SHA256 from "crypto-js/sha256";

import {
    checkStatus,
    getEndpoint,
    makeFrame,
    setSharedHashSchema,
} from "../lib/helpers";
import { FRAME_TYPE_LOADING } from "../lib/const";

import { receiveFrame } from "./frames";

/**
 * runQuery runs the query and displays the appropriate result in a frame
 * @params query {String}
 * @params action {String}
 * @params [frameId] {String}
 *
 */
export function runQuery(query, action = "query") {
    return dispatch => {
        const frame = makeFrame({ query, action });

        dispatch(receiveFrame(frame));
    };
}

export function addScratchpadEntry(entry) {
    return {
        type: "ADD_SCRATCHPAD_ENTRY",
        ...entry,
    };
}

export function deleteScratchpadEntries() {
    return {
        type: "DELETE_SCRATCHPAD_ENTRIES",
    };
}

// createShare persists the queryText in the database.
function createShare(url, queryText) {
    const stringifiedQuery = encodeURI(queryText);

    return fetch(getEndpoint(url, "share"), {
        method: "POST",
        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
        },
        body: stringifiedQuery,
        credentials: "same-origin",
    })
        .then(checkStatus)
        .then(response => response.json())
        .then(result => {
            if (result.uids && result.uids.share) {
                return result.uids.share;
            }
        });
}

/**
 * getShareId gets the id used to share a query either by fetching one if one
 * exists, or persisting the queryText into the database.
 *
 * @params url {Object} - An object containing the Dgraph server url
 * @params queryText {String} - A raw query text as entered by the user
 * @returns {Promise}
 */
export function getShareId(url, queryText, final) {
    const encodedQuery = encodeURI(queryText);
    const queryHash = SHA256(encodedQuery).toString();
    const checkQuery = `{
        query(func: eq(_share_hash_, ${queryHash})) {
            uid
            _share_
        }
    }`;

    return fetch(getEndpoint(url, "query"), {
        method: "POST",
        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "text/plain",
        },
        body: checkQuery,
        credentials: "same-origin",
    })
        .then(checkStatus)
        .then(response => response.json())
        .then(result => {
            if (result.errors) {
                return setSharedHashSchema(url).then(() => {
                    return getShareId(url, queryText, true);
                });
            }

            const matchingQueries = result.data && result.data.query;

            // If no match, store the query.
            if (!matchingQueries || matchingQueries.length === 0) {
                return createShare(url, queryText);
            }

            if (matchingQueries.length === 1) {
                return matchingQueries[0].uid;
            }

            // If more than one result, we have a hash collision. Break it.
            for (let i = 0; i < matchingQueries.length; i++) {
                const q = matchingQueries[i];
                if (`"${q._share_}"` === encodedQuery) {
                    return q.uid;
                }
            }
        });
}

// runQueryByShareId runs the query by the given shareId and displays the frame.
export function runQueryByShareId(shareId) {
    return dispatch => {
        const frame = makeFrame({
            type: FRAME_TYPE_LOADING,
            share: shareId,
        });
        dispatch(receiveFrame(frame));
    };
}



// WEBPACK FOOTER //
// ./src/actions/index.js