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
    if (prompts && prompts.length > 0) {
      const count = parseInt(prompts[0]);
      for (let x = 0; x < count * 10; x++) {
        for (let y = 0; y < 100; y++) {
          nodes.push({ id: x + "_" + y, x: x, y: y });
        }
      }
    }

    const edges: Edge[] = [];
    if (nodes.length > 0) {
      edges.push({ source: "0_0", target: "1_2" });
      edges.push({ source: "1_2", target: "1_0" });
    }

    return { prompts: prompts, nodes: nodes, edges: edges };
  } catch (e) {
    console.error(e);
    return prevState;
  }
}
