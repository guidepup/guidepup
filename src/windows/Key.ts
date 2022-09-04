export class Key {
  keyCode: number;
  scanCode: number;
  extended: boolean;
  symbol: string;

  constructor({
    keyCode,
    scanCode,
    extended,
    symbol,
  }: {
    keyCode?: number;
    scanCode?: number;
    extended?: boolean;
    symbol: string;
  }) {
    this.keyCode = keyCode;
    this.scanCode = scanCode;
    this.extended = extended;
    this.symbol = symbol;
  }

  toJSON(down: boolean) {
    return {
      scan_code: this.scanCode,
      extended: this.extended ? "true" : "false",
      vk_code: this.keyCode,
      pressed: down ? "true" : "false",
      type: "key",
    };
  }

  toString(down: boolean) {
    return JSON.stringify(this.toJSON(down));
  }
}
