"use server"

import { Node, Edge } from "@/components/Canvas";

export async function generateGraphOnServer(prompts: string[]) {
        const nodes: Set<Node> = new Set();
        const edges: Set<Edge> = new Set();

        const NODE1 = { id: "1", label: "Node 1", x: 0, y: 0 };
        const NODE2 = { id: "2", label: "Node 2", x: 1, y: 1 };
        const NODE3 = { id: "3", label: "Node 3", x: 1, y: 2 };

        for (const prompt of prompts) {
                const a = parseInt(prompt)

                if (a == 1) {
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "red" });
                        edges.add({ start_node_id: "2", end_node_id: "3", color: "red" });
                        nodes.add(NODE1);
                        nodes.add(NODE2);
                        nodes.add(NODE3);
                }
                if (a == 2) {
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "blue" });
                        nodes.add(NODE1);
                        nodes.add(NODE2);
                }
                if (a == 3) {
                        edges.add({ start_node_id: "2", end_node_id: "3", color: "blue" });
                        nodes.add(NODE2);
                        nodes.add(NODE3);
                }
                if (a == 4) {
                        edges.add({ start_node_id: "3", end_node_id: "2", color: "green" });
                        edges.add({ start_node_id: "2", end_node_id: "1", color: "green" });
                        nodes.add(NODE1);
                        nodes.add(NODE2);
                        nodes.add(NODE3);
                }
                if (a == 10) {
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                        edges.add({ start_node_id: "1", end_node_id: "2", color: "purple" });
                }
        }

        return { nodes: nodes, edges: edges };
}
