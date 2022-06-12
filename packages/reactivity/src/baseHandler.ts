import { ReactiveFlags } from "./reactive";
const get = createGetter();
const set = createSetter();

function createGetter() {
    return function get(target, key, receiver) {

        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }

        // 问题：为什么使用 Reflect.get 去获取值呢
        // receiver 参数可以改变 target 的指向，它让 target 指向当前调用getter的对象
        // 这对于发生了继承的情况，可以明确调用主体
        // 例如：const a = { name: 'ZHANG', get alias() { return this.name } } 
        // proxyA.alias 我们希望它的 this 指向不是本身而是代理对象就可以使用 Reflect.get(proxyA, alias, receiver)
        const res = Reflect.get(target, key, receiver);

        return res;
    };
}

function createSetter() {
    return function set(target, key, value, receiver) {
        // 问题：为什么使用 Reflect.set 去设置值呢
        // 当我们set的key如果是undefined的情况它并不会报TypeError导致后面的代码无法执行
        // 而是返回 false 这可以保证代码的健壮性
        return Reflect.set(target, key, value, receiver);
    };
}

export const mutableHandlers = {
    get,
    set,
};