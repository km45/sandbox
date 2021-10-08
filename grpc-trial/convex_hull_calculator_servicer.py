import logging
from concurrent.futures import ThreadPoolExecutor

import grpc
from scipy.spatial import ConvexHull

import calculator_pb2
import calculator_pb2_grpc


class ConvexHullCalculatorServicer(calculator_pb2_grpc.ConvexHullCalculator):
    def Calculate(self, request: calculator_pb2.ConvexHullRequest, context):
        logging.info(f"Show received request:\n{request}")

        convex_hull_input = [[point.x, point.y] for point in request.points]
        logging.debug(f"Show value of variable convex_hull_input:\n{convex_hull_input}")

        convex_hull_output = ConvexHull(convex_hull_input)

        reply = calculator_pb2.ConvexHullReply()
        for vertex in convex_hull_output.vertices:
            reply.vertexes.append(
                calculator_pb2.Point(
                    x=convex_hull_input[vertex][0], y=convex_hull_input[vertex][1]
                )
            )

        logging.info(f"Show reply to send client:\n{reply}")
        return reply


def serve():
    server = grpc.server(ThreadPoolExecutor(max_workers=1))
    calculator_pb2_grpc.add_ConvexHullCalculatorServicer_to_server(
        ConvexHullCalculatorServicer(), server
    )
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    logging.basicConfig(
        # level=logging.DEBUG
        level=logging.INFO
    )
    serve()
