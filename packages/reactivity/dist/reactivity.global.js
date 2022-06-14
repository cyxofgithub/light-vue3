var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var dep = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    console.log("\u6536\u96C6\u4F9D\u8D56", target, key);
    if (!activeEffect)
      return;
    if (!dep.has(target)) {
      dep.set(target, /* @__PURE__ */ new Map());
    }
    const targetDep = dep.get(target);
    if (!targetDep.has(key)) {
      targetDep.set(key, /* @__PURE__ */ new Set());
    }
    const keyDep = targetDep.get(key);
    keyDep.add(activeEffect);
    activeEffect = void 0;
    console.log(dep);
  }
  function trigger(target, key) {
    console.log("\u89E6\u53D1\u4F9D\u8D56", target, key);
    const targetDep = dep.get(target);
    const keyDep = targetDep.get(key);
    console.log(keyDep);
    keyDep.forEach((item) => {
      console.log(item);
      item();
    });
  }
  function effect(fn) {
    activeEffect = fn;
    fn();
  }

  // packages/reactivity/src/baseHandler.ts
  var get = createGetter();
  var set = createSetter();
  function createGetter() {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      return res;
    };
  }
  function createSetter() {
    return function set2(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    };
  }
  var mutableHandlers = {
    get,
    set
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
  }
  function createReactiveObject(target, proxyMap, baseHandlers) {
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
