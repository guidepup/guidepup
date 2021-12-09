export interface KeyCodeCommand {
  keyCode: number | number[];
  modifiers?: string[];
  description?: string;
  gesture?: string;
}
