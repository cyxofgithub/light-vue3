import { reactive } from "../src/reactive";
import { effect } from "../src/effect";

describe("effect", () => {
  it("初始化时就会调用一次回调", () => {
    const fnSpy = jest.fn(() => {});
    effect(fnSpy);
    expect(fnSpy).toHaveBeenCalledTimes(1);
  });

  it("可以收集并触发依赖", () => {
    let dummy;
    const counter = reactive({ num: 0 });
    effect(() => (dummy = counter.num));

    expect(dummy).toBe(0);
    counter.num = 7;
    expect(dummy).toBe(7);
  });
});
