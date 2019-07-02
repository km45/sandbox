#ifndef CIC_FIBONACCHI_HPP_
#define CIC_FIBONACCHI_HPP_

namespace cic {

template <int N>
inline int Fibonacchi() {
    return Fibonacchi<N - 1>() + Fibonacchi<N - 2>();
}

template <>
inline int Fibonacchi<0>() {
    return 0;
}

template <>
inline int Fibonacchi<1>() {
    return 1;
}

}  // namespace cic

#endif  // CIC_FIBONACCHI_HPP_
