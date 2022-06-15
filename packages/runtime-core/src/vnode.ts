import { ShapeFlags } from "packages/shared/src/shapeFlags";
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