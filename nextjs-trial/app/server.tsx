"use server"

import { Node, Edge } from "@/components/Canvas";

export async function generateGraphOnServer(prompts: string[]) {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        let flag1: boolean = false;
        let flag2: boolean = false;

        for (const prompt of prompts) {
                const a = parseInt(prompt)

                if (a == 1) {
                        nodes.push({ id: "1", label: "Node 1", x: 0, y: 0 });
                        flag1 = true;
                }
                if (a == 2) {
                        nodes.push({ id: "2", label: "Node 2", x: 1, y: 1 });
                        flag2 = true;
                }
                if (a == 3) {
                        nodes.push({ id: "3", label: "Node 3", x: 1, y: 2 });
                }
        }

        if (flag1 && flag2) {
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "red" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "blue" });

                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "limegreen" });

                edges.push({ start_node_id: "2", end_node_id: "1", size: 5, color: "green" });
                edges.push({ start_node_id: "3", end_node_id: "1", size: 5, color: "purple" });
                edges.push({ start_node_id: "1", end_node_id: "3", size: 5, color: "purple" });
        }

        return { nodes: nodes, edges: edges };
}
