cmake_minimum_required(VERSION 3.14)
project(doctesttrial)

#
# C++20
#
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

#
# static library doctesttrial
#
add_library(doctesttrial STATIC)
target_sources(doctesttrial PRIVATE src/doctesttrial/util.cpp)
target_include_directories(doctesttrial PRIVATE include)

#
# doctest
#
include(FetchContent)
FetchContent_Declare(
    doctest
    URL https://github.com/onqtam/doctest/archive/refs/tags/2.4.6.tar.gz
)
FetchContent_Populate(doctest)

#
# unit test doctesttrial_test
#
add_executable(doctesttrial_test)
target_sources(doctesttrial_test PRIVATE
    test/doctesttrial/util_test.cpp
    test/main.cpp
)
target_include_directories(doctesttrial_test PRIVATE include ${doctest_SOURCE_DIR}/doctest)
target_link_libraries(doctesttrial_test doctesttrial)
