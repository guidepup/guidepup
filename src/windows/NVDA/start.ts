import { sendKeys } from "../sendKeys";
import { Modifiers } from "../Modifiers";

export async function start(): Promise<void> {
  return await sendKeys({
    characters: "n",
    modifiers: [Modifiers.CONTROL, Modifiers.ALT],
  });
}
