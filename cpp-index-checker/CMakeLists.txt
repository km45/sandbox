cmake_minimum_required(VERSION 3.1)
enable_language(CXX)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

project(cpp_index_checker)

add_compile_options(
    -Wall
    -Wextra
    -Werror
    -Wno-error=missing-field-initializers
)

file(
    GLOB_RECURSE
    SOURCES
    ${PROJECT_SOURCE_DIR}/src/sources/*.cpp
)

add_executable(cpp_index_checker ${SOURCES})

target_include_directories(
    cpp_index_checker
    PRIVATE
    ${PROJECT_SOURCE_DIR}/src/headers
)
