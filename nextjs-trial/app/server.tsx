"use server"

import { Nodes, Edges, Props } from "@/components/Canvas";

const allNodes: Nodes = {
        "0": { label: "0", x: -2, y: 1 },
        "1": { label: "1", x: -1, y: 0 },
        "2": { label: "2", x: 1, y: 0 },
        "3": { label: "3", x: 2, y: 1 },
        "4": { label: "4", x: -2, y: -1 },
        "5": { label: "5", x: 2, y: -1 },
        "6": { label: "6", x: 1, y: -1 },
        "7": { label: "7", x: -1, y: 1 },
        "8": { label: "8", x: -1, y: 2 },
        "9": { label: "9", x: 1, y: 2 },
};

const allEdges: { [key: string]: { edgeGroupId: number, startNodeId: string, endNodeId: string, color: string } } = {
        "1,0": { edgeGroupId: 1, startNodeId: "0", endNodeId: "1", color: "red" },
        "1,1": { edgeGroupId: 1, startNodeId: "1", endNodeId: "2", color: "red" },
        "1,2": { edgeGroupId: 1, startNodeId: "2", endNodeId: "3", color: "red" },
        "2,0": { edgeGroupId: 2, startNodeId: "4", endNodeId: "1", color: "blue" },
        "2,1": { edgeGroupId: 2, startNodeId: "1", endNodeId: "2", color: "blue" },
        "2,2": { edgeGroupId: 2, startNodeId: "2", endNodeId: "5", color: "blue" },
        "3,0": { edgeGroupId: 3, startNodeId: "6", endNodeId: "2", color: "green" },
        "3,1": { edgeGroupId: 3, startNodeId: "2", endNodeId: "1", color: "green" },
        "3,2": { edgeGroupId: 3, startNodeId: "1", endNodeId: "7", color: "green" },
        "10": { edgeGroupId: 10, startNodeId: "2", endNodeId: "1", color: "#200020" },
        "11": { edgeGroupId: 11, startNodeId: "2", endNodeId: "1", color: "#400040" },
        "12": { edgeGroupId: 12, startNodeId: "2", endNodeId: "1", color: "#600060" },
        "13": { edgeGroupId: 13, startNodeId: "2", endNodeId: "1", color: "#800080" },
        "14": { edgeGroupId: 14, startNodeId: "2", endNodeId: "1", color: "#A000A0" },
        "15": { edgeGroupId: 15, startNodeId: "2", endNodeId: "1", color: "#C000C0" },
        "16": { edgeGroupId: 16, startNodeId: "2", endNodeId: "1", color: "#E000E0" },
};

const edgeGroups: { [key: number]: string[] } = {
        1: ["1,0", "1,1", "1,2"],
        2: ["2,0", "2,1", "2,2"],
        3: ["3,0", "3,1", "3,2"],
        10: ["10"],
        11: ["11"],
        12: ["12"],
        13: ["13"],
        14: ["14"],
        15: ["15"],
        16: ["16"],
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
