CONFIG := debug

.PHONY: default
default:
	@false

.PHONY: build
build: cmake
	cmake --build build/msvc2012/win32 --config $(CONFIG)
	cmake --build build/msvc2012/win64 --config $(CONFIG)
	cmake --build build/msvc2015/win32 --config $(CONFIG)
	cmake --build build/msvc2015/win64 --config $(CONFIG)

.PHONY: clean
clean:
	rm -rf build

.PHONY: cmake
cmake:
	mkdir -p build/msvc2012/win32 && cd build/msvc2012/win32 && cmake -G"Visual Studio 11 2012" ../../..
	mkdir -p build/msvc2012/win64 && cd build/msvc2012/win64 && cmake -G"Visual Studio 11 2012 Win64" ../../..
	mkdir -p build/msvc2015/win32 && cd build/msvc2015/win32 && cmake -G"Visual Studio 14 2015" ../../..
	mkdir -p build/msvc2015/win64 && cd build/msvc2015/win64 && cmake -G"Visual Studio 14 2015 Win64" ../../..

.PHONY: run
run:
	./build/msvc2012/win32/$(CONFIG)/cpp_windows_build_checker.exe || true
	./build/msvc2012/win64/$(CONFIG)/cpp_windows_build_checker.exe || true
	./build/msvc2015/win32/$(CONFIG)/cpp_windows_build_checker.exe || true
	./build/msvc2015/win64/$(CONFIG)/cpp_windows_build_checker.exe || true
