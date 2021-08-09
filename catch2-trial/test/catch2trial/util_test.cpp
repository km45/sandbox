#include <limits>

#include <catch2/catch.hpp>

#include "catch2trial/util.hpp"

TEST_CASE("ArithmeticMean", "std::int32_t") {
  const auto& ArithmeticMean = catch2trial::ArithmeticMean;
  SECTION("positive value and positive value") {
    REQUIRE(ArithmeticMean(1, 1) == 1);
    REQUIRE(ArithmeticMean(2, 4) == 3);
    REQUIRE(ArithmeticMean(3, 9) == 6);
    REQUIRE(ArithmeticMean(4, 16) == 10);
  }
  SECTION("positive value and negative value") {
    REQUIRE(ArithmeticMean(1, -1) == 0);
    REQUIRE(ArithmeticMean(2, -4) == -1);
    REQUIRE(ArithmeticMean(3, -9) == -3);
    REQUIRE(ArithmeticMean(4, -16) == -6);
  }
  SECTION("negative value and positive value") {
    REQUIRE(ArithmeticMean(-1, 1) == 0);
    REQUIRE(ArithmeticMean(-2, 4) == 1);
    REQUIRE(ArithmeticMean(-3, 9) == 3);
    REQUIRE(ArithmeticMean(-4, 16) == 6);
  }
  SECTION("negative value and negative value") {
    REQUIRE(ArithmeticMean(-1, -1) == -1);
    REQUIRE(ArithmeticMean(-2, -4) == -3);
    REQUIRE(ArithmeticMean(-3, -9) == -6);
    REQUIRE(ArithmeticMean(-4, -16) == -10);
  }
  SECTION("zero") {
    REQUIRE(ArithmeticMean(0, 0) == 0);
    REQUIRE(ArithmeticMean(0, 2) == 1);
    REQUIRE(ArithmeticMean(0, -2) == -1);
    REQUIRE(ArithmeticMean(2, 0) == 1);
    REQUIRE(ArithmeticMean(-2, 0) == -1);
  }
  SECTION("near limits") {
    constexpr auto kAlmostMax = 2147483647;
    constexpr auto kAlmostMin = -2147483647;
    {
      static_assert(std::numeric_limits<std::int32_t>::max() == kAlmostMax);
      static_assert(std::numeric_limits<std::int32_t>::min() == kAlmostMin - 1);
    }
    REQUIRE(ArithmeticMean(kAlmostMax, kAlmostMax - 2) == kAlmostMax - 1);
    REQUIRE(ArithmeticMean(kAlmostMin, kAlmostMin + 2) == kAlmostMin + 1);
    REQUIRE(ArithmeticMean(kAlmostMax, kAlmostMin) == 0);
    REQUIRE(ArithmeticMean(kAlmostMin, kAlmostMax) == 0);
  }
}
