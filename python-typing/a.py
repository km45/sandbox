import typing


class CoordinateOptionalElement(typing.TypedDict, total=False):
    z: float


class Coordinate(CoordinateOptionalElement):
    x: float
    y: float


def print_coordinate(p: Coordinate) -> None:
    if "z" in p:
        print("({}, {}, {})".format(p["x"], p["y"], p["z"]))
    else:
        print("({}, {})".format(p["x"], p["y"]))


def main():
    p0: Coordinate = {"x": 1, "y": 2}
    p1: Coordinate = {"x": 1, "y": 2, "z": 3}
    # p2: Coordinate = {"y": 2, "z": 3}

    print(p0)
    print(p1)

    print_coordinate(p0)
    print_coordinate(p1)


if __name__ == "__main__":
    main()
