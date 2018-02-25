import React from "react";

import { collapseQuery } from "../lib/helpers";

export default function QueryPreview({ query, action, onSelectQuery }) {
    return (
        <div
            className="query-row"
            onClick={e => {
                e.preventDefault();
                onSelectQuery(query, action);

                // Scroll to top.
                // IDEA: This breaks encapsulation. Is there a better way?
                document.querySelector(".main-content").scrollTop = 0;
            }}
        >
            <i className="fa fa-search query-prompt" />{" "}
            <span className="preview">{collapseQuery(query)}</span>
        </div>
    );
}



// WEBPACK FOOTER //
// ./src/components/QueryPreview.js