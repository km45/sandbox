"use client";

import Graph from "graphology";

import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

export type Node = {
        id: string;
        label: string;
        x: Number;
        y: Number;
        size: Number;
        color: string;
}

export type Edge = {
        start_node_id: string;
        end_node_id: string;
        size: Number;
        color: string;
};

export type Props = {
        nodes: Node[];
        edges: Edge[];
}

export function Canvas({ nodes, edges }: Props) {
        const g = new Graph();
        for (const node of nodes) {
                g.addNode(node.id, { label: node.label, x: node.x, y: node.y, size: node.size, color: node.color });
        }
        for (const edge of edges) {
                g.addEdge(edge.start_node_id, edge.end_node_id, { size: edge.size, color: edge.color });
        }
        return (
                <SigmaContainer graph={g} />
        );
}
