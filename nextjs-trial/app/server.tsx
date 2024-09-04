"use server"

import { Node, Edge } from "@/components/Canvas";

export async function generateGraphOnServer(formData: FormData) {
        const a = parseInt(formData.get("a") as string);

        const nodes: Node[] = [];
        const edges: Edge[] = [];

        if (a >= 1) {
                nodes.push({ id: "1", label: "Node 1", x: 0, y: 0, size: 10, color: "blue" });
        }
        if (a >= 2) {
                nodes.push({ id: "2", label: "Node 2", x: 1, y: 1, size: 20, color: "red" });
        }
        if (a >= 3) {
                nodes.push({ id: "3", label: "Node 3", x: 1, y: 2, size: 30, color: "green" });
        }
        if (a >= 4) {
                edges.push({ start_node_id: "1", end_node_id: "2", size: 5, color: "purple" });
        }

        return { nodes: nodes, edges: edges };
}
