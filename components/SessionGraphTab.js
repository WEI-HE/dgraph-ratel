import React from "react";

import GraphContainer from "../containers/GraphContainer";

export default function SessionGraphTab({
    active,
    onBeforeGraphRender,
    onGraphRendered,
    onNodeSelected,
    onNodeHovered,
    selectedNode,
    hoveredNode,
    nodesDataset,
    edgesDataset,
    response,
}) {
    return (
        <div className="content-container">
            <GraphContainer
                response={response}
                onBeforeRender={onBeforeGraphRender}
                onRendered={onGraphRendered}
                onNodeSelected={onNodeSelected}
                onNodeHovered={onNodeHovered}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                nodesDataset={nodesDataset}
                edgesDataset={edgesDataset}
            />
        </div>
    );
}



// WEBPACK FOOTER //
// ./src/components/SessionGraphTab.js