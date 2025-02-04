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
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <div className="has-background-light">
        <div>sample</div>
        <div className="dropdown is-hoverable">
          <div className="dropdown-trigger">
            <button className="button" aria-controls="dropdown-menu">
              <span>{state.prompts?.length ?? 0} prompt(s)</span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu">
            <div className="dropdown-content">
              {state.prompts?.map((prompt, index) => (
                <div className="dropdown-item">
                  <form key={index} action={submitAction}>
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="index" value={index} />
                    <button>{prompt}</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <form action={submitAction}>
            <div className="select is-rounded">
              <select title="short input interpretation">
                <option>dummy</option>
                <option disabled={true}>trail</option>
                <option disabled={true}>node</option>
              </select>
            </div>

            <input type="hidden" name="action" value="add" />
            <input
              type="text"
              name="prompt"
              placeholder="type a prompt here"
              className="input is-rounded"
            />
          </form>
        </div>
      </div>

      <div style={{ flexGrow: 1 }}>
        <SigmaContainer>
          <MyGraph nodes={state.nodes} edges={state.edges} />
          <ControlsContainer position={"bottom-right"}>
            <ZoomControl />
            <FullScreenControl />
          </ControlsContainer>
        </SigmaContainer>
      </div>
    </div>
  );
}

export default App;
