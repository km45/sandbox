#include <limits>

#include "doctest.h"

#include "doctesttrial/util.hpp"

TEST_CASE("ArithmeticMean std::int32_t") {
  const auto& ArithmeticMean = doctesttrial::ArithmeticMean;
  SUBCASE("positive value and positive value") {
    CHECK_EQ(ArithmeticMean(1, 1), 1);
    CHECK_EQ(ArithmeticMean(2, 4), 3);
    CHECK_EQ(ArithmeticMean(3, 9), 6);
    CHECK_EQ(ArithmeticMean(4, 16), 10);
  }
  SUBCASE("positive value and negative value") {
    CHECK_EQ(ArithmeticMean(1, -1), 0);
    CHECK_EQ(ArithmeticMean(2, -4), -1);
    CHECK_EQ(ArithmeticMean(3, -9), -3);
    CHECK_EQ(ArithmeticMean(4, -16), -6);
  }
  SUBCASE("negative value and positive value") {
    CHECK_EQ(ArithmeticMean(-1, 1), 0);
    CHECK_EQ(ArithmeticMean(-2, 4), 1);
    CHECK_EQ(ArithmeticMean(-3, 9), 3);
    CHECK_EQ(ArithmeticMean(-4, 16), 6);
  }
  SUBCASE("negative value and negative value") {
    CHECK_EQ(ArithmeticMean(-1, -1), -1);
    CHECK_EQ(ArithmeticMean(-2, -4), -3);
    CHECK_EQ(ArithmeticMean(-3, -9), -6);
    CHECK_EQ(ArithmeticMean(-4, -16), -10);
  }
  SUBCASE("zero") {
    CHECK_EQ(ArithmeticMean(0, 0), 0);
    CHECK_EQ(ArithmeticMean(0, 2), 1);
    CHECK_EQ(ArithmeticMean(0, -2), -1);
    CHECK_EQ(ArithmeticMean(2, 0), 1);
    CHECK_EQ(ArithmeticMean(-2, 0), -1);
  }
  SUBCASE("near limits") {
    constexpr auto kAlmostMax = 2147483647;
    constexpr auto kAlmostMin = -2147483647;
    {
      static_assert(std::numeric_limits<std::int32_t>::max() == kAlmostMax);
      static_assert(std::numeric_limits<std::int32_t>::min() == kAlmostMin - 1);
    }
    CHECK_EQ(ArithmeticMean(kAlmostMax, kAlmostMax - 2), kAlmostMax - 1);
    CHECK_EQ(ArithmeticMean(kAlmostMin, kAlmostMin + 2), kAlmostMin + 1);
    CHECK_EQ(ArithmeticMean(kAlmostMax, kAlmostMin), 0);
    CHECK_EQ(ArithmeticMean(kAlmostMin, kAlmostMax), 0);
  }
}
