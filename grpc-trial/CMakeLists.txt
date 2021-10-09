cmake_minimum_required(VERSION 3.16)
project(convex_hull_calculator_client)

#
# gRPC
#
include(FetchContent)
FetchContent_Declare(
  gRPC
  GIT_REPOSITORY https://github.com/grpc/grpc
  GIT_TAG        v1.41.0
)
set(FETCHCONTENT_QUIET OFF)
FetchContent_MakeAvailable(gRPC)

#
# generate files by protoc
#
add_custom_command(
    OUTPUT
        "${CMAKE_CURRENT_BINARY_DIR}/calculator.grpc.pb.cc"
        "${CMAKE_CURRENT_BINARY_DIR}/calculator.grpc.pb.h"
        "${CMAKE_CURRENT_BINARY_DIR}/calculator.pb.cc"
        "${CMAKE_CURRENT_BINARY_DIR}/calculator.pb.h"
    COMMAND protoc
    ARGS
        -I "${PROJECT_SOURCE_DIR}/protos"
        --cpp_out "${CMAKE_CURRENT_BINARY_DIR}"
        --grpc_out "${CMAKE_CURRENT_BINARY_DIR}"
        --plugin=protoc-gen-grpc="${grpc_BINARY_DIR}/grpc_cpp_plugin"
        "${PROJECT_SOURCE_DIR}/protos/calculator.proto"
    DEPENDS protos/calculator.proto
)

#
# proto objects
#
add_library(proto_objects OBJECT
    ${CMAKE_CURRENT_BINARY_DIR}/calculator.grpc.pb.cc
    ${CMAKE_CURRENT_BINARY_DIR}/calculator.pb.cc
)
target_include_directories(proto_objects PRIVATE
    ${grpc_SOURCE_DIR}/include
    ${grpc_SOURCE_DIR}/third_party/abseil-cpp
    ${grpc_SOURCE_DIR}/third_party/protobuf/src
)

#
# convex_hull_calculator_client
#
add_executable(convex_hull_calculator_client)
target_sources(convex_hull_calculator_client PRIVATE main.cpp)
target_include_directories(convex_hull_calculator_client PRIVATE
    ${CMAKE_CURRENT_BINARY_DIR}
    ${grpc_SOURCE_DIR}/include
    ${grpc_SOURCE_DIR}/third_party/abseil-cpp
    ${grpc_SOURCE_DIR}/third_party/protobuf/src
)
target_link_libraries(convex_hull_calculator_client
    grpc++
    proto_objects
)
target_link_directories(convex_hull_calculator_client PRIVATE ${grpc_BINARY_DIR})
