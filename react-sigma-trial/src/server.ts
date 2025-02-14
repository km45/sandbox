"use server";

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

export async function updatePrompts(
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
        method: "POST", headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify({ prompts: prompts })
      }).then();
      if (!res.ok) {
        console.error("error occured!");
      }

      const json = await res.json();
      for (let error of json.errors) {
        console.error(error);
      }
      for (let node of json.nodes) {
        nodes.push({ id: node.id.value, x: node.x, y: node.y });
      }
      for (let edge of json.edges) {
        edges.push({ source: edge.source.value, target: edge.target.value });
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
