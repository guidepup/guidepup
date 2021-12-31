// This file was automatically generated.
// Manual changes will not be preserved.

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
   */
  async commandToggleLock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleLock);
  }

  /**
   * Open VoiceOver Utility
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F8
   */
  async commandOpenVoiceOverUtility(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverUtility);
  }

  /**
   * Open the VoiceOver Help menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-H
   */
  async commandOpenVoiceOverHelpMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverHelpMenu);
  }

  /**
   * Open the VoiceOver Quick Start
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F8
   */
  async commandOpenVoiceOverQuickStart(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverQuickStart);
  }

  /**
   * Open VoiceOver online help
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-/
   */
  async commandOpenVoiceOverOnlineHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverOnlineHelp);
  }

  /**
   * Start keyboard help
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-K
   */
  async commandStartKeyboardHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.startKeyboardHelp);
  }

  /**
   * Hear a description of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-N
   */
  async commandHearItemDescription(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearItemDescription);
  }

  /**
   * Open the Commands menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-H-H
   */
  async commandOpenCommandsMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openCommandsMenu);
  }

  /**
   * Open the Find menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F
   */
  async commandOpenFindMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openFindMenu);
  }

  /**
   * Close a menu or rotor, stop an action, or exit a mode
   *
   * Uses VoiceOver keycode command
   *
   * Representation: Escape
   */
  async commandStopAction(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopAction);
  }

  /**
   * Tell VoiceOver to ignore the next key combination you press
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Tab
   */
  async commandIgnoreNextKeyCombination(): Promise<void> {
    return await this.keyCode(keyCodeCommands.ignoreNextKeyCombination);
  }

  /**
   * Open the verbosity rotor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-V
   */
  async commandOpenVerbosityRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVerbosityRotor);
  }

  /**
   * Magnify the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-}
   */
  async commandMagnifyItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.magnifyItem);
  }

  /**
   * Shrink the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-{
   */
  async commandShrinkItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.shrinkItem);
  }

  /**
   * Temporarily hide or show the VoiceOver cursor and the caption or braille panels
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F11
   */
  async commandToggleVoiceOverCursorAndPanels(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleVoiceOverCursorAndPanels);
  }

  /**
   * Hide or show the caption panel only
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F10
   */
  async commandToggleCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCaptionPanel);
  }

  /**
   * Resize or move the caption panel
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F10
   */
  async commandResizeOrMoveCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveCaptionPanel);
  }

  /**
   * Hide or show the braille panel only
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F9
   */
  async commandToggleBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleBraillePanel);
  }

  /**
   * Resize or move the braille panel
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F9
   */
  async commandResizeOrMoveBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveBraillePanel);
  }

  /**
   * Tile visuals (dim the screen, highlight the caption or braille panel, and show the item in the VoiceOver cursor in the center of the screen).
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F10
   */
  async commandTileVisuals(): Promise<void> {
    return await this.keyCode(keyCodeCommands.tileVisuals);
  }

  /**
   * Enable or disable the Keyboard Commander
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-K
   */
  async commandToggleKeyboardCommander(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleKeyboardCommander);
  }

  /**
   * Turn the screen black (screen curtain)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F11
   */
  async commandToggleScreenCurtain(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleScreenCurtain);
  }

  /**
   * Cycle through speech settings (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Right Arrow
   */
  async commandCycleRightThroughSpeechSettings(): Promise<void> {
    return await this.keyCode(keyCodeCommands.cycleRightThroughSpeechSettings);
  }

  /**
   * Cycle through speech settings (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Left Arrow
   */
  async commandCycleLeftThroughSpeechSettings(): Promise<void> {
    return await this.keyCode(keyCodeCommands.cycleLeftThroughSpeechSettings);
  }

  /**
   * Change the current speech setting (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Up Arrow
   */
  async commandChangeUpCurrentSpeechSettings(): Promise<void> {
    return await this.keyCode(keyCodeCommands.changeUpCurrentSpeechSettings);
  }

  /**
   * Change the current speech setting (rate, pitch, volume, intonation, voice)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Down Arrow
   */
  async commandChangeDownCurrentSpeechSettings(): Promise<void> {
    return await this.keyCode(keyCodeCommands.changeDownCurrentSpeechSettings);
  }

  /**
   * Press and release mouse button
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Space bar
   */
  async commandPressAndReleaseMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.pressAndReleaseMouse);
  }

  /**
   * Interact with an item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Down Arrow
   */
  async commandInteractWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithItem);
  }

  /**
   * Stop interacting with an item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Up Arrow
   */
  async commandStopInteractingWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopInteractingWithItem);
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Space bar
   */
  async commandPerformDefaultActionForItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.performDefaultActionForItem);
  }

  /**
   * Select a menu or list item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Return
   */
  async commandSelectItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectItem);
  }

  /**
   * Select multiple items
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Space bar
   */
  async commandSelectMultipleItems(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectMultipleItems);
  }

  /**
   * Perform a sticky mouse down or mouse up (for use when dragging an item from one location to drop in another location)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Space bar
   */
  async commandToggleStickyMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleStickyMouse);
  }

  /**
   * Click the item under the mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Space bar-Space bar
   */
  async commandDoubleClick(): Promise<void> {
    return await this.keyCode(keyCodeCommands.doubleClick);
  }

  /**
   * Open or close a disclosure triangle
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-\
   */
  async commandToggleDisclosureTriangle(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleDisclosureTriangle);
  }

  /**
   * Read a row in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-R
   */
  async commandReadTableRow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRow);
  }

  /**
   * Read a column in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C-C
   */
  async commandReadTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumn);
  }

  /**
   * Read the column header in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C
   */
  async commandReadTableColumnHeader(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumnHeader);
  }

  /**
   * Read row and column numbers in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-T
   */
  async commandReadTableRowAndColumnNumbers(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRowAndColumnNumbers);
  }

  /**
   * Sort a column in a table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-|
   */
  async commandSortTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.sortTableColumn);
  }

  /**
   * Interact with scroll bars
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-S
   */
  async commandInteractWithScrollbars(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithScrollbars);
  }

  /**
   * Resize a window or an object
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-~
   */
  async commandResizeObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeObject);
  }

  /**
   * Move a window or an object
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-`
   */
  async commandMoveObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveObject);
  }

  /**
   * Move up
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   */
  async commandMoveUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveUp);
  }

  /**
   * Move down
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   */
  async commandMoveDown(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveDown);
  }

  /**
   * Move to previous
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   */
  async commandMoveToPrevious(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPrevious);
  }

  /**
   * Move to next
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   */
  async commandMoveToNext(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNext);
  }

  /**
   * Move to the top of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Home
   */
  async commandMoveToVisibleAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaTop);
  }

  /**
   * Move to the bottom of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-End
   */
  async commandMoveToVisibleAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaBottom);
  }

  /**
   * Move to the top of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Home
   */
  async commandMoveToAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaTop);
  }

  /**
   * Move to the bottom of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-End
   */
  async commandMoveToAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaBottom);
  }

  /**
   * Move to the top of a window, the first item in the Dock, or the first item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Home
   */
  async commandMoveToFirst(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirst);
  }

  /**
   * Move to the lower-right corner of a window, the last item in the Dock, or the last item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-End
   */
  async commandMoveToLast(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLast);
  }

  /**
   * Move to the front the window where the VoiceOver cursor is located and make it active
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F2
   */
  async commandMoveToFrontWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFrontWindow);
  }

  /**
   * Close the window where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F2
   */
  async commandCloseWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.closeWindow);
  }

  /**
   * Open the Item Chooser
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-I
   */
  async commandOpenItemChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openItemChooser);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-D
   */
  async commandMoveToDock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDock);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-D
   */
  async commandMoveToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDesktop);
  }

  /**
   * Move to the menu bar
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M
   */
  async commandMoveToMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToMenuBar);
  }

  /**
   * Move to the first status menu in the menu bar
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M-M
   */
  async commandMoveToFirstStatusMenuInMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstStatusMenuInMenuBar);
  }

  /**
   * Open the Spotlight menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-M-M-M
   */
  async commandOpenSpotlightMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openSpotlightMenu);
  }

  /**
   * Open a shortcut menu
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-J
   */
  async commandOpenShortcutMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openShortcutMenu);
  }

  /**
   * Jump to a linked item (for example, from a Mail message in the Inbox to its message text)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-J
   */
  async commandJumpToLinkedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLinkedItem);
  }

  /**
   * Temporarily disable or enable the cursor tracking options you selected in VoiceOver Utility. The command doesn't change the settings in VoiceOver Utility.
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F3
   */
  async commandToggleCursorTrackingOptions(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCursorTrackingOptions);
  }

  /**
   * Move VoiceOver cursor to keyboard focus
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F4
   */
  async commandMoveCursorToKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToKeyboardFocus);
  }

  /**
   * Move keyboard focus to VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F4
   */
  async commandMoveKeyboardFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveKeyboardFocusToCursor);
  }

  /**
   * Move VoiceOver cursor to mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-F5
   */
  async commandMoveCursorToMouseFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToMouseFocus);
  }

  /**
   * Move mouse cursor to VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F5
   */
  async commandMoveMouseFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveMouseFocusToCursor);
  }

  /**
   * Jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-J
   */
  async commandJumpCommand(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpCommand);
  }

  /**
   * Jump to the top edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Up Arrow
   */
  async commandJumpToTopEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopEdge);
  }

  /**
   * Jump to the right edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Right Arrow
   */
  async commandJumpToRightEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightEdge);
  }

  /**
   * Jump to the bottom edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Down Arrow
   */
  async commandJumpToBottomEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomEdge);
  }

  /**
   * Jump to the left edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Left Arrow
   */
  async commandJumpToLeftEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftEdge);
  }

  /**
   * Jump to the top visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   */
  async commandJumpToTopVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopVisibleEdge);
  }

  /**
   * Jump to the right visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   */
  async commandJumpToRightVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightVisibleEdge);
  }

  /**
   * Jump to the bottom visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   */
  async commandJumpToBottomVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomVisibleEdge);
  }

  /**
   * Jump to the left visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   */
  async commandJumpToLeftVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftVisibleEdge);
  }

  /**
   * Jump to the area that precedes a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-[
   */
  async commandJumpBeforeSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpBeforeSplitter);
  }

  /**
   * Jump to the area that follows a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-]
   */
  async commandJumpAfterSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpAfterSplitter);
  }

  /**
   * Find text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F
   */
  async commandFindText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findText);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Up Arrow
   */
  async commandNavigateUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateUp);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Right Arrow
   */
  async commandNavigateRight(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateRight);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Down Arrow
   */
  async commandNavigateDown(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateDown);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Left Arrow
   */
  async commandNavigateLeft(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateLeft);
  }

  /**
   * Toggle hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-1
   */
  async commandToggleHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot1);
  }

  /**
   * Toggle hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-2
   */
  async commandToggleHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot2);
  }

  /**
   * Toggle hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-3
   */
  async commandToggleHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot3);
  }

  /**
   * Toggle hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-4
   */
  async commandToggleHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot4);
  }

  /**
   * Toggle hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-5
   */
  async commandToggleHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot5);
  }

  /**
   * Toggle hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-6
   */
  async commandToggleHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot6);
  }

  /**
   * Toggle hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-7
   */
  async commandToggleHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot7);
  }

  /**
   * Toggle hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-8
   */
  async commandToggleHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot8);
  }

  /**
   * Toggle hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-9
   */
  async commandToggleHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot9);
  }

  /**
   * Toggle hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-0
   */
  async commandToggleHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot0);
  }

  /**
   * Jump to hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-1
   */
  async commandJumpToHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot1);
  }

  /**
   * Jump to hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-2
   */
  async commandJumpToHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot2);
  }

  /**
   * Jump to hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-3
   */
  async commandJumpToHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot3);
  }

  /**
   * Jump to hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-4
   */
  async commandJumpToHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot4);
  }

  /**
   * Jump to hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-5
   */
  async commandJumpToHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot5);
  }

  /**
   * Jump to hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-6
   */
  async commandJumpToHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot6);
  }

  /**
   * Jump to hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-7
   */
  async commandJumpToHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot7);
  }

  /**
   * Jump to hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-8
   */
  async commandJumpToHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot8);
  }

  /**
   * Jump to hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-9
   */
  async commandJumpToHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot9);
  }

  /**
   * Jump to hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-0
   */
  async commandJumpToHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot0);
  }

  /**
   * Hear a description of hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-1
   */
  async commandDescribeHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot1);
  }

  /**
   * Hear a description of hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-2
   */
  async commandDescribeHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot2);
  }

  /**
   * Hear a description of hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-3
   */
  async commandDescribeHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot3);
  }

  /**
   * Hear a description of hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-4
   */
  async commandDescribeHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot4);
  }

  /**
   * Hear a description of hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-5
   */
  async commandDescribeHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot5);
  }

  /**
   * Hear a description of hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-6
   */
  async commandDescribeHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot6);
  }

  /**
   * Hear a description of hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-7
   */
  async commandDescribeHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot7);
  }

  /**
   * Hear a description of hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-8
   */
  async commandDescribeHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot8);
  }

  /**
   * Hear a description of hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-9
   */
  async commandDescribeHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot9);
  }

  /**
   * Hear a description of hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-0
   */
  async commandDescribeHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot0);
  }

  /**
   * Monitor hot spot 1
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-1
   */
  async commandMonitorHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot1);
  }

  /**
   * Monitor hot spot 2
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-2
   */
  async commandMonitorHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot2);
  }

  /**
   * Monitor hot spot 3
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-3
   */
  async commandMonitorHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot3);
  }

  /**
   * Monitor hot spot 4
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-4
   */
  async commandMonitorHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot4);
  }

  /**
   * Monitor hot spot 5
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-5
   */
  async commandMonitorHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot5);
  }

  /**
   * Monitor hot spot 6
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-6
   */
  async commandMonitorHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot6);
  }

  /**
   * Monitor hot spot 7
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-7
   */
  async commandMonitorHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot7);
  }

  /**
   * Monitor hot spot 8
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-8
   */
  async commandMonitorHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot8);
  }

  /**
   * Monitor hot spot 9
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-9
   */
  async commandMonitorHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot9);
  }

  /**
   * Monitor hot spot 0
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-0
   */
  async commandMonitorHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot0);
  }

  /**
   * Jump back to a parent folder
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-\
   */
  async commandJumpToParentFolder(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToParentFolder);
  }

  /**
   * Hear the application summary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F1
   */
  async commandHearApplicationSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearApplicationSummary);
  }

  /**
   * Open the Application Chooser
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F1-F1
   */
  async commandOpenApplicationChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openApplicationChooser);
  }

  /**
   * Hear the window summary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F2
   */
  async commandHearWindowSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearWindowSummary);
  }

  /**
   * Open the Window Chooser 
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F2-F2
   */
  async commandOpenWindowChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWindowChooser);
  }

  /**
   * Describe the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3
   */
  async commandDescribeItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItem);
  }

  /**
   * Describe the size of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F3
   */
  async commandDescribeItemSize(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemSize);
  }

  /**
   * Describe the position of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F3-F3
   */
  async commandDescribeItemPosition(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemPosition);
  }

  /**
   * Describe the item that has the keyboard focus
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F4
   */
  async commandDescribeItemWithKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemWithKeyboardFocus);
  }

  /**
   * Describe the location of the insertion point (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F4-F4
   */
  async commandDescribeLocationOfInsertionPoint(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfInsertionPoint);
  }

  /**
   * Describe the item under the mouse cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5
   */
  async commandDescribeItemUnderMouseCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemUnderMouseCursor);
  }

  /**
   * Describe the location of the mouse in x, y coordinates (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5-F5
   */
  async commandDescribeLocationOfMouseInCoordinates(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouseInCoordinates);
  }

  /**
   * Describe the location of the mouse (from upper-left corner of window)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F5-F5-F5
   */
  async commandDescribeLocationOfMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouse);
  }

  /**
   * Describe the selected item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F6
   */
  async commandDescribeSelectedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeSelectedItem);
  }

  /**
   * Read everything in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-A
   */
  async commandReadEverythingInCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInCursor);
  }

  /**
   * Read everything visible in the window or the Dock, or on your desktop, depending on your location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-W
   */
  async commandReadEverythingInWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInWindow);
  }

  /**
   * Repeat the last spoken phrase
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Z
   */
  async commandRepeatLastSpokenPhrase(): Promise<void> {
    return await this.keyCode(keyCodeCommands.repeatLastSpokenPhrase);
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-C
   */
  async commandCopyLastSpokenPhraseToClipboard(): Promise<void> {
    return await this.keyCode(keyCodeCommands.copyLastSpokenPhraseToClipboard);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Z
   */
  async commandSaveLastSpokenPhraseToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.saveLastSpokenPhraseToDesktop);
  }

  /**
   * Find
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F
   */
  async commandFind(): Promise<void> {
    return await this.keyCode(keyCodeCommands.find);
  }

  /**
   * Find the next searched text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-G
   */
  async commandFindNextSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextSearchedText);
  }

  /**
   * Find the previous searched text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-G
   */
  async commandFindPreviousSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousSearchedText);
  }

  /**
   * Find the next list
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-X
   */
  async commandFindNextList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextList);
  }

  /**
   * Find the previous list
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-X
   */
  async commandFindPreviousList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousList);
  }

  /**
   * Find the next bold text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-B
   */
  async commandFindNextBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextBoldText);
  }

  /**
   * Find the previous bold text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-B
   */
  async commandFindPreviousBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousBoldText);
  }

  /**
   * Find the next style change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-C
   */
  async commandFindNextStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextStyleChange);
  }

  /**
   * Find the previous style change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-C
   */
  async commandFindPreviousStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousStyleChange);
  }

  /**
   * Find the next italic text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-I
   */
  async commandFindNextItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItalicText);
  }

  /**
   * Find the previous italic text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-I
   */
  async commandFindPreviousItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItalicText);
  }

  /**
   * Find the next color change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-K
   */
  async commandFindNextColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextColorChange);
  }

  /**
   * Find the previous color change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-K
   */
  async commandFindPreviousColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousColorChange);
  }

  /**
   * Find the next font change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-O
   */
  async commandFindNextFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextFontChange);
  }

  /**
   * Find the previous font change
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-O
   */
  async commandFindPreviousFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousFontChange);
  }

  /**
   * Find the next table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-T
   */
  async commandFindNextTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextTable);
  }

  /**
   * Find the previous table
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-T
   */
  async commandFindPreviousTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousTable);
  }

  /**
   * Find the next underlined text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-U
   */
  async commandFindNextUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextUnderlinedText);
  }

  /**
   * Find the previous underlined text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-U
   */
  async commandFindPreviousUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousUnderlinedText);
  }

  /**
   * Find the next control
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-J
   */
  async commandFindNextControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextControl);
  }

  /**
   * Find the previous control
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-J
   */
  async commandFindPreviousControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousControl);
  }

  /**
   * Find the next different item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-D
   */
  async commandFindNextDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextDifferentItem);
  }

  /**
   * Find the previous different item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-D
   */
  async commandFindPreviousDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousDifferentItem);
  }

  /**
   * Find the next item that's the same type as the current item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-S
   */
  async commandFindNextItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the previous item that's the same type as the current item
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-S
   */
  async commandFindPreviousItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the next graphic
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-G
   */
  async commandFindNextGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextGraphic);
  }

  /**
   * Find the previous graphic
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-G
   */
  async commandFindPreviousGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousGraphic);
  }

  /**
   * Find the next heading
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-H
   */
  async commandFindNextHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeading);
  }

  /**
   * Find the previous heading
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-H
   */
  async commandFindPreviousHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeading);
  }

  /**
   * Find the next link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-L
   */
  async commandFindNextLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextLink);
  }

  /**
   * Find the previous link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-L
   */
  async commandFindPreviousLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousLink);
  }

  /**
   * Find the next heading of the same level
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-M
   */
  async commandFindNextHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeadingOfSameLevel);
  }

  /**
   * Find the previous heading of the same level
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-M
   */
  async commandFindPreviousHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeadingOfSameLevel);
  }

  /**
   * Find the next plain text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-P
   */
  async commandFindNextPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextPlainText);
  }

  /**
   * Find the previous plain text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-P
   */
  async commandFindPreviousPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousPlainText);
  }

  /**
   * Find the next visited link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-V
   */
  async commandFindNextVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextVisitedLink);
  }

  /**
   * Find the previous visited link
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-V
   */
  async commandFindPreviousVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousVisitedLink);
  }

  /**
   * Find the next misspelled word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-E
   */
  async commandFindNextMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextMisspelledWord);
  }

  /**
   * Find the previous misspelled word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-E
   */
  async commandFindPreviousMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousMisspelledWord);
  }

  /**
   * Read all text from the VoiceOver cursor to the end of the text
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-A
   */
  async commandReadAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readAllText);
  }

  /**
   * Select all text in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-A
   */
  async commandSelectAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectAllText);
  }

  /**
   * Start and stop text selection in a text field (text selection tracking must be on)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Return
   */
  async commandToggleTextSelection(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleTextSelection);
  }

  /**
   * Speak text attributes
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-T
   */
  async commandSpeakTextAttributes(): Promise<void> {
    return await this.keyCode(keyCodeCommands.speakTextAttributes);
  }

  /**
   * Read paragraph in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-P
   */
  async commandReadParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readParagraph);
  }

  /**
   * Read next paragraph
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Page Down
   */
  async commandReadNextParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextParagraph);
  }

  /**
   * Read previous paragraph
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Page Up
   */
  async commandReadPreviousParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousParagraph);
  }

  /**
   * Read sentence in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-S
   */
  async commandReadSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readSentence);
  }

  /**
   * Read next sentence
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Page Down
   */
  async commandReadNextSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextSentence);
  }

  /**
   * Read previous sentence
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Page Up
   */
  async commandReadPreviousSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousSentence);
  }

  /**
   * Read line in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-L
   */
  async commandReadLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLine);
  }

  /**
   * Read next line
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Down Arrow
   */
  async commandReadNextLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextLine);
  }

  /**
   * Read previous line
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Up Arrow
   */
  async commandReadPreviousLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousLine);
  }

  /**
   * Read word in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W
   */
  async commandReadWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWord);
  }

  /**
   * Read word spelled in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W-W
   */
  async commandReadWordSpelled(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordSpelled);
  }

  /**
   * Read word spelled phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W-W-W
   */
  async commandReadWordPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordPhonetically);
  }

  /**
   * Read next word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Right Arrow
   */
  async commandReadNextWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextWord);
  }

  /**
   * Read previous word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Left Arrow
   */
  async commandReadPreviousWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousWord);
  }

  /**
   * Read character in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-W
   */
  async commandReadCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacter);
  }

  /**
   * Read character phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-C-C
   */
  async commandReadCharacterPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacterPhonetically);
  }

  /**
   * Read next character
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Right Arrow
   */
  async commandReadNextCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextCharacter);
  }

  /**
   * Read previous character
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Left Arrow
   */
  async commandReadPreviousCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousCharacter);
  }

  /**
   * Move to first visible word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Home
   */
  async commandMoveToFirstVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstVisibleWord);
  }

  /**
   * Move to last visible word
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-End
   */
  async commandMoveToLastVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLastVisibleWord);
  }

  /**
   * Move to beginning of text, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-Home
   */
  async commandMoveToBeginningOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToBeginningOfText);
  }

  /**
   * Move to end of text, scrolling if necessary
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-End
   */
  async commandMoveToEndOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToEndOfText);
  }

  /**
   * Reads the current word and character in the VoiceOver cursor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3
   */
  async commandReadCurrentWordAndCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCurrentWordAndCharacter);
  }

  /**
   * Reads the total number of lines and the number of visible lines in a document
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-F3-F3
   */
  async commandReadNumberOfLines(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNumberOfLines);
  }

  /**
   * Move to the next column
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Y
   */
  async commandMoveToNextColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextColumn);
  }

  /**
   * Move to the previous column
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-Y
   */
  async commandMoveToPreviousColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousColumn);
  }

  /**
   * Move to the next frame
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-F
   */
  async commandMoveToNextFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextFrame);
  }

  /**
   * Move to the previous frame
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-F
   */
  async commandMoveToPreviousFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousFrame);
  }

  /**
   * Move to the next auto web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-N
   */
  async commandMoveToNextAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextAutoWebSpot);
  }

  /**
   * Move to the previous auto web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-N
   */
  async commandMoveToPreviousAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousAutoWebSpot);
  }

  /**
   * Move to the next web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-]
   */
  async commandMoveToNextWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextWebSpot);
  }

  /**
   * Move to the previous web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-[
   */
  async commandMoveToPreviousWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousWebSpot);
  }

  /**
   * Open the Web Item rotor
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-U
   */
  async commandOpenWebItemRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWebItemRotor);
  }

  /**
   * Read from the beginning of a webpage to the current location
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-B
   */
  async commandReadFromBeginningToCurrent(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readFromBeginningToCurrent);
  }

  /**
   * Read a link address (URL)
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-U
   */
  async commandReadLinkAddress(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLinkAddress);
  }

  /**
   * Read webpage statistics
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Shift-I
   */
  async commandReadWebpageStatistics(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWebpageStatistics);
  }

  /**
   * Remove a web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-{
   */
  async commandRemoveWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.removeWebSpot);
  }

  /**
   * Set a web spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-}
   */
  async commandSetWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setWebSpot);
  }

  /**
   * Set the sweet spot
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-Command-Shift-}-}
   */
  async commandSetSweetSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setSweetSpot);
  }

  /**
   * Turn the grouping of items within a table on or off
   *
   * Uses VoiceOver keycode command
   *
   * Representation: VO-=
   */
  async commandToggleGroupingItemsWithinTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleGroupingItemsWithinTable);
  }

  /**
   * Actions
   *
   * Uses VoiceOver Commander
   */
  async commanderActions(): Promise<void> {
    return await this.performCommand(CommanderCommands.ACTIONS);
  }

  /**
   * Add pronunciation
   *
   * Uses VoiceOver Commander
   */
  async commanderAddPronunciation(): Promise<void> {
    return await this.performCommand(CommanderCommands.ADD_PRONUNCIATION);
  }

  /**
   * Bring window to front
   *
   * Uses VoiceOver Commander
   */
  async commanderBringWindowToFront(): Promise<void> {
    return await this.performCommand(CommanderCommands.BRING_WINDOW_TO_FRONT);
  }

  /**
   * Click mouse
   *
   * Uses VoiceOver Commander
   */
  async commanderClickMouse(): Promise<void> {
    return await this.performCommand(CommanderCommands.CLICK_MOUSE);
  }

  /**
   * Close window
   *
   * Uses VoiceOver Commander
   */
  async commanderCloseWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.CLOSE_WINDOW);
  }

  /**
   * Describe position of window
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribePositionOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_POSITION_OF_WINDOW);
  }

  /**
   * Describe size of window
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeSizeOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_SIZE_OF_WINDOW);
  }

  /**
   * Double click mouse
   *
   * Uses VoiceOver Commander
   */
  async commanderDoubleClickMouse(): Promise<void> {
    return await this.performCommand(CommanderCommands.DOUBLE_CLICK_MOUSE);
  }

  /**
   * Drop marked item after chosen hot spot
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemAfterChosenHotSpot(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_AFTER_CHOSEN_HOT_SPOT);
  }

  /**
   * Drop marked item after voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemAfterVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_AFTER_VOICEOVER_CURSOR);
  }

  /**
   * Drop marked item before chosen hot spot
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemBeforeChosenHotSpot(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_BEFORE_CHOSEN_HOT_SPOT);
  }

  /**
   * Drop marked item before voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemBeforeVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_BEFORE_VOICEOVER_CURSOR);
  }

  /**
   * Drop marked item on chosen hot spot
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemOnChosenHotSpot(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_ON_CHOSEN_HOT_SPOT);
  }

  /**
   * Drop marked item on voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDropMarkedItemOnVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DROP_MARKED_ITEM_ON_VOICEOVER_CURSOR);
  }

  /**
   * Escape
   *
   * Uses VoiceOver Commander
   */
  async commanderEscape(): Promise<void> {
    return await this.performCommand(CommanderCommands.ESCAPE);
  }

  /**
   * Fast-forward
   *
   * Uses VoiceOver Commander
   */
  async commanderFastForward(): Promise<void> {
    return await this.performCommand(CommanderCommands.FAST_FORWARD);
  }

  /**
   * Ignore next keypress
   *
   * Uses VoiceOver Commander
   */
  async commanderIgnoreNextKeypress(): Promise<void> {
    return await this.performCommand(CommanderCommands.IGNORE_NEXT_KEYPRESS);
  }

  /**
   * Interact with scroll bar
   *
   * Uses VoiceOver Commander
   */
  async commanderInteractWithScrollBar(): Promise<void> {
    return await this.performCommand(CommanderCommands.INTERACT_WITH_SCROLL_BAR);
  }

  /**
   * Item chooser
   *
   * Uses VoiceOver Commander
   */
  async commanderItemChooser(): Promise<void> {
    return await this.performCommand(CommanderCommands.ITEM_CHOOSER);
  }

  /**
   * Keyboard help
   *
   * Uses VoiceOver Commander
   */
  async commanderKeyboardHelp(): Promise<void> {
    return await this.performCommand(CommanderCommands.KEYBOARD_HELP);
  }

  /**
   * Label item
   *
   * Uses VoiceOver Commander
   */
  async commanderLabelItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.LABEL_ITEM);
  }

  /**
   * Magic tap
   *
   * Uses VoiceOver Commander
   */
  async commanderMagicTap(): Promise<void> {
    return await this.performCommand(CommanderCommands.MAGIC_TAP);
  }

  /**
   * Mark item to drag and drop
   *
   * Uses VoiceOver Commander
   */
  async commanderMarkItemToDragAndDrop(): Promise<void> {
    return await this.performCommand(CommanderCommands.MARK_ITEM_TO_DRAG_AND_DROP);
  }

  /**
   * More content
   *
   * Uses VoiceOver Commander
   */
  async commanderMoreContent(): Promise<void> {
    return await this.performCommand(CommanderCommands.MORE_CONTENT);
  }

  /**
   * Mouse down
   *
   * Uses VoiceOver Commander
   */
  async commanderMouseDown(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOUSE_DOWN);
  }

  /**
   * Mouse up
   *
   * Uses VoiceOver Commander
   */
  async commanderMouseUp(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOUSE_UP);
  }

  /**
   * Move down
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveDown(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_DOWN);
  }

  /**
   * Move left
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveLeft(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_LEFT);
  }

  /**
   * Move right
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveRight(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_RIGHT);
  }

  /**
   * Move up
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveUp(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_UP);
  }

  /**
   * Open activity chooser
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenActivityChooser(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_ACTIVITY_CHOOSER);
  }

  /**
   * Open application chooser
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenApplicationChooser(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_APPLICATION_CHOOSER);
  }

  /**
   * Open commands menu
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenCommandsMenu(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_COMMANDS_MENU);
  }

  /**
   * Open control center
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenControlCenter(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_CONTROL_CENTER);
  }

  /**
   * Open next speech attribute guide
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenNextSpeechAttributeGuide(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_NEXT_SPEECH_ATTRIBUTE_GUIDE);
  }

  /**
   * Open notification centre
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenNotificationCentre(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_NOTIFICATION_CENTRE);
  }

  /**
   * Open previous speech attribute guide
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenPreviousSpeechAttributeGuide(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_PREVIOUS_SPEECH_ATTRIBUTE_GUIDE);
  }

  /**
   * Open quick start tutorial
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenQuickStartTutorial(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_QUICK_START_TUTORIAL);
  }

  /**
   * Open shortcut menu
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenShortcutMenu(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_SHORTCUT_MENU);
  }

  /**
   * Open the announcement history menu
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenTheAnnouncementHistoryMenu(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_THE_ANNOUNCEMENT_HISTORY_MENU);
  }

  /**
   * Open the notifications menu
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenTheNotificationsMenu(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_THE_NOTIFICATIONS_MENU);
  }

  /**
   * Open verbosity rotor
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenVerbosityRotor(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VERBOSITY_ROTOR);
  }

  /**
   * Open voiceover help menu
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenVoiceoverHelpMenu(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VOICEOVER_HELP_MENU);
  }

  /**
   * Open voiceover utility
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenVoiceoverUtility(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_VOICEOVER_UTILITY);
  }

  /**
   * Open window chooser
   *
   * Uses VoiceOver Commander
   */
  async commanderOpenWindowChooser(): Promise<void> {
    return await this.performCommand(CommanderCommands.OPEN_WINDOW_CHOOSER);
  }

  /**
   * Pause or resume speaking
   *
   * Uses VoiceOver Commander
   */
  async commanderPauseOrResumeSpeaking(): Promise<void> {
    return await this.performCommand(CommanderCommands.PAUSE_OR_RESUME_SPEAKING);
  }

  /**
   * Perform action for item
   *
   * Uses VoiceOver Commander
   */
  async commanderPerformActionForItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.PERFORM_ACTION_FOR_ITEM);
  }

  /**
   * Previous activity
   *
   * Uses VoiceOver Commander
   */
  async commanderPreviousActivity(): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_ACTIVITY);
  }

  /**
   * Read contents of voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderReadContentsOfVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CONTENTS_OF_VOICEOVER_CURSOR);
  }

  /**
   * Read contents of window
   *
   * Uses VoiceOver Commander
   */
  async commanderReadContentsOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CONTENTS_OF_WINDOW);
  }

  /**
   * Read current item alphabetically
   *
   * Uses VoiceOver Commander
   */
  async commanderReadCurrentItemAlphabetically(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CURRENT_ITEM_ALPHABETICALLY);
  }

  /**
   * Read current item phonetically
   *
   * Uses VoiceOver Commander
   */
  async commanderReadCurrentItemPhonetically(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_CURRENT_ITEM_PHONETICALLY);
  }

  /**
   * Read help tag for item
   *
   * Uses VoiceOver Commander
   */
  async commanderReadHelpTagForItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_HELP_TAG_FOR_ITEM);
  }

  /**
   * Read image description for item
   *
   * Uses VoiceOver Commander
   */
  async commanderReadImageDescriptionForItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_IMAGE_DESCRIPTION_FOR_ITEM);
  }

  /**
   * Read selected text or item
   *
   * Uses VoiceOver Commander
   */
  async commanderReadSelectedTextOrItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_SELECTED_TEXT_OR_ITEM);
  }

  /**
   * Read visible text
   *
   * Uses VoiceOver Commander
   */
  async commanderReadVisibleText(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_VISIBLE_TEXT);
  }

  /**
   * Read voiceover hint
   *
   * Uses VoiceOver Commander
   */
  async commanderReadVoiceoverHint(): Promise<void> {
    return await this.performCommand(CommanderCommands.READ_VOICEOVER_HINT);
  }

  /**
   * Remove from window spots
   *
   * Uses VoiceOver Commander
   */
  async commanderRemoveFromWindowSpots(): Promise<void> {
    return await this.performCommand(CommanderCommands.REMOVE_FROM_WINDOW_SPOTS);
  }

  /**
   * Rewind
   *
   * Uses VoiceOver Commander
   */
  async commanderRewind(): Promise<void> {
    return await this.performCommand(CommanderCommands.REWIND);
  }

  /**
   * Right click mouse
   *
   * Uses VoiceOver Commander
   */
  async commanderRightClickMouse(): Promise<void> {
    return await this.performCommand(CommanderCommands.RIGHT_CLICK_MOUSE);
  }

  /**
   * Rotor
   *
   * Uses VoiceOver Commander
   */
  async commanderRotor(): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTOR);
  }

  /**
   * Select item
   *
   * Uses VoiceOver Commander
   */
  async commanderSelectItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_ITEM);
  }

  /**
   * Select next option down in speech attribute guide
   *
   * Uses VoiceOver Commander
   */
  async commanderSelectNextOptionDownInSpeechAttributeGuide(): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_NEXT_OPTION_DOWN_IN_SPEECH_ATTRIBUTE_GUIDE);
  }

  /**
   * Select next option up in speech attribute guide
   *
   * Uses VoiceOver Commander
   */
  async commanderSelectNextOptionUpInSpeechAttributeGuide(): Promise<void> {
    return await this.performCommand(CommanderCommands.SELECT_NEXT_OPTION_UP_IN_SPEECH_ATTRIBUTE_GUIDE);
  }

  /**
   * Set as a window spot
   *
   * Uses VoiceOver Commander
   */
  async commanderSetAsAWindowSpot(): Promise<void> {
    return await this.performCommand(CommanderCommands.SET_AS_A_WINDOW_SPOT);
  }

  /**
   * Set the sweet spot
   *
   * Uses VoiceOver Commander
   */
  async commanderSetTheSweetSpot(): Promise<void> {
    return await this.performCommand(CommanderCommands.SET_THE_SWEET_SPOT);
  }

  /**
   * Start interacting with item
   *
   * Uses VoiceOver Commander
   */
  async commanderStartInteractingWithItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.START_INTERACTING_WITH_ITEM);
  }

  /**
   * Stop interacting with item
   *
   * Uses VoiceOver Commander
   */
  async commanderStopInteractingWithItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.STOP_INTERACTING_WITH_ITEM);
  }

  /**
   * Toggle cursor tracking on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleCursorTrackingOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_CURSOR_TRACKING_ON_OR_OFF);
  }

  /**
   * Toggle disclosure triangle open or closed
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleDisclosureTriangleOpenOrClosed(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_DISCLOSURE_TRIANGLE_OPEN_OR_CLOSED);
  }

  /**
   * Toggle keyboard commander on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleKeyboardCommanderOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_KEYBOARD_COMMANDER_ON_OR_OFF);
  }

  /**
   * Toggle multiple selection on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleMultipleSelectionOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_MULTIPLE_SELECTION_ON_OR_OFF);
  }

  /**
   * Toggle numpad commander on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleNumpadCommanderOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_NUMPAD_COMMANDER_ON_OR_OFF);
  }

  /**
   * Toggle quick nav on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleQuickNavOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_QUICK_NAV_ON_OR_OFF);
  }

  /**
   * Toggle screen curtain on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleScreenCurtainOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_SCREEN_CURTAIN_ON_OR_OFF);
  }

  /**
   * Toggle single-key quick nav on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleSingleKeyQuickNavOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_SINGLE_KEY_QUICK_NAV_ON_OR_OFF);
  }

  /**
   * Toggle the vo modifier lock on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleTheVoModifierLockOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_THE_VO_MODIFIER_LOCK_ON_OR_OFF);
  }

  /**
   * Toggle trackpad commander on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleTrackpadCommanderOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_TRACKPAD_COMMANDER_ON_OR_OFF);
  }

  /**
   * User guide
   *
   * Uses VoiceOver Commander
   */
  async commanderUserGuide(): Promise<void> {
    return await this.performCommand(CommanderCommands.USER_GUIDE);
  }

  /**
   * Describe item in mouse pointer
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeItemInMousePointer(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_IN_MOUSE_POINTER);
  }

  /**
   * Describe item in voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeItemInVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_IN_VOICEOVER_CURSOR);
  }

  /**
   * Describe item with keyboard focus
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeItemWithKeyboardFocus(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_ITEM_WITH_KEYBOARD_FOCUS);
  }

  /**
   * Describe mouse pointer location (from top left of screen)
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeMousePointerLocationFromTopLeftOfScreen(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_SCREEN);
  }

  /**
   * Describe mouse pointer location (from top left of window)
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeMousePointerLocationFromTopLeftOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_WINDOW);
  }

  /**
   * Describe open applications
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeOpenApplications(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_OPEN_APPLICATIONS);
  }

  /**
   * Describe position of item in voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribePositionOfItemInVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_POSITION_OF_ITEM_IN_VOICEOVER_CURSOR);
  }

  /**
   * Describe size of item in voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeSizeOfItemInVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_SIZE_OF_ITEM_IN_VOICEOVER_CURSOR);
  }

  /**
   * Describe window
   *
   * Uses VoiceOver Commander
   */
  async commanderDescribeWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.DESCRIBE_WINDOW);
  }

  /**
   * Go down one page
   *
   * Uses VoiceOver Commander
   */
  async commanderGoDownOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_DOWN_ONE_PAGE);
  }

  /**
   * Go left a bit
   *
   * Uses VoiceOver Commander
   */
  async commanderGoLeftABit(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_LEFT_A_BIT);
  }

  /**
   * Go left one page
   *
   * Uses VoiceOver Commander
   */
  async commanderGoLeftOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_LEFT_ONE_PAGE);
  }

  /**
   * Go right a bit
   *
   * Uses VoiceOver Commander
   */
  async commanderGoRightABit(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_RIGHT_A_BIT);
  }

  /**
   * Go right one page
   *
   * Uses VoiceOver Commander
   */
  async commanderGoRightOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_RIGHT_ONE_PAGE);
  }

  /**
   * Go to beginning
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToBeginning(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_BEGINNING);
  }

  /**
   * Go to bottom of window
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToBottomOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_BOTTOM_OF_WINDOW);
  }

  /**
   * Go to desktop
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToDesktop(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_DESKTOP);
  }

  /**
   * Go to dock
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToDock(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_DOCK);
  }

  /**
   * Go to end
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToEnd(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_END);
  }

  /**
   * Go to linked item
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToLinkedItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_LINKED_ITEM);
  }

  /**
   * Go to menu bar
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToMenuBar(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_MENU_BAR);
  }

  /**
   * Go to pop-up item
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToPopUpItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_POP_UP_ITEM);
  }

  /**
   * Go to status menus
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToStatusMenus(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_STATUS_MENUS);
  }

  /**
   * Go to top of window
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToTopOfWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_TOP_OF_WINDOW);
  }

  /**
   * Go to visible beginning
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToVisibleBeginning(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_VISIBLE_BEGINNING);
  }

  /**
   * Go to visible end
   *
   * Uses VoiceOver Commander
   */
  async commanderGoToVisibleEnd(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_TO_VISIBLE_END);
  }

  /**
   * Go up one page
   *
   * Uses VoiceOver Commander
   */
  async commanderGoUpOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.GO_UP_ONE_PAGE);
  }

  /**
   * Move down in rotor
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveDownInRotor(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_DOWN_IN_ROTOR);
  }

  /**
   * Move keyboard focus to voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveKeyboardFocusToVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_KEYBOARD_FOCUS_TO_VOICEOVER_CURSOR);
  }

  /**
   * Move mouse pointer to voiceover cursor
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveMousePointerToVoiceoverCursor(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_MOUSE_POINTER_TO_VOICEOVER_CURSOR);
  }

  /**
   * Move to area after splitter
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveToAreaAfterSplitter(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_AREA_AFTER_SPLITTER);
  }

  /**
   * Move to area before splitter
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveToAreaBeforeSplitter(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_AREA_BEFORE_SPLITTER);
  }

  /**
   * Move to next section
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveToNextSection(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_NEXT_SECTION);
  }

  /**
   * Move to previous section
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveToPreviousSection(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_TO_PREVIOUS_SECTION);
  }

  /**
   * Move up in rotor
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveUpInRotor(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_UP_IN_ROTOR);
  }

  /**
   * Move voiceover cursor to keyboard focus
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveVoiceoverCursorToKeyboardFocus(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_VOICEOVER_CURSOR_TO_KEYBOARD_FOCUS);
  }

  /**
   * Move voiceover cursor to mouse pointer
   *
   * Uses VoiceOver Commander
   */
  async commanderMoveVoiceoverCursorToMousePointer(): Promise<void> {
    return await this.performCommand(CommanderCommands.MOVE_VOICEOVER_CURSOR_TO_MOUSE_POINTER);
  }

  /**
   * Next content
   *
   * Uses VoiceOver Commander
   */
  async commanderNextContent(): Promise<void> {
    return await this.performCommand(CommanderCommands.NEXT_CONTENT);
  }

  /**
   * Next rotor item
   *
   * Uses VoiceOver Commander
   */
  async commanderNextRotorItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.NEXT_ROTOR_ITEM);
  }

  /**
   * Previous content
   *
   * Uses VoiceOver Commander
   */
  async commanderPreviousContent(): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_CONTENT);
  }

  /**
   * Previous rotor item
   *
   * Uses VoiceOver Commander
   */
  async commanderPreviousRotorItem(): Promise<void> {
    return await this.performCommand(CommanderCommands.PREVIOUS_ROTO_ITEM);
  }

  /**
   * Rotate left
   *
   * Uses VoiceOver Commander
   */
  async commanderRotateLeft(): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTATE_LEFT);
  }

  /**
   * Rotate right
   *
   * Uses VoiceOver Commander
   */
  async commanderRotateRight(): Promise<void> {
    return await this.performCommand(CommanderCommands.ROTATE_RIGHT);
  }

  /**
   * Scroll down one page
   *
   * Uses VoiceOver Commander
   */
  async commanderScrollDownOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_DOWN_ONE_PAGE);
  }

  /**
   * Scroll left one page
   *
   * Uses VoiceOver Commander
   */
  async commanderScrollLeftOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_LEFT_ONE_PAGE);
  }

  /**
   * Scroll right one page
   *
   * Uses VoiceOver Commander
   */
  async commanderScrollRightOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_RIGHT_ONE_PAGE);
  }

  /**
   * Scroll up one page
   *
   * Uses VoiceOver Commander
   */
  async commanderScrollUpOnePage(): Promise<void> {
    return await this.performCommand(CommanderCommands.SCROLL_UP_ONE_PAGE);
  }

  /**
   * Speak current page in scroll area
   *
   * Uses VoiceOver Commander
   */
  async commanderSpeakCurrentPageInScrollArea(): Promise<void> {
    return await this.performCommand(CommanderCommands.SPEAK_CURRENT_PAGE_IN_SCROLL_AREA);
  }

  /**
   * Switch window
   *
   * Uses VoiceOver Commander
   */
  async commanderSwitchWindow(): Promise<void> {
    return await this.performCommand(CommanderCommands.SWITCH_WINDOW);
  }

  /**
   * Toggle voiceover cursor follows mouse on or off
   *
   * Uses VoiceOver Commander
   */
  async commanderToggleVoiceoverCursorFollowsMouseOnOrOff(): Promise<void> {
    return await this.performCommand(CommanderCommands.TOGGLE_VOICEOVER_CURSOR_FOLLOWS_MOUSE_ON_OR_OFF);
  }
}
