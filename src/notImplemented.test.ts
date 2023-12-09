import { notImplemented } from "./notImplemented";

describe("notImplemented", () => {
  it("should throw an error", () => {
    expect(notImplemented).toThrow("not implemented");
  });
});
