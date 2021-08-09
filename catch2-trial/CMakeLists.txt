cmake_minimum_required(VERSION 3.14)
project(catch2trial)

#
# C++20
#
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

#
# static library catch2trial
#
add_library(catch2trial STATIC)
target_sources(catch2trial PRIVATE src/catch2trial/util.cpp)
target_include_directories(catch2trial PRIVATE include)

#
# Catch2
#
Include(FetchContent)
FetchContent_Declare(
    Catch2
    GIT_REPOSITORY https://github.com/catchorg/Catch2.git
    GIT_TAG v2.13.7
)
FetchContent_MakeAvailable(Catch2)

#
# unit test catch2trial_test
#
add_executable(catch2trial_test)
target_sources(catch2trial_test PRIVATE
    test/catch2trial/util_test.cpp
    test/main.cpp
)
target_include_directories(catch2trial_test PRIVATE include)
target_link_libraries(catch2trial_test Catch2::Catch2 catch2trial)
