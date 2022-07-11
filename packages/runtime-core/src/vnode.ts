import { ShapeFlags } from "packages/shared/src/shapeFlags";

export function isSameVnode(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key
}

export function createVNode(type, props?, children?) {
    const vnode = {
        el: null,
        component: null,
        key: props?.key,
        type,
        props: props || {},
        children,
        shapeFlag: ShapeFlags.ELEMENT,
    };

    // 基于 children 再次设置 shapeFlag
    if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN; // 嵌套节点
    } else if (typeof children === "string") {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN; // 文件节点
    }

    return vnode
}