import { decorateStaticImplements } from "./decorateStaticImplements";

interface IConstructor {
  method(): void;
}

interface IConstructorWithStatic {
  new (): IConstructor;

  staticMethod(): void;
}

class Constructor {
  method() {
    return;
  }

  static staticMethod() {
    return;
  }
}

describe("decorateStaticImplements", () => {
  it("should return a function", () => {
    expect(decorateStaticImplements<IConstructorWithStatic>()).toBeInstanceOf(
      Function
    );
  });

  describe("when the returned function is invoked with a constructor", () => {
    it("should not throw", () => {
      expect(() =>
        decorateStaticImplements<IConstructorWithStatic>()(Constructor)
      ).not.toThrow();
    });
  });
});
