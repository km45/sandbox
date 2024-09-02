import { Canvas } from "../components/Canvas";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Canvas
        nodes={[
          { id: "1", label: "Node 1", x: 0, y: 0, size: 10, color: "blue" },
          { id: "2", label: "Node 2", x: 1, y: 1, size: 20, color: "red" },
          { id: "3", label: "Node 3", x: 1, y: 2, size: 30, color: "green" },
        ]}
        edges={[
          { start_node_id: "1", end_node_id: "2", size: 5, color: "purple" },
        ]} />
    </main>
  );
}
