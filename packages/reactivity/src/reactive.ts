import { mutableHandlers } from "./baseHandler";
export const reactiveMap = new WeakMap();

// reactive 对象标记
export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive"
}

export function reactive(target) {
    return createReactiveObject(target, reactiveMap, mutableHandlers);
}

function createReactiveObject(target, proxyMap, baseHandlers) {
    // 判断是否已经创建过
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }

    // 判断是不是 reactive 一个(已经reactive的对象)
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }

    const proxy = new Proxy(target, baseHandlers);

    // 把创建好的 proxy 给存起来，
    proxyMap.set(target, proxy);
    return proxy;
}