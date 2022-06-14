let activeEffect = undefined
const dep = new WeakMap()

// 收集依赖
export function track(target, key) {
    console.log('收集依赖',target, key);

    if (!activeEffect) return; 

    if (!dep.has(target)) {
        dep.set(target, new Map())
    }

    const targetDep = dep.get(target)

    if (!targetDep.has(key)) {
        targetDep.set(key, new Set())
    }

    const keyDep = targetDep.get(key)
    
    keyDep.add(activeEffect)
    activeEffect = undefined

    console.log(dep);
    
}

// 触发依赖
export function trigger(target, key) {
    console.log('触发依赖',target, key);

    const targetDep = dep.get(target)
    const keyDep = targetDep.get(key)
    console.log(keyDep);
    
    keyDep.forEach(item => {
        console.log(item);
        
        item()
    })
    
}

export function effect(fn) {
    activeEffect = fn
    fn()
}