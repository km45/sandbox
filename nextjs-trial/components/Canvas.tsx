"use client";

import { MultiGraph } from "graphology";

import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

import { EdgeCurvedArrowProgram, DEFAULT_EDGE_CURVATURE } from '@sigma/edge-curve';
import { EdgeArrowProgram } from 'sigma/rendering';

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

        const groups = Map.groupBy(Object.values(edges), (edge) => {
                const nodeId1 = edge.startNodeId;
                const nodeId2 = edge.endNodeId;
                return nodeId1 < nodeId2 ? nodeId1 + "_" + nodeId2 : nodeId2 + "_" + nodeId1;
        });
        for (const group of groups) {
                const edges = group[1];

                const SIZE = 5;

                if (Object.keys(edges).length == 1) {
                        const edge = edges[0];
                        g.addEdge(edge.startNodeId, edge.endNodeId, {
                                size: SIZE, color: edge.color, label: edge.label,
                                type: "straight"
                        });
                        continue;
                }

                for (const [index, edge] of edges.entries()) {
                        const curvature = calcCurvature(index);
                        g.addEdge(edge.startNodeId, edge.endNodeId, {
                                size: SIZE, color: edge.color, label: edge.label,
                                type: "curved", curvature: curvature
                        });
                }
        }

        return (
                <SigmaContainer graph={g} settings={{
                        edgeProgramClasses: { straight: EdgeArrowProgram, curved: EdgeCurvedArrowProgram },
                        renderEdgeLabels: true
                }} />
        );
}
