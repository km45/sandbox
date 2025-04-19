from fastapi import FastAPI
from pydantic import BaseModel
from dataclasses import dataclass
import re

# Run server with command: fastapi dev server.py
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
        # --
        Node("210", 10, -2),
        Node("211", 11, -2),
        Node("212", 12, -2),
        Node("213", 13, -2),
        Node("214", 14, -2),
        Node("215", 15, -2),
        Node("216", 16, -2),
        Node("217", 17, -2),
        Node("218", 18, -2),
        Node("219", 19, -2),
        Node("220", 20, -2),
        Node("221", 21, -2),
        Node("222", 22, -2),
        Node("223", 23, -2),
        Node("224", 24, -2),
        Node("225", 25, -2),
        Node("226", 26, -2),
        Node("227", 27, -2),
        Node("228", 28, -2),
        Node("229", 29, -2),
        Node("230", 30, -2),
        # --
        Node("310", 10, 2),
        Node("311", 11, 2),
        Node("312", 12, 2),
        Node("313", 13, 2),
        Node("314", 14, 2),
        Node("315", 15, 2),
        Node("316", 16, 2),
        Node("317", 17, 2),
        Node("318", 18, 2),
        Node("319", 19, 2),
        Node("320", 20, 2),
        Node("321", 21, 2),
        Node("322", 22, 2),
        Node("323", 23, 2),
        Node("324", 24, 2),
        Node("325", 25, 2),
        Node("326", 26, 2),
        Node("327", 27, 2),
        Node("328", 28, 2),
        Node("329", 29, 2),
        Node("330", 30, 2),
        # --
        Node("410", 0, 10),
        Node("420", 0, 20),
        Node("430", 0, 30),
    )

    for node in nodes:
        if node.id == id:
            return node

    return None


def trail(id: str) -> tuple[Edge, ...] | None:
    match id:
        case "1":
            return (
                Edge("1", "2", id),
                Edge("2", "3", id),
                Edge("3", "4", id),
            )
        case "2":
            return (
                Edge("101", "2", id),
                Edge("2", "3", id),
                Edge("3", "104", id),
            )
        case "3":
            return (
                Edge("103", "3", id),
                Edge("3", "2", id),
                Edge("2", "102", id),
            )
        case "4":
            return (
                Edge("104", "210", id),
                Edge("210", "211", id),
                Edge("211", "212", id),
                Edge("212", "213", id),
                Edge("213", "214", id),
                Edge("214", "215", id),
                Edge("215", "216", id),
                Edge("216", "217", id),
                Edge("217", "218", id),
                Edge("218", "219", id),
                Edge("219", "220", id),
                Edge("220", "221", id),
                Edge("221", "222", id),
                Edge("222", "223", id),
                Edge("223", "224", id),
                Edge("224", "225", id),
                Edge("225", "226", id),
                Edge("226", "227", id),
                Edge("227", "228", id),
                Edge("228", "229", id),
                Edge("229", "230", id),
            )
        case "5":
            return (
                Edge("4", "310", id),
                Edge("310", "311", id),
                Edge("311", "312", id),
                Edge("312", "313", id),
                Edge("313", "314", id),
                Edge("314", "315", id),
                Edge("315", "316", id),
                Edge("316", "317", id),
                Edge("317", "318", id),
                Edge("318", "319", id),
                Edge("319", "320", id),
                Edge("320", "321", id),
                Edge("321", "322", id),
                Edge("322", "323", id),
                Edge("323", "324", id),
                Edge("324", "325", id),
                Edge("325", "326", id),
                Edge("326", "327", id),
                Edge("327", "328", id),
                Edge("328", "329", id),
                Edge("329", "330", id),
            )
        case "6":
            return (
                Edge("1", "410", id),
                Edge("410", "420", id),
                Edge("420", "430", id),
            )
        case "7":
            return (
                Edge("220", "221", id),
                Edge("221", "325", id),
                Edge("325", "324", id),
                Edge("324", "420", id),
            )
        case _:
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
