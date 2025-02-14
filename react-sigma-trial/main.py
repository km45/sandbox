from fastapi import FastAPI
from pydantic import BaseModel
from dataclasses import dataclass
import re

# Run server with command: fastapi dev main.py
app = FastAPI()


@app.get("/")
def root():
    return {"Hello": "World"}


@dataclass(frozen=True)
class NodeId:
    value: int


@dataclass(frozen=True)
class Node:
    id: NodeId
    x: int
    y: int


@dataclass(frozen=True)
class Edge:
    source: NodeId
    target: NodeId


@dataclass(frozen=True)
class Trail:
    edges: list[Edge]
    nodes: list[Node]


def trail(id: str) -> Trail | None:
    if id == "1":
        return Trail(
            edges=[
                Edge(NodeId(value=1), NodeId(value=2)),
                Edge(NodeId(value=2), NodeId(value=3)),
                Edge(NodeId(value=3), NodeId(value=4)),
            ],
            nodes=[
                Node(NodeId(value=1), 1, 1),
                Node(NodeId(value=2), 2, 0),
                Node(NodeId(value=3), 3, 0),
                Node(NodeId(value=4), 4, 1),
            ],
        )
    elif id == "2":
        return Trail(
            edges=[
                Edge(NodeId(value=101), NodeId(value=2)),
                Edge(NodeId(value=2), NodeId(value=3)),
                Edge(NodeId(value=3), NodeId(value=104)),
            ],
            nodes=[
                Node(NodeId(value=101), 1, -1),
                Node(NodeId(value=2), 2, 0),
                Node(NodeId(value=3), 3, 0),
                Node(NodeId(value=104), 4, -1),
            ],
        )
    else:
        return None


class GraphRequest(BaseModel):
    prompts: list[str]


class GraphResponce(BaseModel):
    edges: list[Edge]
    nodes: list[Node]
    errors: list[str]


@app.post("/graph")
def graph(request: GraphRequest) -> GraphResponce:
    print("app.post API /graph")
    print(request)

    edges: set[Edge] = set()
    nodes: set[Node] = set()
    errors: list[str] = []

    for prompt in request.prompts:
        found = re.findall(r"^ *trail +([0-9]+) *", prompt)
        if found:
            id = found[0]
            v = trail(id)
            if v is None:
                errors.append(f"trail {id} not found")
            else:
                for edge in v.edges:
                    edges.add(edge)
                for node in v.nodes:
                    nodes.add(node)

    return GraphResponce(edges=list(edges), nodes=list(nodes), errors=errors)
