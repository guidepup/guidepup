import { withTransaction } from "./withTransaction";

const script = "test-script";

describe("withTransaction.test.js", () => {
  it("should start with a newline to ensure the transaction statement doesn't invalidate additional script wrappers", () => {
    expect(withTransaction(script).startsWith("\n")).toBeTruthy();
  });

  it("should end with a newline to ensure the transaction statement doesn't invalidate additional script wrappers", () => {
    expect(withTransaction(script).endsWith("\n")).toBeTruthy();
  });

  it("should place a newline following the 'with transaction' statement to ensure it does not invalidate the script", () => {
    expect(withTransaction(script)).toMatch(/with transaction\n/);
  });

  it("should place a newline preceding the 'end transaction' statement to ensure it does not invalidate the script", () => {
    expect(withTransaction(script)).toMatch(/\nend transaction/);
  });

  it("should wrap a script string in a 'with transaction' statement", () => {
    expect(withTransaction(script)).toEqual(
      `\nwith transaction\n${script}\nend transaction\n`
    );
  });

  it("should wrap an empty string in a 'with transaction' statement", () => {
    expect(withTransaction("")).toEqual(
      `\nwith transaction\n\nend transaction\n`
    );
  });
});
