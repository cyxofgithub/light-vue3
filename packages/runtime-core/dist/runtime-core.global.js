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
    h: () => h,
    render: () => render
  });

  // packages/runtime-core/src/vnode.ts
  function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
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

  // packages/runtime-core/src/renderer.ts
  function hostCreateElement(type) {
    const element = document.createElement(type);
    return element;
  }
  function hostSetElementText(el, text) {
    el.textContent = text;
  }
  function hostInsert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor);
  }
  function hostPatchProp(el, key, preValue, nextValue) {
    if (nextValue === null || nextValue === "") {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
  function hostRemove(child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  }
  function unmount(vnode) {
    hostRemove(vnode.el);
  }
  var render = (vnode, container) => {
    if (vnode === null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
    }
    container._vnode = vnode;
  };
  function patch(n1, n2, container = null, anchor = null) {
    if (n1 === n2)
      return;
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }
    const { type, shapeFlag } = n2;
    switch (type) {
      default:
        if (shapeFlag & 1 /* ELEMENT */) {
          processElement(n1, n2, container, anchor);
        }
    }
  }
  function processElement(n1, n2, container, anchor) {
    if (!n1) {
      mountElement(n2, container, anchor);
    } else {
      updateElement(n1, n2);
    }
  }
  function mountElement(vnode, container, anchor) {
    const { shapeFlag, props } = vnode;
    const el = vnode.el = hostCreateElement(vnode.type);
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(vnode.children, el);
    }
    if (props) {
      for (const key in props) {
        const nextVal = props[key];
        hostPatchProp(el, key, null, nextVal);
      }
    }
    hostInsert(el, container, anchor);
  }
  function mountChildren(children, container) {
    children.forEach((VNodeChild) => {
      patch(null, VNodeChild, container);
    });
  }
  function patchProps(oldProps, newPros, el) {
    for (let key in newPros) {
      hostPatchProp(el, key, oldProps, newPros[key]);
    }
    for (let key in oldProps) {
      if (newPros[key] === null) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }
  function patchKeyedChildren(c1, c2, container) {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const prevChild = c1[i];
      const nextChild = c2[i];
      if (!isSameVnode(prevChild, nextChild)) {
        break;
      }
      patch(prevChild, nextChild, container);
      i++;
    }
    while (i <= e1 && i <= e2) {
      const prevChild = c1[e1];
      const nextChild = c2[e2];
      if (!isSameVnode(prevChild, nextChild)) {
        break;
      }
      patch(prevChild, nextChild, container);
      e1--;
      e2--;
    }
    if (i > e1 && i <= e2) {
      const nextPos = e2 + 1;
      const anchor = nextPos < l2 ? c2[nextPos].el : null;
      while (i <= e2) {
        patch(null, c2[i], container, anchor);
        i++;
      }
    } else if (i > e2 && i <= e1) {
      while (i <= e1) {
        console.log(`\u9700\u8981\u5220\u9664\u5F53\u524D\u7684 vnode: ${c1[i].key}`);
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      let s1 = i;
      let s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (let i2 = s2; i2 <= e2; i2++) {
        const nextChild = c2[i2];
        keyToNewIndexMap.set(nextChild.key, i2);
      }
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0);
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (let j2 = s2; j2 <= e2; j2++) {
            if (isSameVnode(prevChild, c2[j2])) {
              newIndex = j2;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          hostRemove(prevChild.el);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(prevChild, c2[newIndex], container, null);
          patched++;
        }
      }
      let increment = getSequence(newIndexToOldIndexMap);
      let j = increment.length - 1;
      console.log("increment---", increment);
      for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
        let index = i2 + s2;
        let current = c2[index];
        let anchor = index + 1 < c2.length ? c2[index + 1].el : null;
        if (newIndexToOldIndexMap[i2] === 0) {
          patch(null, current, container, anchor);
        } else {
          if (i2 != increment[j]) {
            hostInsert(current.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }
  function updateElement(n1, n2) {
    let el = n2.el = n1.el;
    let oldProps = n1.props || {};
    let newPros = n2.props || {};
    patchProps(oldProps, newPros, el);
    patchChildren(n1, n2, el);
  }
  function patchChildren(n1, n2, container) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag, children: c2 } = n2;
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          patchKeyedChildren(c1, c2, container);
        }
      }
    }
  }
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-core.global.js.map
