import logging
import sys

import grpc

import calculator_pb2
import calculator_pb2_grpc


def run():
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = calculator_pb2_grpc.ConvexHullCalculatorStub(channel)
        request = calculator_pb2.ConvexHullRequest()

        logging.debug(f"Show value of variable request:\n{request}")

        points = [
            [float(values[0]), float(values[1])]
            for values in [line.split(" ") for line in sys.stdin]
        ]
        for p in points:
            request.points.append(calculator_pb2.Point(x=p[0], y=p[1]))
            logging.debug(f"Show value of variable request:\n{request}")

        logging.info(f"Show request to send server:\n{request}")
        reply: calculator_pb2.ConvexHullReply = stub.Calculate(request)
        logging.info(f"Show reply received from server:\n{reply}")

        output = [[vertex.x, vertex.y] for vertex in reply.vertexes]
        print(output)


if __name__ == "__main__":
    logging.basicConfig(
        # level=logging.DEBUG
        # level=logging.INFO
    )
    run()
