"use server"

import { Nodes, Edges, Props } from "@/components/Canvas";

const allNodes: Nodes = {
        "1": { label: "node 1", x: 0, y: 0 },
        "2": { label: "node 2", x: 1, y: 1 },
        "3": { label: "node 3", x: 1, y: 2 },
};

const allEdges: { [key: string]: { edgeGroupId: number, startNodeId: string, endNodeId: string, color: string } } = {
        "0100": { edgeGroupId: 1, startNodeId: "1", endNodeId: "2", color: "red" },
        "0101": { edgeGroupId: 1, startNodeId: "2", endNodeId: "3", color: "red" },
        "0200": { edgeGroupId: 2, startNodeId: "1", endNodeId: "2", color: "blue" },
        "0300": { edgeGroupId: 3, startNodeId: "2", endNodeId: "3", color: "lightblue" },
        "0400": { edgeGroupId: 4, startNodeId: "3", endNodeId: "2", color: "green" },
        "0401": { edgeGroupId: 4, startNodeId: "2", endNodeId: "1", color: "green" },
        "1000": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1001": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1002": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1003": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1004": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1005": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
        "1006": { edgeGroupId: 10, startNodeId: "1", endNodeId: "2", color: "purple" },
};

const edgeGroups: { [key: number]: string[] } = {
        1: ["0100", "0101"],
        2: ["0200"],
        3: ["0300"],
        4: ["0400", "0401"],
        10: ["1000", "1001", "1002", "1003", "1004", "1005", "1006"],
}

export async function generateGraphOnServer(prompts: string[]): Promise<Props> {
        const edges: Edges = {};
        for (const prompt of prompts) {
                const edgeGroupId = parseInt(prompt);
                if (!(edgeGroupId in edgeGroups)) {
                        console.warn("Not found edgeGroupId=" + edgeGroupId);
                        continue;
                }
                for (const edgeKey of edgeGroups[edgeGroupId]) {
                        const edge = allEdges[edgeKey];
                        edges[edgeKey] = {
                                startNodeId: edge.startNodeId,
                                endNodeId: edge.endNodeId,
                                color: edge.color,
                                label: String(edge.edgeGroupId),
                        };
                }

        }

        const nodes: Nodes = {};
        for (const edge of Object.values(edges)) {
                for (const id of [edge.startNodeId, edge.endNodeId]) {
                        const v = allNodes[id];
                        nodes[id] = {
                                label: v.label,
                                x: v.x,
                                y: v.y
                        };
                }
        }

        return { nodes: nodes, edges: edges };
}
