.PHONY: all
all: msvc2012_32bit msvc2015_32bit msvc2015_64bit

.PHONY: msvc2012_32bit
msvc2012_32bit:
	conan create . -s build_type=Release --profile ./msvc2012_32bit.profile

.PHONY: msvc2015_32bit
msvc2015_32bit:
	conan create . -s build_type=Release --profile ./msvc2015_32bit.profile

.PHONY: msvc2015_64bit
msvc2015_64bit:
	conan create . -s build_type=Release --profile ./msvc2015_64bit.profile
