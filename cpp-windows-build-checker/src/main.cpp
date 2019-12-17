#include <iostream>

#include <cassert>

static_assert(CHAR_BIT == 8, "Not support 1byte != 8bits");

#if _MSC_VER == 1700
#define VISUAL_STUDIO_VERSION 2012
#define VISUAL_C_PLUS_PLUS_VERSION 11.0
#elif _MSC_VER == 1900
#define VISUAL_STUDIO_VERSION 2015
#define VISUAL_C_PLUS_PLUS_VERSION 14.0
#else
#error "Current _MSC_VER is not supported."
#endif

int main() {
    // compiler version
    std::cout << "Visual Studio | " << VISUAL_STUDIO_VERSION << std::endl;
    std::cout << "Visual C++    | " << VISUAL_C_PLUS_PLUS_VERSION << std::endl;

    // 32bit or 64bit
    std::cout << "void*         | " << (CHAR_BIT * sizeof(void*)) << " bit" << std::endl;

#ifdef NDEBUG
    std::cout << "build mode    | release" << std::endl;
#else
    std::cout << "build mode    | debug" << std::endl;
#endif

    return 0;
}
