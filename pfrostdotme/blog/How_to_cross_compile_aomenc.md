18 October 2020

# Cross compiling aomenc for Windows on Linux

Install the 64-bit mingw (Minimal GNU for Windows) gcc-toolchain:
```bash
sudo apt install git build-essential make mingw-w64 nasm yasm cmake
```

Download the source:
```bash
git clone https://aomedia.googlesource.com/aom
```

Configure:
```bash
cd aom/build
cmake ../ -DCMAKE_TOOLCHAIN_FILE=cmake/toolchains/x86_64-mingw-gcc.cmake -DCMAKE_BUILD_TYPE=Release -DAOM_EXTRA_C_FLAGS=-static -DAOM_EXTRA_CXX_FLAGS=-static -DENABLE_DOCS=0 -DENABLE_TESTS=0 -DCONFIG_AV1_DECODER=0
```

This command uses CMake to generate a Makefile that will use the x86\_64-mingw-gcc toolchain. We specify a release build (rather than a debug build), and we want to statically link any libraries rather than dynamically link them in at runtime to avoid errors like "libgcc\_s\_seh-1.dll not found" when we run it in Windows. We also disable some things we don't need like the documentation, self-tests, and the decoder.

Compile:
```bash
make -j$(nproc)
```

Done! You should now have your AV1 encoder executables in the build directory:
```bash
ls -al *.exe
-rwxrwxrwx 1 frost frost 11553153 Oct 18 17:13 aomenc.exe
```