// hello.cc
#include <node.h>
#include<iostream>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    char s[100];
    std::cin.getline(s, 100);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, s));
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "readline", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo