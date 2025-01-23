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
    <div className="h-dvh flex flex-col">
      <div className="navbar bg-red-400">
        <div className="">
          <div className="dropdown dropdown-hover">
            <summary className="btn">
              <div className="indicator">
                <div className="indicator-item">{state.prompts?.length}</div>
                prompts
              </div>
            </summary>
            <ul className="dropdown-content menu bg-base-100">
              {state.prompts?.map((prompt, index) => (
                <li key={index}>
                  <form action={submitAction}>
                    <input type="hidden" name="action" value="remove" />
                    <input type="hidden" name="index" value={index} />
                    <input type="submit" value={prompt} />
                  </form>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="">
          <form action={submitAction} className="flex">
            <div
              className="tooltip tooltip-bottom flex-none"
              data-tip="short input interpretation"
            >
              <select defaultValue="dummy" className="select">
                <option>dummy</option>
                <option disabled={true}>trail</option>
                <option disabled={true}>node</option>
              </select>
            </div>
            <input type="hidden" name="action" value="add" />
            <input
              type="text"
              className="input grow"
              name="prompt"
              placeholder="type a prompt here"
            />
          </form>
        </div>
        <div className="">sample</div>
      </div>

      <div className="flex-grow">
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
