#include <iostream>

#include "cic/fibonacchi.hpp"
#include "cic/sum.hpp"

void Fibonacchi() {
    constexpr const int kNumber0 = 0;
    constexpr const int kNumber1 = 1;
    constexpr const int kNumber20 = 20;
    std::cout << cic::Fibonacchi<kNumber0>() << std::endl;
    std::cout << cic::Fibonacchi<kNumber1>() << std::endl;
    std::cout << cic::Fibonacchi<kNumber20>() << std::endl;
}

void Sum() {
    std::cout << cic::Sum(1, 2) << std::endl;
    std::cout << cic::Sum(1, 3) << std::endl;
    std::cout << cic::Sum(1.2, 3.4) << std::endl;
    std::cout << cic::Sum(1.2f, 3.4f) << std::endl;
}

int main() {
    Fibonacchi();
    Sum();
    return 0;
}
