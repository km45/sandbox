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
class NodeInfo:
    x: int
    y: int
    node_name: str


@dataclass(frozen=True)
class Node:
    id: NodeId
    info: NodeInfo


@dataclass(frozen=True)
class EdgeInfo:
    route_id: RouteId
    route_name: str


@dataclass(frozen=True)
class Edge:
    source: NodeId
    target: NodeId
    info: EdgeInfo


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
        Node("1", NodeInfo(1, 1, "い町")),
        Node("2", NodeInfo(2, 0, "ろ町")),
        Node("3", NodeInfo(3, 0, "は町")),
        Node("4", NodeInfo(4, 1, "に町")),
        Node("101", NodeInfo(1, -1, "ほ町")),
        Node("102", NodeInfo(2, -1, "へ町")),
        Node("103", NodeInfo(3, -1, "と町")),
        Node("104", NodeInfo(4, -1, "ち町")),
        # --
        Node("210", NodeInfo(10, -2, "り町")),
        Node("211", NodeInfo(11, -2, "ぬ町")),
        Node("212", NodeInfo(12, -2, "る町")),
        Node("213", NodeInfo(13, -2, "を町")),
        Node("214", NodeInfo(14, -2, "わ町")),
        Node("215", NodeInfo(15, -2, "か町")),
        Node("216", NodeInfo(16, -2, "よ町")),
        Node("217", NodeInfo(17, -2, "た町")),
        Node("218", NodeInfo(18, -2, "れ町")),
        Node("219", NodeInfo(19, -2, "そ町")),
        Node("220", NodeInfo(20, -2, "つ町")),
        Node("221", NodeInfo(21, -2, "ね町")),
        Node("222", NodeInfo(22, -2, "な町")),
        Node("223", NodeInfo(23, -2, "ら町")),
        Node("224", NodeInfo(24, -2, "む町")),
        Node("225", NodeInfo(25, -2, "う町")),
        Node("226", NodeInfo(26, -2, "ゐ町")),
        Node("227", NodeInfo(27, -2, "の町")),
        Node("228", NodeInfo(28, -2, "お町")),
        Node("229", NodeInfo(29, -2, "く町")),
        Node("230", NodeInfo(30, -2, "や町")),
        # --
        Node("310", NodeInfo(10, 2, "ま町")),
        Node("311", NodeInfo(11, 2, "け町")),
        Node("312", NodeInfo(12, 2, "ふ町")),
        Node("313", NodeInfo(13, 2, "こ町")),
        Node("314", NodeInfo(14, 2, "え町")),
        Node("315", NodeInfo(15, 2, "て町")),
        Node("316", NodeInfo(16, 2, "あ町")),
        Node("317", NodeInfo(17, 2, "さ町")),
        Node("318", NodeInfo(18, 2, "き町")),
        Node("319", NodeInfo(19, 2, "ゆ町")),
        Node("320", NodeInfo(20, 2, "め町")),
        Node("321", NodeInfo(21, 2, "み町")),
        Node("322", NodeInfo(22, 2, "し町")),
        Node("323", NodeInfo(23, 2, "ゑ町")),
        Node("324", NodeInfo(24, 2, "ひ町")),
        Node("325", NodeInfo(25, 2, "も町")),
        Node("326", NodeInfo(26, 2, "せ町")),
        Node("327", NodeInfo(27, 2, "す町")),
        Node("328", NodeInfo(28, 2, "甲町")),
        Node("329", NodeInfo(29, 2, "乙町")),
        Node("330", NodeInfo(30, 2, "丙町")),
        # --
        Node("410", NodeInfo(0, 10, "丁町")),
        Node("420", NodeInfo(0, 20, "戊町")),
        Node("430", NodeInfo(0, 30, "己町")),
        # 庚
        # 辛
        # 壬
        # 癸
    )

    for node in nodes:
        if node.id == id:
            return node

    return None


@app.get("/route")
def route(id: RouteId) -> str:
    return f"{id}号線"


@app.get("/route/segments")
def route_segments(
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


class Result(BaseModel):
    error: str | None = None
    warnings: list[str] | None = None
    explanations: list[str] | None = None


class GraphResponce(BaseModel):
    edges: list[Edge]
    nodes: list[Node]
    results: list[Result]


@app.post("/graph")
def graph(request: GraphRequest) -> GraphResponce:
    edges: set[Edge] = set()
    nodes: set[Node] = set()
    results: list[Result] = []

    for prompt in request.prompts:
        warnings: list[str] = []
        explanations: list[str] = []

        found = re.match(r"^ *route +(\d+)(?: +from +(\d+))?(?: +to +(\d+))? *", prompt)
        if found:
            id, from_node, to_node = found.groups()
            segments = route_segments(id, from_node=from_node, to_node=to_node)
            if segments is None:
                results.append(Result(error=f"Not found route {id}."))
                continue
            route_name = route(id)
            for segment in segments:
                edges.add(
                    Edge(segment.source, segment.target, EdgeInfo(id, route_name))
                )
            if len(segments) == 0:
                warnings.append("No segments.")
            explanations.append(route_name)

            if from_node:
                v = node(from_node)
                if v is None:
                    warnings.append(f"Not found node {from_node}.")
                else:
                    explanations.append(f"{v.info.node_name}から")
            if to_node:
                v = node(to_node)
                if v is None:
                    warnings.append(f"Not found node {to_node}.")
                else:
                    explanations.append(f"{v.info.node_name}まで")
            results.append(
                Result(
                    warnings=warnings if len(warnings) > 0 else None,
                    explanations=explanations if len(explanations) > 0 else None,
                )
            )
    for edge in edges:
        v = node(edge.source)
        if v is not None:
            nodes.add(v)
        v = node(edge.target)
        if v is not None:
            nodes.add(v)

    return GraphResponce(edges=list(edges), nodes=list(nodes), results=results)
