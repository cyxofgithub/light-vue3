import { ShapeFlags } from "../../shared/src/shapeFlags";
import { isSameVnode } from './vnode'

function hostCreateElement(type) {
    const element = document.createElement(type);
    return element;
}

function hostSetElementText(el, text) {
    el.textContent = text
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
    hostRemove(vnode.el)
}

export const render = (vnode, container) => {


    if (vnode === null) {
        // 卸载逻辑
        if (container._vnode) {
            unmount(container._vnode)
        }
    } else {
        // 初始渲染，更新逻辑
        patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
}

function patch(n1, n2, container = null, anchor = null) {
    if (n1 === n2) return; // 完全相同无需比对

    // 处理不是相同节点的情况
    if (n1 && !isSameVnode(n1, n2)) {
        unmount(n1) // 删除 n1
        n1 = null // n1 等于 null 就直接挂载 n2 上去
    }

    const { type, shapeFlag } = n2

    switch (type) {
        default:
            if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(n1, n2, container, anchor)
            }
    }
}

function processElement(n1, n2, container, anchor) {
    if (!n1) {
        mountElement(n2, container, anchor) // 初次渲染,直接挂载
    } else {
        updateElement(n1, n2) // 相同节点比对
    }
}

function mountElement(vnode, container, anchor) {
    const { shapeFlag, props } = vnode

    // 创建 element
    const el = (vnode.el = hostCreateElement(vnode.type));

    // 处理文本节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, vnode.children);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) { // 处理嵌套节点
        mountChildren(vnode.children, el);
    }

    // 处理 props
    if (props) {
        for (const key in props) {
            // todo
            // 需要过滤掉vue自身用的key
            // 比如生命周期相关的 key: beforeMount、mounted
            const nextVal = props[key];
            hostPatchProp(el, key, null, nextVal);
        }
    }

    // 插入
    hostInsert(el, container, anchor);

}

function mountChildren(children, container) {
    children.forEach((VNodeChild) => {
        patch(null, VNodeChild, container);
    });
}

function patchProps(oldProps, newPros, el) {
    for (let key in newPros) {
        hostPatchProp(el, key, oldProps, newPros[key]) // 新的直接覆盖就行
    }
    for (let key in oldProps) {
        if (newPros[key] === null) { // 旧属性删除
            hostPatchProp(el, key, oldProps[key], null)
        }
    }
}

function patchKeyedChildren(c1, c2, container) {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    // 优化：把前面相同的节点先处理掉
    while (i <= e1 && i <= e2) {
        const prevChild = c1[i];
        const nextChild = c2[i];

        if (!isSameVnode(prevChild, nextChild)) {
            break;
        }

        patch(prevChild, nextChild, container);
        i++;
    }

    // 优化：把后面相同的节点先处理掉
    while (i <= e1 && i <= e2) {
        // 从右向左取值
        const prevChild = c1[e1];
        const- nextChild = c2[e2];

        if (!isSameVnode(prevChild, nextChild)) {
            break;
        }
        patch(prevChild, nextChild, container);
        e1--;
        e2--;
    }

    // 通过 i，e1，e2，确定出现的新节点，或被删除的节点
    // 节点新增
    if (i > e1 && i <= e2) {
        const nextPos = e2 + 1; // e2 有移动说明是往前面插入
        const anchor = nextPos < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
            patch(null, c2[i], container, anchor);
            i++;
        }
    } else if (i > e2 && i <= e1) {
        // 这种情况的话说明新节点的数量是小于旧节点的数量的
        // 那么我们就需要把多余的删除
        while (i <= e1) {
            console.log(`需要删除当前的 vnode: ${c1[i].key}`);
            hostRemove(c1[i].el);
            i++;
        }
    } else {
        // 左右两边比对完了，中间部分可能发生了乱序或者增删
        // 这里要做的其实是调换位置或者增删节点

        let s1 = i;
        let s2 = i;
        const keyToNewIndexMap = new Map(); // 建立新节点key与当前位置的映射
        for (let i = s2; i <= e2; i++) {
            const nextChild = c2[i];
            keyToNewIndexMap.set(nextChild.key, i);
        }

        let patched = 0;
        // 需要处理新节点的数量
        const toBePatched = e2 - s2 + 1;

        // 建立新的节点位置和旧节点位置的映射关系
        const newIndexToOldIndexMap = new Array(toBePatched).fill(0);

        // 遍历老节点
        // 1. 需要找出老节点有，而新节点没有的 -> 需要把这个节点删除掉
        // 2. 新老节点都有的，—> 需要 patch
        for (i = s1; i <= e1; i++) {
            const prevChild = c1[i];

            // 在比对完新节点后，如果老的节点仍有剩余，那么这里老节点直接删除即可
            if (patched >= toBePatched) {
                hostRemove(prevChild.el);
                continue;
            }

            let newIndex;
            if (prevChild.key != null) {
                // 这里就可以通过key快速的查找了， 看看在新的里面这个节点存在不存在
                newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
                // 如果没key 的话，那么只能是遍历所有的新节点来确定当前节点存在不存在了
                // 时间复杂度O(n)
                for (let j = s2; j <= e2; j++) {
                    if (isSameVnode(prevChild, c2[j])) {
                        newIndex = j;
                        break;
                    }
                }
            }

            // 因为有可能 nextIndex 的值为0（0也是正常值）
            // 所以需要通过值是不是 undefined 或者 null 来判断
            if (newIndex === undefined) {
                // 当前节点的key 不存在于 newChildren 中，需要把当前节点给删除掉
                hostRemove(prevChild.el);
            } else {
                // 新老节点都存在
                // 把新节点的索引和老的节点的索引建立映射关系
                // i + 1 是因为我们把 0 认为是新节点，在下面判断中值为 0 时会创建新节点
                newIndexToOldIndexMap[newIndex - s2] = i + 1;

                patch(prevChild, c2[newIndex], container, null); // 这里只能修改 props 和值的变化，并不能处理位置的变化
                patched++;
            }
        }

        // 获取最长递增子序列
        let increment = getSequence(newIndexToOldIndexMap)
        let j = increment.length - 1
        console.log('increment---', increment);
        

        // 处理需要移动的位置
        // 从后开始处理，从后往前插入(node.insertBefore)
        for (let i = toBePatched - 1; i >= 0; i--) {
            let index = i + s2
            let current = c2[index]
            let anchor = index + 1 < c2.length ? c2[index + 1].el : null;
            if (newIndexToOldIndexMap[i] === 0) { // 没有映射关系说明是新节点，直接创建
                patch(null, current, container, anchor)
            } else { // 需要移动位置的节点
                if (i != increment[j]) {
                    hostInsert(current.el, container, anchor)
                } else {
                    j--
                }
            }
        }

    }
}

function updateElement(n1, n2) {
    let el = n2.el = n1.el // n2 复用 n1 节点

    let oldProps = n1.props || {};
    let newPros = n2.props || {};
    patchProps(oldProps, newPros, el); // 对比 props
    patchChildren(n1, n2, el); // 对比 children
}

function patchChildren(n1, n2, container) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag, children: c2 } = n2;

    // 为了方便理解：这只处理文本和文本比对和孩子节点和孩子节点比对的情况
    // 没写的情况：文本比数组，文本比空，数组比文本，数组比空
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {

        if (c2 !== c1) {
            hostSetElementText(container, c2 as string);
        }
    }
    else {
        // 比对都有孩子节点的情况
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                patchKeyedChildren(c1, c2, container);
            }
        }
    }
}

function getSequence(arr: number[]): number[] {
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
                c = (u + v) >> 1;
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
