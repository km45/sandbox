#include <grpcpp/create_channel.h>

#include "calculator.grpc.pb.h"

std::vector<std::array<double, 2>> LoadPoints() {
  std::vector<std::array<double, 2>> points;

  double x;
  double y;

  while (std::cin >> x >> y) {
    points.emplace_back(std::array<double, 2>({x, y}));
  }

  return points;
}

int main() {
  std::unique_ptr<calculator::ConvexHullCalculator::Stub> stub =
      calculator::ConvexHullCalculator::NewStub(grpc::CreateChannel(
          "localhost:50051", grpc::InsecureChannelCredentials()));

  calculator::ConvexHullRequest request;
  std::cerr << "[DEBUG] Show value of variable request:"
            << "\n"
            << request.DebugString() << std::endl;

  const auto& points = LoadPoints();

  for (const auto& point : points) {
    auto* p = request.add_points();
    p->set_x(point[0]);
    p->set_y(point[1]);
    std::cerr << "[DEBUG] Show value of variable request:"
              << "\n"
              << request.DebugString() << std::endl;
  }

  grpc::ClientContext context;
  calculator::ConvexHullReply reply;

  std::cerr << "[INFO] Show request to send server:"
            << "\n"
            << request.DebugString() << std::endl;
  stub->Calculate(&context, request, &reply);
  std::cerr << "[INFO] Show reply received from server:" << reply.DebugString()
            << std::endl;

  std::vector<std::array<double, 2>> vertexes;
  for (const auto& v : reply.vertexes()) {
    vertexes.emplace_back(std::array<double, 2>{v.x(), v.y()});
  }

  std::cout << "[";
  std::string delimiter;
  for (const auto& v : vertexes) {
    std::cout << delimiter;
    std::cout << "[" << v[0] << ", " << v[1] << "]";
    delimiter = ", ";
  }
  std::cout << "]" << std::endl;

  return 0;
}
