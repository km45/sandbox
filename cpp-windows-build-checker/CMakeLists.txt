cmake_minimum_required(VERSION 3.1)
enable_language(CXX)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project(cpp_windows_build_checker)

file(
    GLOB_RECURSE
    SOURCES
    ${PROJECT_SOURCE_DIR}/src/*.cpp
)

add_executable(cpp_windows_build_checker ${SOURCES})
