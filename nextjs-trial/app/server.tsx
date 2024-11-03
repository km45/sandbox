"use server"

import { Node, Edge } from "@/components/Canvas";

export async function generateGraphOnServer(prompts: string[]) {
        const NODE1 = { id: "1", label: "Node 1", x: 0, y: 0 };
        const NODE2 = { id: "2", label: "Node 2", x: 1, y: 1 };
        const NODE3 = { id: "3", label: "Node 3", x: 1, y: 2 };

        const edges = new Set<Edge>;
        for (const prompt of prompts) {
                const a = parseInt(prompt)

                if (a == 1) {
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "red" });
                        edges.add({ start_node_id: NODE2.id, end_node_id: NODE3.id, color: "red" });
                }
                if (a == 2) {
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "blue" });
                }
                if (a == 3) {
                        edges.add({ start_node_id: NODE2.id, end_node_id: NODE3.id, color: "blue" });
                }
                if (a == 4) {
                        edges.add({ start_node_id: NODE3.id, end_node_id: NODE2.id, color: "green" });
                        edges.add({ start_node_id: NODE2.id, end_node_id: NODE1.id, color: "green" });
                }
                if (a == 10) {
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                        edges.add({ start_node_id: NODE1.id, end_node_id: NODE2.id, color: "purple" });
                }
        }

        const node_ids = new Set<string>;
        for (const edge of edges) {
                node_ids.add(edge.start_node_id);
                node_ids.add(edge.end_node_id);
        }

        const nodes = new Set<Node>;
        if (node_ids.has(NODE1.id)) {
                nodes.add(NODE1);
        }
        if (node_ids.has(NODE2.id)) {
                nodes.add(NODE2);
        }
        if (node_ids.has(NODE3.id)) {
                nodes.add(NODE3);
        }

        return { nodes: nodes, edges: edges };
}
