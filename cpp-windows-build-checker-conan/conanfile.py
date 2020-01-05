from conans import ConanFile, CMake, tools


def to_cmake_generator(compiler, arch) -> str:
    assert compiler == "Visual Studio"

    if compiler.version == "11":
        if arch == "x86":
            return "Visual Studio 11 2012"
    elif compiler.version == "14":
        if arch == "x86":
            return "Visual Studio 14 2015"
        elif arch == "x86_64":
            return "Visual Studio 14 2015 Win64"

    assert False


class MiscConan(ConanFile):
    name = 'misc'
    version = '1.0.0'
    license = 'MIT'
    url = 'https://github.com/km45/misc/archive/master.zip'
    description = 'misc'
    settings = 'os', 'arch', 'compiler', 'build_type'

    def source(self):
        tools.download(self.url, 'master.zip')
        tools.unzip('master.zip')

    def build(self):
        cmake = CMake(self, build_type='Release')
        cmake.configure(
            args=[
                f"-G{to_cmake_generator(self.settings.compiler,self.settings.arch)}"],
            source_folder=f'{self.source_folder}/misc-master/cpp-windows-build-checker')

        if self.settings.os == "Windows":
            # https://stackoverflow.com/a/20423820
            cmake.build(args=["--config", "Release"])
        else:
            cmake.build()

    def package(self):
        self.copy("*", src="Release", dst="bin")
