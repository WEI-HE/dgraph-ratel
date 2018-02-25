import React from "react";
import ProgressBar from "react-bootstrap/lib/ProgressBar";

import "../assets/css/Graph.scss";

export default function Progress({ perc }) {
    return (
        <ProgressBar
            className="Graph-progress"
            active={true}
            now={perc}
            min={0}
            max={100}
            label={`${perc}%`}
        />
    );
}



// WEBPACK FOOTER //
// ./src/components/Progress.js