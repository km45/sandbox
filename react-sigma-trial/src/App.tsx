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
import { EdgeArrowProgram } from "sigma/rendering";

type NodeId = string;

export type Node = {
  id: NodeId;
  x: number;
  y: number;
};

export type Edge = {
  source: NodeId;
  target: NodeId;
};

export type State = {
  prompts?: string[];
  nodes?: Node[];
  edges?: Edge[];
};

function newPrompts(prevPrompts: string[] | undefined, queryData: FormData) {
  const action = queryData.get("action");

  switch (action) {
    case "add":
      const p = queryData.get("prompt");
      if (typeof p !== "string") {
        throw new Error("Invalid prompt: " + p);
      }
      return (prevPrompts ?? []).concat([p]);

    case "remove":
      const stringifiedIndex = queryData.get("index");
      if (typeof stringifiedIndex !== "string") {
        throw new Error("Invalid index: " + stringifiedIndex);
      }
      const index = parseInt(stringifiedIndex);
      return prevPrompts?.filter((_, i) => i != index);

    default:
      throw new Error("Invalid action: " + action);
  }
}

async function updatePrompts(
  prevState: State,
  queryData: FormData,
): Promise<State> {
  console.debug(prevState, queryData);

  try {
    const prompts = newPrompts(prevState.prompts, queryData);

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (prompts) {
      const res = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompts: prompts }),
      }).then();
      if (!res.ok) {
        console.error("error occured!");
      }

      const json = await res.json();
      for (let error of json.errors) {
        console.error(error);
      }
      for (let node of json.nodes) {
        nodes.push({ id: node.id, x: node.x, y: node.y });
      }
      for (let edge of json.edges) {
        edges.push({ source: edge.source, target: edge.target });
      }
    }

    const ret = { prompts: prompts, nodes: nodes, edges: edges };
    console.log("== ret ==");
    console.debug(ret);
    return ret;
  } catch (e) {
    console.error(e);
    return prevState;
  }
}

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
      graph.addEdge(edge.source, edge.target, { "type": "arrow" });
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
        <form
          action={submitAction}
          style={{
            display: "flex",
            alignItems: "center",
            margin: "10px",
            gap: "10px",
          }}
        >
          <div>sample</div>
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
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div
            className="has-background-light"
            style={{ resize: "horizontal", width: "20%", overflowX: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div>{state.prompts?.length ?? 0} prompt(s)</div>
              <div style={{ flexGrow: 1, flexBasis: 0, overflowY: "scroll" }}>
                {state.prompts?.map((prompt, index) => (
                  <div key={index}>
                    <form action={submitAction}>
                      <input type="hidden" name="action" value="remove" />
                      <input type="hidden" name="index" value={index} />
                      <button>{prompt}</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <SigmaContainer graph={MultiDirectedGraph} settings={{ edgeProgramClasses: { arrow: EdgeArrowProgram } }}>
              <MyGraph nodes={state.nodes} edges={state.edges} />
              <ControlsContainer position={"bottom-right"}>
                <ZoomControl />
                <FullScreenControl />
              </ControlsContainer>
            </SigmaContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
