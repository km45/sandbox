import { useActionState, useEffect, useState } from "react";
import "./App.css";
import {
  SigmaContainer,
  SigmaContainerProps,
  useLoadGraph,
  ControlsContainer,
  ZoomControl,
  FullScreenControl,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/style.css";
import { MultiDirectedGraph } from "graphology";
import { EdgeArrowProgram } from "sigma/rendering";

import createClient from "openapi-fetch";
import type { paths } from "./api-schema";

import {
  EdgeCurvedArrowProgram,
  DEFAULT_EDGE_CURVATURE,
  indexParallelEdgesIndex,
} from "@sigma/edge-curve";

import { LayoutForceControl } from "@react-sigma/layout-force";

const client = createClient<paths>({ baseUrl: "/api" });

type NodeId = string;

export type Node = {
  id: NodeId;
  x: number;
  y: number;
};

export type Edge = {
  source: NodeId;
  target: NodeId;
  label: string;
};

export type State = {
  prompts?: string[];
  nodes?: Node[];
  edges?: Edge[];
};

function newPrompts(prevPrompts: string[] | undefined, queryData: FormData) {
  const action = queryData.get("action");

  switch (action) {
    case "add": {
      const p = queryData.get("prompt");
      if (typeof p !== "string") {
        throw new Error("Invalid prompt: " + p);
      }
      return (prevPrompts ?? []).concat([p]);
    }
    case "remove": {
      const stringifiedIndex = queryData.get("index");
      if (typeof stringifiedIndex !== "string") {
        throw new Error("Invalid index: " + stringifiedIndex);
      }
      const index = parseInt(stringifiedIndex);
      return prevPrompts?.filter((_, i) => i != index);
    }
    default:
      throw new Error("Invalid action: " + action);
  }
}

async function updatePrompts(
  prevState: State,
  queryData: FormData,
): Promise<State> {
  console.debug(prevState, queryData);

  const prompts = newPrompts(prevState.prompts, queryData);

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (prompts) {
    const { data, error } = await client.POST("/graph", {
      body: { prompts: prompts },
    });

    if (!data) {
      console.error(error);
      return prevState;
    }

    for (const error of data.errors) {
      console.error(error);
    }
    for (const node of data.nodes) {
      nodes.push({ id: node.id, x: node.x, y: node.y });
    }
    for (const edge of data.edges) {
      edges.push({
        source: edge.source,
        target: edge.target,
        label: edge.label,
      });
    }
  }

  const ret = { prompts: prompts, nodes: nodes, edges: edges };
  console.log("== ret ==");
  console.debug(ret);
  return ret;
}

const EDGE_SIZE_DEFAULT = 6;
const EDGE_SIZE_HIGHLIGHTED = 12;

function MyGraph(props: { nodes?: Node[]; edges?: Edge[] }) {
  const loadGraph = useLoadGraph();

  const graph = new MultiDirectedGraph();

  console.log(props);

  if (props.nodes) {
    for (const node of props.nodes) {
      graph.addNode(node.id, {
        x: node.x,
        y: node.y,
        label: node.id,
        size: EDGE_SIZE_DEFAULT,
      });
    }
  }

  if (props.edges) {
    for (const edge of props.edges) {
      graph.addEdge(edge.source, edge.target, {
        label: edge.label,
        type: "arrow",
        forceLabel: true,
        size: 6,
      });
    }
  }

  indexParallelEdgesIndex(graph, { edgeIndexAttribute: "parallelIndex" });

  graph.forEachEdge((edge, { parallelIndex }) => {
    if (typeof parallelIndex === "number") {
      graph.mergeEdgeAttributes(edge, {
        type: "curvedArrow",
        curvature: DEFAULT_EDGE_CURVATURE * parallelIndex,
      });
    } else {
      graph.setEdgeAttribute(edge, "type", "arrow");
    }
  });

  loadGraph(graph);

  return <></>;
}

function GraphEvents() {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      downEdge: (e) => {
        if (e.event.original.ctrlKey) {
          if (sigma.getGraph().getEdgeAttribute(e.edge, "selected")) {
            sigma.getGraph().removeEdgeAttribute(e.edge, "selected");
          } else {
            sigma.getGraph().setEdgeAttribute(e.edge, "selected", true);
          }
        }
      },
      downNode: (e) => {
        if (e.event.original.ctrlKey) {
          // with CTRL: change the highlight of the node
          if (sigma.getGraph().hasNodeAttribute(e.node, "highlighted")) {
            sigma.getGraph().removeNodeAttribute(e.node, "highlighted");
          } else {
            sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
          }
        } else {
          setDraggedNode(e.node);
        }
      },
      mousemovebody: (e) => {
        if (!draggedNode) {
          return;
        }

        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        // prevent sigma to move camera:
        e.preventSigmaDefault();
        // e.original.preventDefault();
        // e.original.stopPropagation();
      },
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
        }
      },
      mousedown: () => {
        if (!sigma.getCustomBBox()) {
          // disable the autoscale at the first down interaction
          sigma.setCustomBBox(sigma.getBBox());
        }
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
}

type EdgeReducerType = NonNullable<
  Parameters<typeof SigmaContainer>[0]["settings"]
>["edgeReducer"];
const EdgeReducer: EdgeReducerType = (_edge, data) => {
  const size = "selected" in data ? EDGE_SIZE_HIGHLIGHTED : EDGE_SIZE_DEFAULT;
  return { ...data, size: size };
};

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
              <option>disabled</option>
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
            <SigmaContainer
              graph={MultiDirectedGraph}
              settings={{
                edgeProgramClasses: {
                  arrow: EdgeArrowProgram,
                  curvedArrow: EdgeCurvedArrowProgram,
                },
                renderEdgeLabels: true,
                enableEdgeEvents: true,
                edgeReducer: EdgeReducer,
              }}
            >
              <MyGraph nodes={state.nodes} edges={state.edges} />
              <GraphEvents />
              <ControlsContainer position={"bottom-right"}>
                <ZoomControl />
                <FullScreenControl />
                <LayoutForceControl />
              </ControlsContainer>
            </SigmaContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
