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
RouteId = str


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


@dataclass(frozen=True)
class RouteSegment:
    source: NodeId
    target: NodeId


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


@app.get("/route")
def route(
    id: RouteId, *, from_node: NodeId | None = None, to_node: NodeId | None = None
) -> list[RouteSegment] | None:
    routes: dict[RouteId, tuple[RouteSegment, ...]] = {
        RouteId(1): (
            RouteSegment(NodeId(1), NodeId(2)),
            RouteSegment(NodeId(2), NodeId(3)),
            RouteSegment(NodeId(3), NodeId(4)),
        ),
        RouteId(2): (
            RouteSegment(NodeId(101), NodeId(2)),
            RouteSegment(NodeId(2), NodeId(3)),
            RouteSegment(NodeId(3), NodeId(104)),
        ),
        RouteId(3): (
            RouteSegment(NodeId(103), NodeId(3)),
            RouteSegment(NodeId(3), NodeId(2)),
            RouteSegment(NodeId(2), NodeId(102)),
        ),
        RouteId(4): (
            RouteSegment(NodeId(104), NodeId(210)),
            RouteSegment(NodeId(210), NodeId(211)),
            RouteSegment(NodeId(211), NodeId(212)),
            RouteSegment(NodeId(212), NodeId(213)),
            RouteSegment(NodeId(213), NodeId(214)),
            RouteSegment(NodeId(214), NodeId(215)),
            RouteSegment(NodeId(215), NodeId(216)),
            RouteSegment(NodeId(216), NodeId(217)),
            RouteSegment(NodeId(217), NodeId(218)),
            RouteSegment(NodeId(218), NodeId(219)),
            RouteSegment(NodeId(219), NodeId(220)),
            RouteSegment(NodeId(220), NodeId(221)),
            RouteSegment(NodeId(221), NodeId(222)),
            RouteSegment(NodeId(222), NodeId(223)),
            RouteSegment(NodeId(223), NodeId(224)),
            RouteSegment(NodeId(224), NodeId(225)),
            RouteSegment(NodeId(225), NodeId(226)),
            RouteSegment(NodeId(226), NodeId(227)),
            RouteSegment(NodeId(227), NodeId(228)),
            RouteSegment(NodeId(228), NodeId(229)),
            RouteSegment(NodeId(229), NodeId(230)),
        ),
        RouteId(5): (
            RouteSegment(NodeId(4), NodeId(310)),
            RouteSegment(NodeId(310), NodeId(311)),
            RouteSegment(NodeId(311), NodeId(312)),
            RouteSegment(NodeId(312), NodeId(313)),
            RouteSegment(NodeId(313), NodeId(314)),
            RouteSegment(NodeId(314), NodeId(315)),
            RouteSegment(NodeId(315), NodeId(316)),
            RouteSegment(NodeId(316), NodeId(317)),
            RouteSegment(NodeId(317), NodeId(318)),
            RouteSegment(NodeId(318), NodeId(319)),
            RouteSegment(NodeId(319), NodeId(320)),
            RouteSegment(NodeId(320), NodeId(321)),
            RouteSegment(NodeId(321), NodeId(322)),
            RouteSegment(NodeId(322), NodeId(323)),
            RouteSegment(NodeId(323), NodeId(324)),
            RouteSegment(NodeId(324), NodeId(325)),
            RouteSegment(NodeId(325), NodeId(326)),
            RouteSegment(NodeId(326), NodeId(327)),
            RouteSegment(NodeId(327), NodeId(328)),
            RouteSegment(NodeId(328), NodeId(329)),
            RouteSegment(NodeId(329), NodeId(330)),
        ),
        RouteId(6): (
            RouteSegment(NodeId(1), NodeId(410)),
            RouteSegment(NodeId(410), NodeId(420)),
            RouteSegment(NodeId(420), NodeId(430)),
        ),
        RouteId(7): (
            RouteSegment(NodeId(220), NodeId(221)),
            RouteSegment(NodeId(221), NodeId(325)),
            RouteSegment(NodeId(325), NodeId(324)),
            RouteSegment(NodeId(324), NodeId(420)),
        ),
    }

    if id not in routes:
        return None

    segments = routes[id]

    if from_node:
        # empty if specified node is not found
        index = next(
            (i for i, segment in enumerate(segments) if segment.source == from_node),
            len(segments),
        )
        segments = segments[index:]
    if to_node:
        # empty if specified node is not found
        index = next(
            (i for i, segment in enumerate(segments) if segment.target == to_node),
            -1,
        )
        segments = segments[: index + 1]

    return segments


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
        found = re.match(r"^ *route +(\d+)(?: +from +(\d+))?(?: +to +(\d+))? *", prompt)
        if found:
            id, from_node, to_node = found.groups()
            route_segments = route(id, from_node=from_node, to_node=to_node)
            if route_segments is None:
                errors.append(f"route {id} not found")
                continue
            for route_segment in route_segments:
                edges.add(Edge(route_segment.source, route_segment.target, id))

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
