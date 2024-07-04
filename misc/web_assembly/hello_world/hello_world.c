#include "emscripten.h"

EMSCRIPTEN_KEEPALIVE
const char* helloWorld() {
  return "hello world\n";
}
