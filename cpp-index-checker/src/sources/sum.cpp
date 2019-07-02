#include "cic/sum.hpp"

#include <iostream>
#include <string>

namespace {

template <typename T>
T SumImpl(const std::string &name, const T l, const T r) {
    std::cout << "Called: " << name << " sum(" << name << ", " << name << ")"
              << std::endl;
    return l + r;
}

}  // namespace

namespace cic {

char Sum(char l, char r) { return SumImpl("char", l, r); }
int Sum(int l, int r) { return SumImpl("int", l, r); }
float Sum(float l, float r) { return SumImpl("float", l, r); }
double Sum(double l, double r) { return SumImpl("double", l, r); }

}  // namespace cic
