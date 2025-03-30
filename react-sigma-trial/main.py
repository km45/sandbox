from fastapi import FastAPI
from pydantic import BaseModel
from dataclasses import dataclass
import re

# Run server with command: fastapi dev main.py
app = FastAPI()


@app.get("/")
def root():
    return {"Hello": "World"}


NodeId = str


@dataclass(frozen=True)
class Node:
    id: NodeId
    x: int
    y: int


@dataclass(frozen=True)
class Edge:
    source: NodeId
    target: NodeId
    label: str


def node(id: NodeId) -> Node | None:
    #      1  2  3  4
    #   +------------
    #  1|__1      __4
    #  0|   __2__3
    # -1|101102103104
    nodes = (
        Node("1", 1, 1),
        Node("2", 2, 0),
        Node("3", 3, 0),
        Node("4", 4, 1),
        Node("101", 1, -1),
        Node("102", 2, -1),
        Node("103", 3, -1),
        Node("104", 4, -1),
    )

    for node in nodes:
        if node.id == id:
            return node

    return None


def trail(id: str) -> tuple[Edge, ...] | None:
    if id == "1":
        return (
            Edge("1", "2", id),
            Edge("2", "3", id),
            Edge("3", "4", id),
        )
    elif id == "2":
        return (
            Edge("101", "2", id),
            Edge("2", "3", id),
            Edge("3", "104", id),
        )
    elif id == "3":
        return (
            Edge("103", "3", id),
            Edge("3", "2", id),
            Edge("2", "102", id),
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
                continue
            for edge in v:
                edges.add(edge)

    print(edges)

    for edge in edges:
        v = node(edge.source)
        if v is not None:
            nodes.add(v)
        v = node(edge.target)
        if v is not None:
            nodes.add(v)

    print(nodes)

    return GraphResponce(edges=list(edges), nodes=list(nodes), errors=errors)
