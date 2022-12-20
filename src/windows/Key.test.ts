import { Key } from "./Key";

const mockKeyCode = 123456;
const mockScanCode = 654321;
const mockExtended = true;
const mockSymbol = "test-symbol";

describe("Key", () => {
  it("should expose the provided keyCode value", () => {
    expect(new Key({ keyCode: mockKeyCode }).keyCode).toBe(mockKeyCode);
  });

  it("should expose the provided scanCode value", () => {
    expect(new Key({ scanCode: mockScanCode }).scanCode).toBe(mockScanCode);
  });

  it("should expose the provided extended value", () => {
    expect(new Key({ extended: true }).extended).toBe(true);
    expect(new Key({ extended: false }).extended).toBe(false);
  });

  it("should expose the provided symbol value", () => {
    expect(new Key({ symbol: mockSymbol }).symbol).toBe(mockSymbol);
  });

  it("should convert the key to a NVDA JSON representation with .toJSON()", () => {
    expect(
      new Key({
        keyCode: mockKeyCode,
        scanCode: mockScanCode,
        extended: mockExtended,
        symbol: mockSymbol,
      }).toJSON(true)
    ).toStrictEqual({
      scan_code: mockScanCode,
      extended: mockExtended,
      vk_code: mockKeyCode,
      pressed: true,
      type: "key",
    });

    expect(
      new Key({
        keyCode: mockKeyCode,
        scanCode: mockScanCode,
        extended: mockExtended,
        symbol: mockSymbol,
      }).toJSON(false)
    ).toStrictEqual({
      scan_code: mockScanCode,
      extended: mockExtended,
      vk_code: mockKeyCode,
      pressed: false,
      type: "key",
    });
  });

  it("should convert the key to a NVDA string representation with .toString()", () => {
    expect(
      new Key({
        keyCode: mockKeyCode,
        scanCode: mockScanCode,
        extended: mockExtended,
        symbol: mockSymbol,
      }).toString(true)
    ).toStrictEqual(
      JSON.stringify({
        scan_code: mockScanCode,
        extended: mockExtended,
        vk_code: mockKeyCode,
        pressed: true,
        type: "key",
      })
    );

    expect(
      new Key({
        keyCode: mockKeyCode,
        scanCode: mockScanCode,
        extended: mockExtended,
        symbol: mockSymbol,
      }).toString(false)
    ).toStrictEqual(
      JSON.stringify({
        scan_code: mockScanCode,
        extended: mockExtended,
        vk_code: mockKeyCode,
        pressed: false,
        type: "key",
      })
    );
  });
});
