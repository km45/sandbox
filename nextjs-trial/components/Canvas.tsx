"use client";

import { MultiGraph } from "graphology";

import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

import { EdgeCurvedArrowProgram, DEFAULT_EDGE_CURVATURE } from '@sigma/edge-curve';

export type NodeValue = {
        label: string;
        x: number;
        y: number;
}

export type Nodes = { [key: string]: NodeValue };

export type EdgeValue = {
        startNodeId: string;
        endNodeId: string;
        label: string;
        color: string;
}

export type Edges = { [key: string]: EdgeValue };

export type Props = {
        nodes: Nodes;
        edges: Edges;
}

function calcCurvature(index: number) {
        console.assert(0 <= index);
        return DEFAULT_EDGE_CURVATURE * (index / 2 + 1);
}

export function Canvas({ nodes, edges }: Props) {
        const g = new MultiGraph();
        for (const [key, value] of Object.entries(nodes)) {
                const SIZE = 20;
                g.addNode(key, { label: value.label, x: value.x, y: value.y, size: SIZE });
        }

        const groups = Map.groupBy(Object.values(edges), (edge) => { return edge.startNodeId + "_" + edge.endNodeId });
        for (const group of groups) {
                const edges = group[1];
                for (const [index, edge] of edges.entries()) {
                        const label = edge.label;
                        const curvature = calcCurvature(index);
                        const SIZE = 5;
                        g.addEdge(edge.startNodeId, edge.endNodeId, { size: SIZE, color: edge.color, label: label, curvature: curvature });
                }
        }

        return (
                <SigmaContainer graph={g} settings={{
                        defaultEdgeType: "curvedArrow",
                        edgeProgramClasses: { curvedArrow: EdgeCurvedArrowProgram },
                        renderEdgeLabels: true
                }} />
        );
}
