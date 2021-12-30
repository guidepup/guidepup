import { sendKeys } from "../sendKeys";
import { Modifiers } from "../Modifiers";

export async function start(): Promise<string> {
  return await sendKeys({
    characters: "n",
    modifiers: [Modifiers.CONTROL, Modifiers.ALT],
  });
}
