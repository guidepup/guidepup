import { delay } from "../../../../src/delay";
import { expect } from "@playwright/test";
import { log } from "../../../log";
import { orcaTest as test } from "../../orca-test";

// These tests drive the page only with real keyboard input, the way a person
// would, so Orca hears every key press rather than Playwright's injected events.
// Like a person, they listen until Orca has finished speaking (capture: true)
// before checking what was said.
test.describe("Firefox Playwright Orca keyboard", () => {
  test.beforeEach(async ({ page, orca }) => {
    await page.setContent(`
      <title>Keyboard example</title>
      <main>
        <h1>Keyboard example</h1>
        <button id="update">Update</button>
        <button id="other">Other</button>
        <label for="name">Name</label>
        <input id="name" type="text" />
      </main>

      <div aria-live="assertive" id="live"></div>

      <script>
        document.querySelector("#update").addEventListener("click", () => {
          document.querySelector("#live").textContent = "testing testing 123";
        });
      </script>
    `);

    await page.locator("#update").waitFor();
    await delay(500);

    await orca.navigateToWebContent();
  });

  test("I can Tab to a button and hear a live region after pressing Enter", async ({
    page,
    orca,
  }) => {
    log(`Performing command: "Tab"`);
    await orca.press("Tab", { capture: true });
    const tabPhrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${tabPhrase}".`);

    expect(tabPhrase).toContain("Update");
    expect(tabPhrase).toContain("button");
    await expect(page.locator("#update")).toBeFocused();

    log(`Performing command: "Enter"`);
    await orca.press("Enter", { capture: true });
    const enterPhrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${enterPhrase}".`);

    expect(enterPhrase).toContain("testing testing 123");
  });

  test("I can move back with Shift+Tab", async ({ page, orca }) => {
    await orca.press("Tab");
    await orca.press("Tab");
    await expect(page.locator("#other")).toBeFocused();

    log(`Performing command: "Shift+Tab"`);
    await orca.press("Shift+Tab", { capture: true });
    const phrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${phrase}".`);

    expect(phrase).toContain("Update");
    await expect(page.locator("#update")).toBeFocused();
  });

  test("I can type into a text field", async ({ page, orca }) => {
    await orca.press("Tab");
    await orca.press("Tab");

    log(`Performing command: "Tab"`);
    await orca.press("Tab", { capture: true });
    const phrase = await orca.lastSpokenPhrase();
    log(`Screen reader output: "${phrase}".`);

    expect(phrase).toContain("Name");
    await expect(page.locator("#name")).toBeFocused();

    log(`Performing command: type "hello"`);
    await orca.type("hello");

    await expect(page.locator("#name")).toHaveValue("hello");
  });
});
