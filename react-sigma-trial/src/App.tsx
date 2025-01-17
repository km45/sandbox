import { useActionState } from "react";
import "./App.css";
import {
  SigmaContainer,
  useLoadGraph,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/style.css";
import { MultiDirectedGraph } from "graphology";
import { Edge, Node, updatePrompts } from "./server";

const sigmaStyle = { height: "500px", width: "500px" };

function MyGraph(props: { nodes?: Node[]; edges?: Edge[] }) {
  const loadGraph = useLoadGraph();

  const graph = new MultiDirectedGraph();

  console.log(props);

  if (props.nodes) {
    for (const node of props.nodes) {
      graph.addNode(node.id, { x: node.x, y: node.y, label: node.id });
    }
  }

  if (props.edges) {
    for (const edge of props.edges) {
      graph.addEdge(edge.source, edge.target);
    }
  }

  loadGraph(graph);

  return <></>;
}

function App() {
  const [state, submitAction] = useActionState(updatePrompts, {});

  return (
    <>
      <div>
        <>
          <div>
            <form action={submitAction}>
              <input type="hidden" name="action" value="add" />
              <input type="text" name="prompt" />
            </form>
          </div>
        </>
        {state.prompts?.map((prompt, index) => (
          <div key={index}>
            <form action={submitAction}>
              <input type="hidden" name="action" value="remove" />
              <input type="hidden" name="index" value={index} />
              <input type="submit" value={prompt} />
            </form>
          </div>
        ))}
      </div>
      <SigmaContainer style={sigmaStyle}>
        <MyGraph nodes={state.nodes} edges={state.edges} />
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>
    </>
  );
}

export default App;
