import { notImplemented } from "./notImplemented";

describe("notImplemented", () => {
  it("should throw an error", () => {
    expect(notImplemented).toThrowError("not implemented");
  });
});
