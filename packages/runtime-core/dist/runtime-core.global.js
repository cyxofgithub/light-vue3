var VueRuntimeCore = (() => {
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

  // packages/runtime-core/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    h: () => h
  });

  // packages/runtime-core/src/vnode.ts
  function createVNode(type, props, children) {
    const vnode = {
      el: null,
      component: null,
      key: props == null ? void 0 : props.key,
      type,
      props: props || {},
      children,
      shapeFlag: 1 /* ELEMENT */
    };
    if (Array.isArray(children)) {
      vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
    } else if (typeof children === "string") {
      vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
    }
    return vnode;
  }

  // packages/runtime-core/src/h.ts
  function h(type, props, children) {
    return createVNode(type, props, children);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-core.global.js.map
