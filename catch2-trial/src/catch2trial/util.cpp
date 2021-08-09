#include "catch2trial/util.hpp"

#include <numeric>

namespace catch2trial {

std::int32_t ArithmeticMean(std::int32_t a, std::int32_t b) {
  return std::midpoint(a, b);
}

}  // namespace catch2trial
