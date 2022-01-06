// This file was automatically generated.
// Manual changes will not be preserved.

import type { CommandOptions } from "../../options";
import { VoiceOverBase } from "./VoiceOverBase";
import { keyCodeCommands } from "./keyCodeCommands";
import { CommanderCommands } from "./CommanderCommands";

/**
 * Class for controlling the VoiceOver ScreenReader on MacOS.
 */
export class VoiceOver extends VoiceOverBase {
  /**
   * Lock and unlock the VO (Control and Option) keys
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-;
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleLock(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleLock, options);
  }

  /**
   * Open VoiceOver Utility
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F8
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenVoiceOverUtility(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openVoiceOverUtility, options);
  }

  /**
   * Open the VoiceOver Help menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-H
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenVoiceOverHelpMenu(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openVoiceOverHelpMenu, options);
  }

  /**
   * Open the VoiceOver Quick Start
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F8
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenVoiceOverQuickStart(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openVoiceOverQuickStart, options);
  }

  /**
   * Open VoiceOver online help
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-/
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenVoiceOverOnlineHelp(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openVoiceOverOnlineHelp, options);
  }

  /**
   * Start keyboard help
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-K
   *
   * @param {object} [options] Additional options.
   */
  async commandStartKeyboardHelp(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.startKeyboardHelp, options);
  }

  /**
   * Hear a description of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-N
   *
   * @param {object} [options] Additional options.
   */
  async commandHearItemDescription(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.hearItemDescription, options);
  }

  /**
   * Open the Commands menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-H-H
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenCommandsMenu(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openCommandsMenu, options);
  }

  /**
   * Open the Find menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenFindMenu(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openFindMenu, options);
  }

  /**
   * Close a menu or rotor, stop an action, or exit a mode
   *
   * Uses VoiceOver keycode command
   *
   * Representation: Escape
   *
   * @param {object} [options] Additional options.
   */
  async commandStopAction(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.stopAction, options);
  }

  /**
   * Tell VoiceOver to ignore the next key combination you press
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Tab
   *
   * @param {object} [options] Additional options.
   */
  async commandIgnoreNextKeyCombination(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.ignoreNextKeyCombination, options);
  }

  /**
   * Open the verbosity rotor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-V
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenVerbosityRotor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openVerbosityRotor, options);
  }

  /**
   * Magnify the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-}
   *
   * @param {object} [options] Additional options.
   */
  async commandMagnifyItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.magnifyItem, options);
  }

  /**
   * Shrink the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-{
   *
   * @param {object} [options] Additional options.
   */
  async commandShrinkItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.shrinkItem, options);
  }

  /**
   * Temporarily hide or show the VoiceOver cursor and the caption or braille panels
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F11
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleVoiceOverCursorAndPanels(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleVoiceOverCursorAndPanels, options);
  }

  /**
   * Hide or show the caption panel only
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F10
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleCaptionPanel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleCaptionPanel, options);
  }

  /**
   * Resize or move the caption panel
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F10
   *
   * @param {object} [options] Additional options.
   */
  async commandResizeOrMoveCaptionPanel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.resizeOrMoveCaptionPanel, options);
  }

  /**
   * Hide or show the braille panel only
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F9
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleBraillePanel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleBraillePanel, options);
  }

  /**
   * Resize or move the braille panel
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F9
   *
   * @param {object} [options] Additional options.
   */
  async commandResizeOrMoveBraillePanel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.resizeOrMoveBraillePanel, options);
  }

  /**
   * Tile visuals (dim the screen, highlight the caption or braille panel, and show the item in the VoiceOver cursor in the center of the screen).
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F10
   *
   * @param {object} [options] Additional options.
   */
  async commandTileVisuals(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.tileVisuals, options);
  }

  /**
   * Enable or disable the Keyboard Commander
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-K
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleKeyboardCommander(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleKeyboardCommander, options);
  }

  /**
   * Turn the screen black (screen curtain)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F11
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleScreenCurtain(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleScreenCurtain, options);
  }

  /**
   * Cycle through speech settings (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandCycleRightThroughSpeechSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.cycleRightThroughSpeechSettings, options);
  }

  /**
   * Cycle through speech settings (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandCycleLeftThroughSpeechSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.cycleLeftThroughSpeechSettings, options);
  }

  /**
   * Change the current speech setting (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandChangeUpCurrentSpeechSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.changeUpCurrentSpeechSettings, options);
  }

  /**
   * Change the current speech setting (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandChangeDownCurrentSpeechSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.changeDownCurrentSpeechSettings, options);
  }

  /**
   * Press and release mouse button
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Space bar
   *
   * @param {object} [options] Additional options.
   */
  async commandPressAndReleaseMouse(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.pressAndReleaseMouse, options);
  }

  /**
   * Interact with an item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandInteractWithItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.interactWithItem, options);
  }

  /**
   * Stop interacting with an item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandStopInteractingWithItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.stopInteractingWithItem, options);
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Space bar
   *
   * @param {object} [options] Additional options.
   */
  async commandPerformDefaultActionForItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.performDefaultActionForItem, options);
  }

  /**
   * Select a menu or list item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Return
   *
   * @param {object} [options] Additional options.
   */
  async commandSelectItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.selectItem, options);
  }

  /**
   * Select multiple items
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Space bar
   *
   * @param {object} [options] Additional options.
   */
  async commandSelectMultipleItems(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.selectMultipleItems, options);
  }

  /**
   * Perform a sticky mouse down or mouse up (for use when dragging an item from one location to drop in another location)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Space bar
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleStickyMouse(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleStickyMouse, options);
  }

  /**
   * Click the item under the mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Space bar-Space bar
   *
   * @param {object} [options] Additional options.
   */
  async commandDoubleClick(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.doubleClick, options);
  }

  /**
   * Open or close a disclosure triangle
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-\
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleDisclosureTriangle(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleDisclosureTriangle, options);
  }

  /**
   * Read a row in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-R
   *
   * @param {object} [options] Additional options.
   */
  async commandReadTableRow(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readTableRow, options);
  }

  /**
   * Read a column in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C-C
   *
   * @param {object} [options] Additional options.
   */
  async commandReadTableColumn(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readTableColumn, options);
  }

  /**
   * Read the column header in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C
   *
   * @param {object} [options] Additional options.
   */
  async commandReadTableColumnHeader(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readTableColumnHeader, options);
  }

  /**
   * Read row and column numbers in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-T
   *
   * @param {object} [options] Additional options.
   */
  async commandReadTableRowAndColumnNumbers(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readTableRowAndColumnNumbers, options);
  }

  /**
   * Sort a column in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-|
   *
   * @param {object} [options] Additional options.
   */
  async commandSortTableColumn(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.sortTableColumn, options);
  }

  /**
   * Interact with scroll bars
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-S
   *
   * @param {object} [options] Additional options.
   */
  async commandInteractWithScrollbars(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.interactWithScrollbars, options);
  }

  /**
   * Resize a window or an object
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-~
   *
   * @param {object} [options] Additional options.
   */
  async commandResizeObject(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.resizeObject, options);
  }

  /**
   * Move a window or an object
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-`
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveObject(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveObject, options);
  }

  /**
   * Move up
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveUp(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveUp, options);
  }

  /**
   * Move down
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveDown(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveDown, options);
  }

  /**
   * Move to previous
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToPrevious(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToPrevious, options);
  }

  /**
   * Move to next
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToNext(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToNext, options);
  }

  /**
   * Move to the top of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Home
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToVisibleAreaTop(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToVisibleAreaTop, options);
  }

  /**
   * Move to the bottom of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-End
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToVisibleAreaBottom(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToVisibleAreaBottom, options);
  }

  /**
   * Move to the top of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Home
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToAreaTop(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToAreaTop, options);
  }

  /**
   * Move to the bottom of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-End
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToAreaBottom(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToAreaBottom, options);
  }

  /**
   * Move to the top of a window, the first item in the Dock, or the first item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Home
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToFirst(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToFirst, options);
  }

  /**
   * Move to the lower-right corner of a window, the last item in the Dock, or the last item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-End
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToLast(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToLast, options);
  }

  /**
   * Move to the front the window where the VoiceOver cursor is located and make it active
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F2
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToFrontWindow(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToFrontWindow, options);
  }

  /**
   * Close the window where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F2
   *
   * @param {object} [options] Additional options.
   */
  async commandCloseWindow(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.closeWindow, options);
  }

  /**
   * Open the Item Chooser
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-I
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenItemChooser(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openItemChooser, options);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-D
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToDock(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToDock, options);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-D
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToDesktop(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToDesktop, options);
  }

  /**
   * Move to the menu bar
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToMenuBar(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToMenuBar, options);
  }

  /**
   * Move to the first status menu in the menu bar
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M-M
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToFirstStatusMenuInMenuBar(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToFirstStatusMenuInMenuBar, options);
  }

  /**
   * Open the Spotlight menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M-M-M
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenSpotlightMenu(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openSpotlightMenu, options);
  }

  /**
   * Open a shortcut menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-J
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenShortcutMenu(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openShortcutMenu, options);
  }

  /**
   * Jump to a linked item (for example, from a Mail message in the Inbox to its message text)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-J
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToLinkedItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToLinkedItem, options);
  }

  /**
   * Temporarily disable or enable the cursor tracking options you selected in VoiceOver Utility. The command doesn't change the settings in VoiceOver Utility.
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleCursorTrackingOptions(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleCursorTrackingOptions, options);
  }

  /**
   * Move VoiceOver cursor to keyboard focus
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F4
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveCursorToKeyboardFocus(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveCursorToKeyboardFocus, options);
  }

  /**
   * Move keyboard focus to VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F4
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveKeyboardFocusToCursor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveKeyboardFocusToCursor, options);
  }

  /**
   * Move VoiceOver cursor to mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F5
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveCursorToMouseFocus(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveCursorToMouseFocus, options);
  }

  /**
   * Move mouse cursor to VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F5
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveMouseFocusToCursor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveMouseFocusToCursor, options);
  }

  /**
   * Jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-J
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpCommand(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpCommand, options);
  }

  /**
   * Jump to the top edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToTopEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToTopEdge, options);
  }

  /**
   * Jump to the right edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToRightEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToRightEdge, options);
  }

  /**
   * Jump to the bottom edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToBottomEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToBottomEdge, options);
  }

  /**
   * Jump to the left edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToLeftEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToLeftEdge, options);
  }

  /**
   * Jump to the top visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToTopVisibleEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToTopVisibleEdge, options);
  }

  /**
   * Jump to the right visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToRightVisibleEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToRightVisibleEdge, options);
  }

  /**
   * Jump to the bottom visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToBottomVisibleEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToBottomVisibleEdge, options);
  }

  /**
   * Jump to the left visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToLeftVisibleEdge(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToLeftVisibleEdge, options);
  }

  /**
   * Jump to the area that precedes a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-[
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpBeforeSplitter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpBeforeSplitter, options);
  }

  /**
   * Jump to the area that follows a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-]
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpAfterSplitter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpAfterSplitter, options);
  }

  /**
   * Find text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F
   *
   * @param {object} [options] Additional options.
   */
  async commandFindText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findText, options);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandNavigateUp(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.navigateUp, options);
  }

  /**
   * Cycle through navigation settings (Headings, Form Controls, Landmarks, etc.)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandCycleRightThroughNavigationSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.cycleRightThroughNavigationSettings, options);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandNavigateDown(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.navigateDown, options);
  }

  /**
   * Cycle through navigation settings (Headings, Form Controls, Landmarks, etc.)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandCycleLeftThroughNavigationSettings(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.cycleLeftThroughNavigationSettings, options);
  }

  /**
   * Toggle hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-1
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot1(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot1, options);
  }

  /**
   * Toggle hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-2
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot2(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot2, options);
  }

  /**
   * Toggle hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-3
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot3(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot3, options);
  }

  /**
   * Toggle hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-4
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot4(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot4, options);
  }

  /**
   * Toggle hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-5
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot5(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot5, options);
  }

  /**
   * Toggle hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-6
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot6(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot6, options);
  }

  /**
   * Toggle hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-7
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot7(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot7, options);
  }

  /**
   * Toggle hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-8
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot8(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot8, options);
  }

  /**
   * Toggle hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-9
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot9(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot9, options);
  }

  /**
   * Toggle hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-0
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleHotSpot0(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleHotSpot0, options);
  }

  /**
   * Jump to hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-1
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot1(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot1, options);
  }

  /**
   * Jump to hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-2
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot2(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot2, options);
  }

  /**
   * Jump to hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-3
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot3(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot3, options);
  }

  /**
   * Jump to hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-4
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot4(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot4, options);
  }

  /**
   * Jump to hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-5
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot5(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot5, options);
  }

  /**
   * Jump to hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-6
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot6(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot6, options);
  }

  /**
   * Jump to hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-7
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot7(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot7, options);
  }

  /**
   * Jump to hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-8
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot8(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot8, options);
  }

  /**
   * Jump to hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-9
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot9(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot9, options);
  }

  /**
   * Jump to hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-0
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToHotSpot0(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToHotSpot0, options);
  }

  /**
   * Hear a description of hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-1
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot1(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot1, options);
  }

  /**
   * Hear a description of hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-2
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot2(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot2, options);
  }

  /**
   * Hear a description of hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-3
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot3(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot3, options);
  }

  /**
   * Hear a description of hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-4
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot4(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot4, options);
  }

  /**
   * Hear a description of hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-5
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot5(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot5, options);
  }

  /**
   * Hear a description of hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-6
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot6(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot6, options);
  }

  /**
   * Hear a description of hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-7
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot7(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot7, options);
  }

  /**
   * Hear a description of hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-8
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot8(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot8, options);
  }

  /**
   * Hear a description of hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-9
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot9(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot9, options);
  }

  /**
   * Hear a description of hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-0
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeHotSpot0(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeHotSpot0, options);
  }

  /**
   * Monitor hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-1
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot1(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot1, options);
  }

  /**
   * Monitor hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-2
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot2(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot2, options);
  }

  /**
   * Monitor hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-3
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot3(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot3, options);
  }

  /**
   * Monitor hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-4
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot4(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot4, options);
  }

  /**
   * Monitor hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-5
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot5(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot5, options);
  }

  /**
   * Monitor hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-6
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot6(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot6, options);
  }

  /**
   * Monitor hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-7
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot7(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot7, options);
  }

  /**
   * Monitor hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-8
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot8(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot8, options);
  }

  /**
   * Monitor hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-9
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot9(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot9, options);
  }

  /**
   * Monitor hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-0
   *
   * @param {object} [options] Additional options.
   */
  async commandMonitorHotSpot0(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.monitorHotSpot0, options);
  }

  /**
   * Jump back to a parent folder
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-\
   *
   * @param {object} [options] Additional options.
   */
  async commandJumpToParentFolder(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.jumpToParentFolder, options);
  }

  /**
   * Hear the application summary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F1
   *
   * @param {object} [options] Additional options.
   */
  async commandHearApplicationSummary(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.hearApplicationSummary, options);
  }

  /**
   * Open the Application Chooser
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F1-F1
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenApplicationChooser(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openApplicationChooser, options);
  }

  /**
   * Hear the window summary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F2
   *
   * @param {object} [options] Additional options.
   */
  async commandHearWindowSummary(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.hearWindowSummary, options);
  }

  /**
   * Open the Window Chooser 
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F2-F2
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenWindowChooser(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openWindowChooser, options);
  }

  /**
   * Describe the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeItem, options);
  }

  /**
   * Describe the size of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeItemSize(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeItemSize, options);
  }

  /**
   * Describe the position of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F3-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeItemPosition(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeItemPosition, options);
  }

  /**
   * Describe the item that has the keyboard focus
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F4
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeItemWithKeyboardFocus(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeItemWithKeyboardFocus, options);
  }

  /**
   * Describe the location of the insertion point (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F4-F4
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeLocationOfInsertionPoint(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeLocationOfInsertionPoint, options);
  }

  /**
   * Describe the item under the mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeItemUnderMouseCursor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeItemUnderMouseCursor, options);
  }

  /**
   * Describe the location of the mouse in x, y coordinates (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5-F5
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeLocationOfMouseInCoordinates(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeLocationOfMouseInCoordinates, options);
  }

  /**
   * Describe the location of the mouse (from upper-left corner of window)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5-F5-F5
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeLocationOfMouse(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeLocationOfMouse, options);
  }

  /**
   * Describe the selected item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F6
   *
   * @param {object} [options] Additional options.
   */
  async commandDescribeSelectedItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.describeSelectedItem, options);
  }

  /**
   * Read everything in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-A
   *
   * @param {object} [options] Additional options.
   */
  async commandReadEverythingInCursor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readEverythingInCursor, options);
  }

  /**
   * Read everything visible in the window or the Dock, or on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-W
   *
   * @param {object} [options] Additional options.
   */
  async commandReadEverythingInWindow(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readEverythingInWindow, options);
  }

  /**
   * Repeat the last spoken phrase
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Z
   *
   * @param {object} [options] Additional options.
   */
  async commandRepeatLastSpokenPhrase(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.repeatLastSpokenPhrase, options);
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-C
   *
   * @param {object} [options] Additional options.
   */
  async commandCopyLastSpokenPhraseToClipboard(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.copyLastSpokenPhraseToClipboard, options);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Z
   *
   * @param {object} [options] Additional options.
   */
  async commandSaveLastSpokenPhraseToDesktop(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.saveLastSpokenPhraseToDesktop, options);
  }

  /**
   * Find
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F
   *
   * @param {object} [options] Additional options.
   */
  async commandFind(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.find, options);
  }

  /**
   * Find the next searched text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-G
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextSearchedText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextSearchedText, options);
  }

  /**
   * Find the previous searched text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-G
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousSearchedText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousSearchedText, options);
  }

  /**
   * Find the next list
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-X
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextList(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextList, options);
  }

  /**
   * Find the previous list
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-X
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousList(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousList, options);
  }

  /**
   * Find the next bold text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-B
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextBoldText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextBoldText, options);
  }

  /**
   * Find the previous bold text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-B
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousBoldText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousBoldText, options);
  }

  /**
   * Find the next style change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-C
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextStyleChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextStyleChange, options);
  }

  /**
   * Find the previous style change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-C
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousStyleChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousStyleChange, options);
  }

  /**
   * Find the next italic text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-I
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextItalicText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextItalicText, options);
  }

  /**
   * Find the previous italic text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-I
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousItalicText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousItalicText, options);
  }

  /**
   * Find the next color change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-K
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextColorChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextColorChange, options);
  }

  /**
   * Find the previous color change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-K
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousColorChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousColorChange, options);
  }

  /**
   * Find the next font change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-O
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextFontChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextFontChange, options);
  }

  /**
   * Find the previous font change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-O
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousFontChange(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousFontChange, options);
  }

  /**
   * Find the next table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-T
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextTable(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextTable, options);
  }

  /**
   * Find the previous table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-T
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousTable(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousTable, options);
  }

  /**
   * Find the next underlined text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-U
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextUnderlinedText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextUnderlinedText, options);
  }

  /**
   * Find the previous underlined text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-U
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousUnderlinedText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousUnderlinedText, options);
  }

  /**
   * Find the next control
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-J
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextControl(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextControl, options);
  }

  /**
   * Find the previous control
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-J
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousControl(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousControl, options);
  }

  /**
   * Find the next different item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-D
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextDifferentItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextDifferentItem, options);
  }

  /**
   * Find the previous different item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-D
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousDifferentItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousDifferentItem, options);
  }

  /**
   * Find the next item that's the same type as the current item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-S
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextItemWithSameTypeAsCurrentItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextItemWithSameTypeAsCurrentItem, options);
  }

  /**
   * Find the previous item that's the same type as the current item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-S
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousItemWithSameTypeAsCurrentItem(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousItemWithSameTypeAsCurrentItem, options);
  }

  /**
   * Find the next graphic
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-G
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextGraphic(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextGraphic, options);
  }

  /**
   * Find the previous graphic
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-G
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousGraphic(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousGraphic, options);
  }

  /**
   * Find the next heading
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-H
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextHeading(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextHeading, options);
  }

  /**
   * Find the previous heading
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-H
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousHeading(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousHeading, options);
  }

  /**
   * Find the next link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-L
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextLink(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextLink, options);
  }

  /**
   * Find the previous link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-L
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousLink(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousLink, options);
  }

  /**
   * Find the next heading of the same level
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-M
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextHeadingOfSameLevel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextHeadingOfSameLevel, options);
  }

  /**
   * Find the previous heading of the same level
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-M
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousHeadingOfSameLevel(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousHeadingOfSameLevel, options);
  }

  /**
   * Find the next plain text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-P
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextPlainText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextPlainText, options);
  }

  /**
   * Find the previous plain text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-P
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousPlainText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousPlainText, options);
  }

  /**
   * Find the next visited link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-V
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextVisitedLink(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextVisitedLink, options);
  }

  /**
   * Find the previous visited link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-V
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousVisitedLink(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousVisitedLink, options);
  }

  /**
   * Find the next misspelled word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-E
   *
   * @param {object} [options] Additional options.
   */
  async commandFindNextMisspelledWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findNextMisspelledWord, options);
  }

  /**
   * Find the previous misspelled word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-E
   *
   * @param {object} [options] Additional options.
   */
  async commandFindPreviousMisspelledWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.findPreviousMisspelledWord, options);
  }

  /**
   * Read all text from the VoiceOver cursor to the end of the text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-A
   *
   * @param {object} [options] Additional options.
   */
  async commandReadAllText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readAllText, options);
  }

  /**
   * Select all text in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-A
   *
   * @param {object} [options] Additional options.
   */
  async commandSelectAllText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.selectAllText, options);
  }

  /**
   * Start and stop text selection in a text field (text selection tracking must be on)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Return
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleTextSelection(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleTextSelection, options);
  }

  /**
   * Speak text attributes
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-T
   *
   * @param {object} [options] Additional options.
   */
  async commandSpeakTextAttributes(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.speakTextAttributes, options);
  }

  /**
   * Read paragraph in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-P
   *
   * @param {object} [options] Additional options.
   */
  async commandReadParagraph(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readParagraph, options);
  }

  /**
   * Read next paragraph
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Page Down
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNextParagraph(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNextParagraph, options);
  }

  /**
   * Read previous paragraph
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Page Up
   *
   * @param {object} [options] Additional options.
   */
  async commandReadPreviousParagraph(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readPreviousParagraph, options);
  }

  /**
   * Read sentence in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-S
   *
   * @param {object} [options] Additional options.
   */
  async commandReadSentence(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readSentence, options);
  }

  /**
   * Read next sentence
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Page Down
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNextSentence(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNextSentence, options);
  }

  /**
   * Read previous sentence
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Page Up
   *
   * @param {object} [options] Additional options.
   */
  async commandReadPreviousSentence(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readPreviousSentence, options);
  }

  /**
   * Read line in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-L
   *
   * @param {object} [options] Additional options.
   */
  async commandReadLine(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readLine, options);
  }

  /**
   * Read next line
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNextLine(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNextLine, options);
  }

  /**
   * Read previous line
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadPreviousLine(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readPreviousLine, options);
  }

  /**
   * Read word in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W
   *
   * @param {object} [options] Additional options.
   */
  async commandReadWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readWord, options);
  }

  /**
   * Read word spelled in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W-W
   *
   * @param {object} [options] Additional options.
   */
  async commandReadWordSpelled(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readWordSpelled, options);
  }

  /**
   * Read word spelled phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W-W-W
   *
   * @param {object} [options] Additional options.
   */
  async commandReadWordPhonetically(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readWordPhonetically, options);
  }

  /**
   * Read next word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNextWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNextWord, options);
  }

  /**
   * Read previous word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadPreviousWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readPreviousWord, options);
  }

  /**
   * Read character in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W
   *
   * @param {object} [options] Additional options.
   */
  async commandReadCharacter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readCharacter, options);
  }

  /**
   * Read character phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C-C
   *
   * @param {object} [options] Additional options.
   */
  async commandReadCharacterPhonetically(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readCharacterPhonetically, options);
  }

  /**
   * Read next character
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Right Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNextCharacter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNextCharacter, options);
  }

  /**
   * Read previous character
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Left Arrow
   *
   * @param {object} [options] Additional options.
   */
  async commandReadPreviousCharacter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readPreviousCharacter, options);
  }

  /**
   * Move to first visible word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Home
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToFirstVisibleWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToFirstVisibleWord, options);
  }

  /**
   * Move to last visible word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-End
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToLastVisibleWord(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToLastVisibleWord, options);
  }

  /**
   * Move to beginning of text, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Home
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToBeginningOfText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToBeginningOfText, options);
  }

  /**
   * Move to end of text, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-End
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToEndOfText(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToEndOfText, options);
  }

  /**
   * Reads the current word and character in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandReadCurrentWordAndCharacter(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readCurrentWordAndCharacter, options);
  }

  /**
   * Reads the total number of lines and the number of visible lines in a document
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3-F3
   *
   * @param {object} [options] Additional options.
   */
  async commandReadNumberOfLines(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readNumberOfLines, options);
  }

  /**
   * Move to the next column
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Y
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToNextColumn(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToNextColumn, options);
  }

  /**
   * Move to the previous column
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Y
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToPreviousColumn(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToPreviousColumn, options);
  }

  /**
   * Move to the next frame
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToNextFrame(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToNextFrame, options);
  }

  /**
   * Move to the previous frame
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-F
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToPreviousFrame(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToPreviousFrame, options);
  }

  /**
   * Move to the next auto web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-N
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToNextAutoWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToNextAutoWebSpot, options);
  }

  /**
   * Move to the previous auto web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-N
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToPreviousAutoWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToPreviousAutoWebSpot, options);
  }

  /**
   * Move to the next web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-]
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToNextWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToNextWebSpot, options);
  }

  /**
   * Move to the previous web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-[
   *
   * @param {object} [options] Additional options.
   */
  async commandMoveToPreviousWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.moveToPreviousWebSpot, options);
  }

  /**
   * Open the Web Item rotor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-U
   *
   * @param {object} [options] Additional options.
   */
  async commandOpenWebItemRotor(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.openWebItemRotor, options);
  }

  /**
   * Read from the beginning of a webpage to the current location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-B
   *
   * @param {object} [options] Additional options.
   */
  async commandReadFromBeginningToCurrent(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readFromBeginningToCurrent, options);
  }

  /**
   * Read a link address (URL)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-U
   *
   * @param {object} [options] Additional options.
   */
  async commandReadLinkAddress(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readLinkAddress, options);
  }

  /**
   * Read webpage statistics
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-I
   *
   * @param {object} [options] Additional options.
   */
  async commandReadWebpageStatistics(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.readWebpageStatistics, options);
  }

  /**
   * Remove a web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-{
   *
   * @param {object} [options] Additional options.
   */
  async commandRemoveWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.removeWebSpot, options);
  }

  /**
   * Set a web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-}
   *
   * @param {object} [options] Additional options.
   */
  async commandSetWebSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.setWebSpot, options);
  }

  /**
   * Set the sweet spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-}-}
   *
   * @param {object} [options] Additional options.
   */
  async commandSetSweetSpot(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.setSweetSpot, options);
  }

  /**
   * Turn the grouping of items within a table on or off
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-=
   *
   * @param {object} [options] Additional options.
   */
  async commandToggleGroupingItemsWithinTable(options?: CommandOptions): Promise<void> {
    return await this.sendKeys(keyCodeCommands.toggleGroupingItemsWithinTable, options);
  }

  /**
   * Actions
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderActions(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ACTIONS, options);
  }

  /**
   * Add pronunciation
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderAddPronunciation(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ADD_PRONUNCIATION, options);
  }

  /**
   * Bring window to front
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderBringWindowToFront(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.BRING_WINDOW_TO_FRONT, options);
  }

  /**
   * Click mouse
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderClickMouse(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.CLICK_MOUSE, options);
  }

  /**
   * Close window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderCloseWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.CLOSE_WINDOW, options);
  }

  /**
   * Describe position of window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribePositionOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_POSITION_OF_WINDOW, options);
  }

  /**
   * Describe size of window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeSizeOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_SIZE_OF_WINDOW, options);
  }

  /**
   * Double click mouse
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDoubleClickMouse(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DOUBLE_CLICK_MOUSE, options);
  }

  /**
   * Drop marked item after chosen hot spot
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemAfterChosenHotSpot(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_AFTER_CHOSEN_HOT_SPOT, options);
  }

  /**
   * Drop marked item after voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemAfterVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_AFTER_VOICEOVER_CURSOR, options);
  }

  /**
   * Drop marked item before chosen hot spot
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemBeforeChosenHotSpot(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_BEFORE_CHOSEN_HOT_SPOT, options);
  }

  /**
   * Drop marked item before voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemBeforeVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_BEFORE_VOICEOVER_CURSOR, options);
  }

  /**
   * Drop marked item on chosen hot spot
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemOnChosenHotSpot(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_ON_CHOSEN_HOT_SPOT, options);
  }

  /**
   * Drop marked item on voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDropMarkedItemOnVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_ON_VOICEOVER_CURSOR, options);
  }

  /**
   * Escape
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderEscape(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ESCAPE, options);
  }

  /**
   * Fast-forward
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderFastForward(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.FAST_FORWARD, options);
  }

  /**
   * Ignore next keypress
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderIgnoreNextKeypress(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.IGNORE_NEXT_KEYPRESS, options);
  }

  /**
   * Interact with scroll bar
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderInteractWithScrollBar(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.INTERACT_WITH_SCROLL_BAR, options);
  }

  /**
   * Item chooser
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderItemChooser(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ITEM_CHOOSER, options);
  }

  /**
   * Keyboard help
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderKeyboardHelp(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.KEYBOARD_HELP, options);
  }

  /**
   * Label item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderLabelItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.LABEL_ITEM, options);
  }

  /**
   * Magic tap
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMagicTap(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MAGIC_TAP, options);
  }

  /**
   * Mark item to drag and drop
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMarkItemToDragAndDrop(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MARK_ITEM_TO_DRAG_AND_DROP, options);
  }

  /**
   * More content
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoreContent(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MORE_CONTENT, options);
  }

  /**
   * Mouse down
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMouseDown(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOUSE_DOWN, options);
  }

  /**
   * Mouse up
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMouseUp(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOUSE_UP, options);
  }

  /**
   * Move down
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveDown(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_DOWN, options);
  }

  /**
   * Move left
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveLeft(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_LEFT, options);
  }

  /**
   * Move right
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveRight(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_RIGHT, options);
  }

  /**
   * Move up
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveUp(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_UP, options);
  }

  /**
   * Open activity chooser
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenActivityChooser(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_ACTIVITY_CHOOSER, options);
  }

  /**
   * Open application chooser
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenApplicationChooser(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_APPLICATION_CHOOSER, options);
  }

  /**
   * Open commands menu
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenCommandsMenu(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_COMMANDS_MENU, options);
  }

  /**
   * Open control center
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenControlCenter(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_CONTROL_CENTER, options);
  }

  /**
   * Open next speech attribute guide
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenNextSpeechAttributeGuide(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_NEXT_SPEECH_ATTRIBUTE_GUIDE, options);
  }

  /**
   * Open notification centre
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenNotificationCentre(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_NOTIFICATION_CENTRE, options);
  }

  /**
   * Open previous speech attribute guide
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenPreviousSpeechAttributeGuide(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_PREVIOUS_SPEECH_ATTRIBUTE_GUIDE, options);
  }

  /**
   * Open quick start tutorial
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenQuickStartTutorial(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_QUICK_START_TUTORIAL, options);
  }

  /**
   * Open shortcut menu
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenShortcutMenu(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_SHORTCUT_MENU, options);
  }

  /**
   * Open the announcement history menu
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenTheAnnouncementHistoryMenu(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_THE_ANNOUNCEMENT_HISTORY_MENU, options);
  }

  /**
   * Open the notifications menu
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenTheNotificationsMenu(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_THE_NOTIFICATIONS_MENU, options);
  }

  /**
   * Open verbosity rotor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenVerbosityRotor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VERBOSITY_ROTOR, options);
  }

  /**
   * Open voiceover help menu
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenVoiceoverHelpMenu(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VOICEOVER_HELP_MENU, options);
  }

  /**
   * Open voiceover utility
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenVoiceoverUtility(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VOICEOVER_UTILITY, options);
  }

  /**
   * Open window chooser
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderOpenWindowChooser(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_WINDOW_CHOOSER, options);
  }

  /**
   * Pause or resume speaking
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderPauseOrResumeSpeaking(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.PAUSE_OR_RESUME_SPEAKING, options);
  }

  /**
   * Perform action for item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderPerformActionForItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.PERFORM_ACTION_FOR_ITEM, options);
  }

  /**
   * Previous activity
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderPreviousActivity(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_ACTIVITY, options);
  }

  /**
   * Read contents of voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadContentsOfVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CONTENTS_OF_VOICEOVER_CURSOR, options);
  }

  /**
   * Read contents of window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadContentsOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CONTENTS_OF_WINDOW, options);
  }

  /**
   * Read current item alphabetically
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadCurrentItemAlphabetically(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CURRENT_ITEM_ALPHABETICALLY, options);
  }

  /**
   * Read current item phonetically
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadCurrentItemPhonetically(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CURRENT_ITEM_PHONETICALLY, options);
  }

  /**
   * Read help tag for item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadHelpTagForItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_HELP_TAG_FOR_ITEM, options);
  }

  /**
   * Read image description for item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadImageDescriptionForItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_IMAGE_DESCRIPTION_FOR_ITEM, options);
  }

  /**
   * Read selected text or item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadSelectedTextOrItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_SELECTED_TEXT_OR_ITEM, options);
  }

  /**
   * Read visible text
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadVisibleText(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_VISIBLE_TEXT, options);
  }

  /**
   * Read voiceover hint
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderReadVoiceoverHint(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_VOICEOVER_HINT, options);
  }

  /**
   * Remove from window spots
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRemoveFromWindowSpots(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.REMOVE_FROM_WINDOW_SPOTS, options);
  }

  /**
   * Rewind
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRewind(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.REWIND, options);
  }

  /**
   * Right click mouse
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRightClickMouse(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.RIGHT_CLICK_MOUSE, options);
  }

  /**
   * Rotor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRotor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTOR, options);
  }

  /**
   * Select item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSelectItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_ITEM, options);
  }

  /**
   * Select next option down in speech attribute guide
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSelectNextOptionDownInSpeechAttributeGuide(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_NEXT_OPTION_DOWN_IN_SPEECH_ATTRIBUTE_GUIDE, options);
  }

  /**
   * Select next option up in speech attribute guide
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSelectNextOptionUpInSpeechAttributeGuide(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_NEXT_OPTION_UP_IN_SPEECH_ATTRIBUTE_GUIDE, options);
  }

  /**
   * Set as a window spot
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSetAsAWindowSpot(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SET_AS_A_WINDOW_SPOT, options);
  }

  /**
   * Set the sweet spot
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSetTheSweetSpot(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SET_THE_SWEET_SPOT, options);
  }

  /**
   * Start interacting with item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderStartInteractingWithItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.START_INTERACTING_WITH_ITEM, options);
  }

  /**
   * Stop interacting with item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderStopInteractingWithItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.STOP_INTERACTING_WITH_ITEM, options);
  }

  /**
   * Toggle cursor tracking on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleCursorTrackingOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_CURSOR_TRACKING_ON_OR_OFF, options);
  }

  /**
   * Toggle disclosure triangle open or closed
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleDisclosureTriangleOpenOrClosed(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_DISCLOSURE_TRIANGLE_OPEN_OR_CLOSED, options);
  }

  /**
   * Toggle keyboard commander on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleKeyboardCommanderOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_KEYBOARD_COMMANDER_ON_OR_OFF, options);
  }

  /**
   * Toggle multiple selection on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleMultipleSelectionOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_MULTIPLE_SELECTION_ON_OR_OFF, options);
  }

  /**
   * Toggle numpad commander on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleNumpadCommanderOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_NUMPAD_COMMANDER_ON_OR_OFF, options);
  }

  /**
   * Toggle quick nav on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleQuickNavOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_QUICK_NAV_ON_OR_OFF, options);
  }

  /**
   * Toggle screen curtain on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleScreenCurtainOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_SCREEN_CURTAIN_ON_OR_OFF, options);
  }

  /**
   * Toggle single-key quick nav on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleSingleKeyQuickNavOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_SINGLE_KEY_QUICK_NAV_ON_OR_OFF, options);
  }

  /**
   * Toggle the vo modifier lock on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleTheVoModifierLockOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_THE_VO_MODIFIER_LOCK_ON_OR_OFF, options);
  }

  /**
   * Toggle trackpad commander on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleTrackpadCommanderOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_TRACKPAD_COMMANDER_ON_OR_OFF, options);
  }

  /**
   * User guide
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderUserGuide(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.USER_GUIDE, options);
  }

  /**
   * Describe item in mouse pointer
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeItemInMousePointer(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_IN_MOUSE_POINTER, options);
  }

  /**
   * Describe item in voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeItemInVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_IN_VOICEOVER_CURSOR, options);
  }

  /**
   * Describe item with keyboard focus
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeItemWithKeyboardFocus(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_WITH_KEYBOARD_FOCUS, options);
  }

  /**
   * Describe mouse pointer location (from top left of screen)
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeMousePointerLocationFromTopLeftOfScreen(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_SCREEN, options);
  }

  /**
   * Describe mouse pointer location (from top left of window)
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeMousePointerLocationFromTopLeftOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_WINDOW, options);
  }

  /**
   * Describe open applications
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeOpenApplications(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_OPEN_APPLICATIONS, options);
  }

  /**
   * Describe position of item in voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribePositionOfItemInVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_POSITION_OF_ITEM_IN_VOICEOVER_CURSOR, options);
  }

  /**
   * Describe size of item in voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeSizeOfItemInVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_SIZE_OF_ITEM_IN_VOICEOVER_CURSOR, options);
  }

  /**
   * Describe window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderDescribeWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_WINDOW, options);
  }

  /**
   * Go down one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoDownOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_DOWN_ONE_PAGE, options);
  }

  /**
   * Go left a bit
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoLeftABit(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_LEFT_A_BIT, options);
  }

  /**
   * Go left one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoLeftOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_LEFT_ONE_PAGE, options);
  }

  /**
   * Go right a bit
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoRightABit(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_RIGHT_A_BIT, options);
  }

  /**
   * Go right one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoRightOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_RIGHT_ONE_PAGE, options);
  }

  /**
   * Go to beginning
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToBeginning(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_BEGINNING, options);
  }

  /**
   * Go to bottom of window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToBottomOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_BOTTOM_OF_WINDOW, options);
  }

  /**
   * Go to desktop
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToDesktop(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_DESKTOP, options);
  }

  /**
   * Go to dock
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToDock(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_DOCK, options);
  }

  /**
   * Go to end
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToEnd(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_END, options);
  }

  /**
   * Go to linked item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToLinkedItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_LINKED_ITEM, options);
  }

  /**
   * Go to menu bar
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToMenuBar(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_MENU_BAR, options);
  }

  /**
   * Go to pop-up item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToPopUpItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_POP_UP_ITEM, options);
  }

  /**
   * Go to status menus
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToStatusMenus(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_STATUS_MENUS, options);
  }

  /**
   * Go to top of window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToTopOfWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_TOP_OF_WINDOW, options);
  }

  /**
   * Go to visible beginning
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToVisibleBeginning(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_VISIBLE_BEGINNING, options);
  }

  /**
   * Go to visible end
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoToVisibleEnd(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_VISIBLE_END, options);
  }

  /**
   * Go up one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderGoUpOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_UP_ONE_PAGE, options);
  }

  /**
   * Move down in rotor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveDownInRotor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_DOWN_IN_ROTOR, options);
  }

  /**
   * Move keyboard focus to voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveKeyboardFocusToVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_KEYBOARD_FOCUS_TO_VOICEOVER_CURSOR, options);
  }

  /**
   * Move mouse pointer to voiceover cursor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveMousePointerToVoiceoverCursor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_MOUSE_POINTER_TO_VOICEOVER_CURSOR, options);
  }

  /**
   * Move to area after splitter
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveToAreaAfterSplitter(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_AREA_AFTER_SPLITTER, options);
  }

  /**
   * Move to area before splitter
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveToAreaBeforeSplitter(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_AREA_BEFORE_SPLITTER, options);
  }

  /**
   * Move to next section
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveToNextSection(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_NEXT_SECTION, options);
  }

  /**
   * Move to previous section
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveToPreviousSection(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_PREVIOUS_SECTION, options);
  }

  /**
   * Move up in rotor
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveUpInRotor(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_UP_IN_ROTOR, options);
  }

  /**
   * Move voiceover cursor to keyboard focus
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveVoiceoverCursorToKeyboardFocus(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_VOICEOVER_CURSOR_TO_KEYBOARD_FOCUS, options);
  }

  /**
   * Move voiceover cursor to mouse pointer
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderMoveVoiceoverCursorToMousePointer(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_VOICEOVER_CURSOR_TO_MOUSE_POINTER, options);
  }

  /**
   * Next content
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderNextContent(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.NEXT_CONTENT, options);
  }

  /**
   * Next rotor item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderNextRotorItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.NEXT_ROTOR_ITEM, options);
  }

  /**
   * Previous content
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderPreviousContent(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_CONTENT, options);
  }

  /**
   * Previous rotor item
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderPreviousRotorItem(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_ROTO_ITEM, options);
  }

  /**
   * Rotate left
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRotateLeft(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTATE_LEFT, options);
  }

  /**
   * Rotate right
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderRotateRight(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTATE_RIGHT, options);
  }

  /**
   * Scroll down one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderScrollDownOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_DOWN_ONE_PAGE, options);
  }

  /**
   * Scroll left one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderScrollLeftOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_LEFT_ONE_PAGE, options);
  }

  /**
   * Scroll right one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderScrollRightOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_RIGHT_ONE_PAGE, options);
  }

  /**
   * Scroll up one page
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderScrollUpOnePage(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_UP_ONE_PAGE, options);
  }

  /**
   * Speak current page in scroll area
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSpeakCurrentPageInScrollArea(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SPEAK_CURRENT_PAGE_IN_SCROLL_AREA, options);
  }

  /**
   * Switch window
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderSwitchWindow(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.SWITCH_WINDOW, options);
  }

  /**
   * Toggle voiceover cursor follows mouse on or off
   *
   * Uses VoiceOver Commander
   *
   * @param {object} [options] Additional options.
   */
  async commanderToggleVoiceoverCursorFollowsMouseOnOrOff(options?: CommandOptions): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_VOICEOVER_CURSOR_FOLLOWS_MOUSE_ON_OR_OFF, options);
  }
}
