import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import "./App.css";
import {
  SigmaContainer,
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
import type { paths, components } from "./api-schema";

import {
  EdgeCurvedArrowProgram,
  DEFAULT_EDGE_CURVATURE,
  indexParallelEdgesIndex,
} from "@sigma/edge-curve";

import { LayoutForceControl } from "@react-sigma/layout-force";

const client = createClient<paths>({ baseUrl: "/api" });

type Edge = components["schemas"]["Edge"];
type Node = components["schemas"]["Node"];
type PromptResult = components["schemas"]["Result"];

type State = {
  prompts?: string[];
  promptResults?: PromptResult[];
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
      return [p].concat(prevPrompts ?? []);
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
  const prompts = newPrompts(prevState.prompts, queryData);

  if (!prompts) {
    return prevState;
  }

  const { data, error } = await client.POST("/graph", {
    body: { prompts: prompts },
  });

  if (!data) {
    console.error(error);
    return prevState;
  }

  return {
    prompts: prompts,
    promptResults: data.results,
    nodes: data.nodes,
    edges: data.edges,
  };
}

function MyGraph(props: { nodes?: Node[]; edges?: Edge[] }) {
  const loadGraph = useLoadGraph();

  const graph = useMemo(() => {
    const graph = new MultiDirectedGraph();

    if (props.nodes) {
      for (const node of props.nodes) {
        graph.addNode(node.id, {
          info: node.info,
          x: node.info.x, // set initial values
          y: node.info.y, // set initial values
        });
      }
    }

    if (props.edges) {
      for (const edge of props.edges) {
        graph.addEdge(edge.source, edge.target, {
          info: edge.info,
          type: "arrow",
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

    return graph;
  }, [props.nodes, props.edges]);

  loadGraph(graph);
  return null;
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

function App() {
  const [state, submitAction] = useActionState(updatePrompts, {});

  const [tab, setTab] = useState<"prompts" | "config" | "inspector" | "pin">(
    "prompts",
  );

  const [edgeSize, SetEdgeSize] = useState(6);

  const [enableForceLabelForEdges, setEnableForceLabelForEdges] =
    useState(true);
  const [enableForceLabelForNodes, setEnableForceLabelForNodes] =
    useState(false);

  const [enableLabelForRouteId, SetEnableLabelForRouteId] = useState(true);
  const [enableLabelForRouteName, SetEnableLabelForRouteName] = useState(false);
  const [enableLabelForNodeId, SetEnableLabelForNodeId] = useState(true);
  const [enableLabelForNodeName, SetEnableLabelForNodeName] = useState(false);

  type EdgeReducerType = NonNullable<
    Parameters<typeof SigmaContainer>[0]["settings"]
  >["edgeReducer"];
  type EdgeReducerParameters = Parameters<NonNullable<EdgeReducerType>>;
  const EdgeReducer: EdgeReducerType = useCallback(
    (_edge: EdgeReducerParameters[0], data: EdgeReducerParameters[1]) => {
      const size = "selected" in data ? edgeSize * 2 : edgeSize;

      const info: components["schemas"]["EdgeInfo"] = data.info;
      const labelElements = [];
      if (enableLabelForRouteId) {
        labelElements.push(info.route_id);
      }
      if (enableLabelForRouteName) {
        labelElements.push(info.route_name);
      }

      return {
        ...data,
        size: size,
        forceLabel: enableForceLabelForEdges,
        label: labelElements.join(", "),
      };
    },
    [
      edgeSize,
      enableForceLabelForEdges,
      // for label elements
      enableLabelForRouteId,
      enableLabelForRouteName,
    ],
  );

  type NodeReducerType = NonNullable<
    Parameters<typeof SigmaContainer>[0]["settings"]
  >["nodeReducer"];
  type NodeReducerParameters = Parameters<NonNullable<NodeReducerType>>;
  const NodeReducer: NodeReducerType = useCallback(
    (node: NodeReducerParameters[0], data: NodeReducerParameters[1]) => {
      const info: components["schemas"]["NodeInfo"] = data.info;
      const labelElements = [];
      if (enableLabelForNodeId) {
        labelElements.push(node);
      }
      if (enableLabelForNodeName) {
        labelElements.push(info.node_name);
      }

      return {
        ...data,
        forceLabel: enableForceLabelForNodes,
        label: labelElements.join(", "),
      };
    },
    [
      enableForceLabelForNodes,
      // for label elements
      enableLabelForNodeId,
      enableLabelForNodeName,
    ],
  );

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

          {/*
          <div className="select is-rounded">
            <select title="short input interpretation">
              <option>disabled</option>
              <option disabled={true}>node</option>
            </select>
          </div>
          */}

          <input type="hidden" name="action" value="add" />
          <div className="control has-icons-left" style={{ width: "100%" }}>
            <input
              type="text"
              name="prompt"
              placeholder="type a prompt here"
              className="input is-rounded"
            />
            <span className="icon is-left">
              <i className="fas fa-terminal"></i>
            </span>
          </div>
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
              <div className="tabs is-fullwidth">
                <ul>
                  <li className={tab === "prompts" ? "is-active" : undefined}>
                    <a onClick={() => setTab("prompts")}>
                      <span className="icon is-small">
                        <i className="fas fa-route" aria-hidden="true"></i>
                      </span>
                      <span>{state.prompts?.length ?? 0}</span>
                    </a>
                  </li>

                  <li className={tab === "config" ? "is-active" : undefined}>
                    <a onClick={() => setTab("config")}>
                      <span className="icon is-small">
                        <i className="fas fa-sliders-h" aria-hidden="true"></i>
                      </span>
                      <span>&#8203;</span>
                    </a>
                  </li>
                  <li className={tab === "inspector" ? "is-active" : undefined}>
                    <a onClick={() => setTab("inspector")}>
                      <span className="icon is-small">
                        <i className="fas fa-ruler" aria-hidden="true"></i>
                      </span>
                      <span>&#8203;</span>
                    </a>
                  </li>
                  <li className={tab === "pin" ? "is-active" : undefined}>
                    <a onClick={() => setTab("pin")}>
                      <span className="icon is-small">
                        <i className="fas fa-map-pin" aria-hidden="true"></i>
                      </span>
                      <span>&#8203;</span>
                    </a>
                  </li>
                </ul>
              </div>
              {tab === "prompts" && (
                <>
                  <div
                    style={{ flexGrow: 1, flexBasis: 0, overflowY: "scroll" }}
                  >
                    {state.prompts?.map((prompt, index) => {
                      const result = state.promptResults?.[index];

                      const articleClassName = result?.error
                        ? "message is-danger"
                        : result?.warnings
                          ? "message is-warning"
                          : "message is-success";

                      return (
                        <div className="block" key={index}>
                          <form action={submitAction}>
                            <input type="hidden" name="action" value="remove" />
                            <input type="hidden" name="index" value={index} />
                            <article className={articleClassName}>
                              <div className="message-header">
                                {prompt}
                                <button className="delete" />
                              </div>
                              <div className="message-body">
                                {result?.error && (
                                  <span key={index} className="icon-text">
                                    <span className="icon has-text-danger">
                                      <i className="fas fa-ban"></i>
                                    </span>
                                    <span>{result.error}</span>
                                  </span>
                                )}
                                {result?.warnings &&
                                  result.warnings.map((warning, index) => (
                                    <span key={index} className="icon-text">
                                      <span className="icon has-text-warning">
                                        <i className="fas fa-triangle-exclamation"></i>
                                      </span>
                                      <span>{warning}</span>
                                    </span>
                                  ))}
                                {result?.explanations &&
                                  result.explanations.map(
                                    (explanation, index) => (
                                      <div key={index}>{explanation}</div>
                                    ),
                                  )}
                              </div>
                            </article>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {tab === "config" && (
                <div>
                  <div className="field">
                    <label className="label">node label</label>
                    <div className="checkboxes">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableForceLabelForNodes}
                          onChange={(e) =>
                            setEnableForceLabelForNodes(e.target.checked)
                          }
                        />
                        force
                      </label>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableLabelForNodeId}
                          onChange={(e) =>
                            SetEnableLabelForNodeId(e.target.checked)
                          }
                        />
                        node id
                      </label>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableLabelForNodeName}
                          onChange={(e) =>
                            SetEnableLabelForNodeName(e.target.checked)
                          }
                        />
                        node name
                      </label>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">edge label</label>
                    <div className="checkboxes">
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableForceLabelForEdges}
                          onChange={(e) =>
                            setEnableForceLabelForEdges(e.target.checked)
                          }
                        />
                        force
                      </label>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableLabelForRouteId}
                          onChange={(e) =>
                            SetEnableLabelForRouteId(e.target.checked)
                          }
                        />
                        route id
                      </label>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={enableLabelForRouteName}
                          onChange={(e) =>
                            SetEnableLabelForRouteName(e.target.checked)
                          }
                        />
                        route name
                      </label>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">edge size</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input is-rounded"
                        value={edgeSize}
                        onChange={(e) => SetEdgeSize(Number(e.target.value))}
                      />
                    </div>
                    <p className="help">size of the selected edges: 2x</p>
                  </div>
                </div>
              )}
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
                nodeReducer: NodeReducer,
                allowInvalidContainer: true,
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
