"use client"

import { Canvas, Edge, Node } from "../components/Canvas";
import { generateGraphOnServer } from "./server";
import { useState } from "react";


export default function Home() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  async function formToGraph(formData: FormData) {
    const res = await generateGraphOnServer(formData);

    setNodes(res.nodes);
    setEdges(res.edges);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={formToGraph}>
        <input name="a" />
        <button>form to graph</button>
      </form>
      <Canvas nodes={nodes} edges={edges} />
    </main>
  );
}
