"use client";

import { MultiGraph } from "graphology";

import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

import { EdgeCurvedArrowProgram, DEFAULT_EDGE_CURVATURE } from '@sigma/edge-curve';

export type Node = {
        id: string;
        label: string;
        x: Number;
        y: Number;
}

export type Edge = {
        start_node_id: string;
        end_node_id: string;
        color: string;
};

export type Props = {
        nodes: Node[];
        edges: Edge[];
}

function calcCurvature(index: number) {
        console.assert(0 <= index);
        return DEFAULT_EDGE_CURVATURE * (index / 2 + 1);
}

export function Canvas({ nodes, edges }: Props) {
        const g = new MultiGraph();
        for (const node of nodes) {
                const SIZE = 20;
                g.addNode(node.id, { label: node.label, x: node.x, y: node.y, size: SIZE });
        }

        const groups = Map.groupBy(edges, (edge) => { return edge.start_node_id + "_" + edge.end_node_id });
        for (const group of groups) {
                const edges = group[1];
                for (const [index, edge] of edges.entries()) {
                        const label = edge.start_node_id + " -> " + edge.end_node_id;
                        const curvature = calcCurvature(index);
                        const SIZE = 5;
                        g.addEdge(edge.start_node_id, edge.end_node_id, { size: SIZE, color: edge.color, label: label, curvature: curvature });
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
