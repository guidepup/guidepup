// This file was automatically generated.
// Manual changes will not be preserved.

import { VoiceOverBase } from "./VoiceOverBase";
import { keyCodeCommands } from "./keyCodeCommands";
import { CommanderCommands } from "./CommanderCommands";

export class VoiceOver extends VoiceOverBase {
  /**
   * Lock and unlock the VO (Control and Option) keys
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-;
   */
  async gestureToggleLock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleLock);
  }

  /**
   * Open VoiceOver Utility
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F8
   */
  async gestureOpenVoiceOverUtility(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverUtility);
  }

  /**
   * Open the VoiceOver Help menu
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-H
   */
  async gestureOpenVoiceOverHelpMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverHelpMenu);
  }

  /**
   * Open the VoiceOver Quick Start
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F8
   */
  async gestureOpenVoiceOverQuickStart(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverQuickStart);
  }

  /**
   * Open VoiceOver online help
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-/
   */
  async gestureOpenVoiceOverOnlineHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverOnlineHelp);
  }

  /**
   * Start keyboard help
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-K
   */
  async gestureStartKeyboardHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.startKeyboardHelp);
  }

  /**
   * Hear a description of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-N
   */
  async gestureHearItemDescription(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearItemDescription);
  }

  /**
   * Open the Commands menu
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-H-H
   */
  async gestureOpenCommandsMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openCommandsMenu);
  }

  /**
   * Open the Find menu
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F
   */
  async gestureOpenFindMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openFindMenu);
  }

  /**
   * Close a menu or rotor, stop an action, or exit a mode
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: Escape
   */
  async gestureStopAction(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopAction);
  }

  /**
   * Tell VoiceOver to ignore the next key combination you press
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Tab
   */
  async gestureIgnoreNextKeyCombination(): Promise<void> {
    return await this.keyCode(keyCodeCommands.ignoreNextKeyCombination);
  }

  /**
   * Open the verbosity rotor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-V
   */
  async gestureOpenVerbosityRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVerbosityRotor);
  }

  /**
   * Magnify the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-}
   */
  async gestureMagnifyItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.magnifyItem);
  }

  /**
   * Shrink the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-{
   */
  async gestureShrinkItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.shrinkItem);
  }

  /**
   * Temporarily hide or show the VoiceOver cursor and the caption or braille panels
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F11
   */
  async gestureToggleVoiceOverCursorAndPanels(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleVoiceOverCursorAndPanels);
  }

  /**
   * Hide or show the caption panel only
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F10
   */
  async gestureToggleCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCaptionPanel);
  }

  /**
   * Resize or move the caption panel
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F10
   */
  async gestureResizeOrMoveCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveCaptionPanel);
  }

  /**
   * Hide or show the braille panel only
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F9
   */
  async gestureToggleBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleBraillePanel);
  }

  /**
   * Resize or move the braille panel
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F9
   */
  async gestureResizeOrMoveBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveBraillePanel);
  }

  /**
   * Tile visuals (dim the screen, highlight the caption or braille panel, and show the item in the VoiceOver cursor in the center of the screen).
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F10
   */
  async gestureTileVisuals(): Promise<void> {
    return await this.keyCode(keyCodeCommands.tileVisuals);
  }

  /**
   * Enable or disable the Keyboard Commander
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-K
   */
  async gestureToggleKeyboardCommander(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleKeyboardCommander);
  }

  /**
   * Turn the screen black (screen curtain)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F11
   */
  async gestureToggleScreenCurtain(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleScreenCurtain);
  }

  /**
   * Press and release mouse button
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Space bar
   */
  async gestureClick(): Promise<void> {
    return await this.keyCode(keyCodeCommands.click);
  }

  /**
   * Interact with an item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Down Arrow
   */
  async gestureInteractWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithItem);
  }

  /**
   * Stop interacting with an item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Up Arrow
   */
  async gestureStopInteractingWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopInteractingWithItem);
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Space bar
   */
  async gesturePerformDefaultActionForItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.performDefaultActionForItem);
  }

  /**
   * Select a menu or list item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Return
   */
  async gestureSelectItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectItem);
  }

  /**
   * Select multiple items
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Space bar
   */
  async gestureSelectMultipleItems(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectMultipleItems);
  }

  /**
   * Perform a sticky mouse down or mouse up (for use when dragging an item from one location to drop in another location)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Space bar
   */
  async gestureToggleStickyMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleStickyMouse);
  }

  /**
   * Click the item under the mouse cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Space bar-Space bar
   */
  async gestureDoubleClick(): Promise<void> {
    return await this.keyCode(keyCodeCommands.doubleClick);
  }

  /**
   * Open or close a disclosure triangle
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-\
   */
  async gestureToggleDisclosureTriangle(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleDisclosureTriangle);
  }

  /**
   * Read a row in a table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-R
   */
  async gestureReadTableRow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRow);
  }

  /**
   * Read a column in a table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-C-C
   */
  async gestureReadTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumn);
  }

  /**
   * Read the column header in a table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-C
   */
  async gestureReadTableColumnHeader(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumnHeader);
  }

  /**
   * Read row and column numbers in a table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-T
   */
  async gestureReadTableRowAndColumnNumbers(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRowAndColumnNumbers);
  }

  /**
   * Sort a column in a table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-|
   */
  async gestureSortTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.sortTableColumn);
  }

  /**
   * Interact with scroll bars
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-S
   */
  async gestureInteractWithScrollbars(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithScrollbars);
  }

  /**
   * Resize a window or an object
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-~
   */
  async gestureResizeObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeObject);
  }

  /**
   * Move a window or an object
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-`
   */
  async gestureMoveObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveObject);
  }

  /**
   * Move up
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Up Arrow
   */
  async gestureMoveUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveUp);
  }

  /**
   * Move down
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Down Arrow
   */
  async gestureMoveDown(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveDown);
  }

  /**
   * Move to previous
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Left Arrow
   */
  async gestureMoveToPrevious(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPrevious);
  }

  /**
   * Move to next
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Right Arrow
   */
  async gestureMoveToNext(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNext);
  }

  /**
   * Move to the top of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Home
   */
  async gestureMoveToVisibleAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaTop);
  }

  /**
   * Move to the bottom of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-End
   */
  async gestureMoveToVisibleAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaBottom);
  }

  /**
   * Move to the top of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Home
   */
  async gestureMoveToAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaTop);
  }

  /**
   * Move to the bottom of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-End
   */
  async gestureMoveToAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaBottom);
  }

  /**
   * Move to the top of a window, the first item in the Dock, or the first item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Home
   */
  async gestureMoveToFirst(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirst);
  }

  /**
   * Move to the lower-right corner of a window, the last item in the Dock, or the last item on your desktop, depending on your location
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-End
   */
  async gestureMoveToLast(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLast);
  }

  /**
   * Move to the front the window where the VoiceOver cursor is located and make it active
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F2
   */
  async gestureMoveToFrontWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFrontWindow);
  }

  /**
   * Close the window where the VoiceOver cursor is located
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F2
   */
  async gestureCloseWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.closeWindow);
  }

  /**
   * Open the Item Chooser
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-I
   */
  async gestureOpenItemChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openItemChooser);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-D
   */
  async gestureMoveToDock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDock);
  }

  /**
   * Move to the desktop
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-D
   */
  async gestureMoveToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDesktop);
  }

  /**
   * Move to the menu bar
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-M
   */
  async gestureMoveToMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToMenuBar);
  }

  /**
   * Move to the first status menu in the menu bar
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-M-M
   */
  async gestureMoveToFirstStatusMenuInMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstStatusMenuInMenuBar);
  }

  /**
   * Open the Spotlight menu
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-M-M-M
   */
  async gestureOpenSpotlightMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openSpotlightMenu);
  }

  /**
   * Open a shortcut menu
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-J
   */
  async gestureOpenShortcutMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openShortcutMenu);
  }

  /**
   * Jump to a linked item (for example, from a Mail message in the Inbox to its message text)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-J
   */
  async gestureJumpToLinkedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLinkedItem);
  }

  /**
   * Temporarily disable or enable the cursor tracking options you selected in VoiceOver Utility. The command doesn't change the settings in VoiceOver Utility.
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F3
   */
  async gestureToggleCursorTrackingOptions(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCursorTrackingOptions);
  }

  /**
   * Move VoiceOver cursor to keyboard focus
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F4
   */
  async gestureMoveCursorToKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToKeyboardFocus);
  }

  /**
   * Move keyboard focus to VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F4
   */
  async gestureMoveKeyboardFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveKeyboardFocusToCursor);
  }

  /**
   * Move VoiceOver cursor to mouse cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-F5
   */
  async gestureMoveCursorToMouseFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToMouseFocus);
  }

  /**
   * Move mouse cursor to VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F5
   */
  async gestureMoveMouseFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveMouseFocusToCursor);
  }

  /**
   * Jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-J
   */
  async gestureJumpCommand(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpCommand);
  }

  /**
   * Jump to the top edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Up Arrow
   */
  async gestureJumpToTopEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopEdge);
  }

  /**
   * Jump to the right edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Right Arrow
   */
  async gestureJumpToRightEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightEdge);
  }

  /**
   * Jump to the bottom edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Down Arrow
   */
  async gestureJumpToBottomEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomEdge);
  }

  /**
   * Jump to the left edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Left Arrow
   */
  async gestureJumpToLeftEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftEdge);
  }

  /**
   * Jump to the top visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Up Arrow
   */
  async gestureJumpToTopVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopVisibleEdge);
  }

  /**
   * Jump to the right visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Right Arrow
   */
  async gestureJumpToRightVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightVisibleEdge);
  }

  /**
   * Jump to the bottom visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Down Arrow
   */
  async gestureJumpToBottomVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomVisibleEdge);
  }

  /**
   * Jump to the left visible edge of an area. Used with jump command
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Left Arrow
   */
  async gestureJumpToLeftVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftVisibleEdge);
  }

  /**
   * Jump to the area that precedes a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-[
   */
  async gestureJumpBeforeSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpBeforeSplitter);
  }

  /**
   * Jump to the area that follows a horizontal or vertical splitter
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-]
   */
  async gestureJumpAfterSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpAfterSplitter);
  }

  /**
   * Find text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F
   */
  async gestureFindText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findText);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Up Arrow
   */
  async gestureNavigateUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateUp);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Right Arrow
   */
  async gestureNavigateRight(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateRight);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Down Arrow
   */
  async gestureNavigateBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateBottom);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Left Arrow
   */
  async gestureNavigateLeft(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateLeft);
  }

  /**
   * Toggle hot spot 1
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-1
   */
  async gestureToggleHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot1);
  }

  /**
   * Toggle hot spot 2
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-2
   */
  async gestureToggleHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot2);
  }

  /**
   * Toggle hot spot 3
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-3
   */
  async gestureToggleHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot3);
  }

  /**
   * Toggle hot spot 4
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-4
   */
  async gestureToggleHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot4);
  }

  /**
   * Toggle hot spot 5
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-5
   */
  async gestureToggleHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot5);
  }

  /**
   * Toggle hot spot 6
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-6
   */
  async gestureToggleHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot6);
  }

  /**
   * Toggle hot spot 7
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-7
   */
  async gestureToggleHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot7);
  }

  /**
   * Toggle hot spot 8
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-8
   */
  async gestureToggleHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot8);
  }

  /**
   * Toggle hot spot 9
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-9
   */
  async gestureToggleHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot9);
  }

  /**
   * Toggle hot spot 0
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-0
   */
  async gestureToggleHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot0);
  }

  /**
   * Jump to hot spot 1
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-1
   */
  async gestureJumpToHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot1);
  }

  /**
   * Jump to hot spot 2
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-2
   */
  async gestureJumpToHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot2);
  }

  /**
   * Jump to hot spot 3
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-3
   */
  async gestureJumpToHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot3);
  }

  /**
   * Jump to hot spot 4
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-4
   */
  async gestureJumpToHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot4);
  }

  /**
   * Jump to hot spot 5
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-5
   */
  async gestureJumpToHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot5);
  }

  /**
   * Jump to hot spot 6
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-6
   */
  async gestureJumpToHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot6);
  }

  /**
   * Jump to hot spot 7
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-7
   */
  async gestureJumpToHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot7);
  }

  /**
   * Jump to hot spot 8
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-8
   */
  async gestureJumpToHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot8);
  }

  /**
   * Jump to hot spot 9
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-9
   */
  async gestureJumpToHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot9);
  }

  /**
   * Jump to hot spot 0
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-0
   */
  async gestureJumpToHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot0);
  }

  /**
   * Hear a description of hot spot 1
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-1
   */
  async gestureDescribeHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot1);
  }

  /**
   * Hear a description of hot spot 2
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-2
   */
  async gestureDescribeHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot2);
  }

  /**
   * Hear a description of hot spot 3
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-3
   */
  async gestureDescribeHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot3);
  }

  /**
   * Hear a description of hot spot 4
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-4
   */
  async gestureDescribeHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot4);
  }

  /**
   * Hear a description of hot spot 5
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-5
   */
  async gestureDescribeHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot5);
  }

  /**
   * Hear a description of hot spot 6
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-6
   */
  async gestureDescribeHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot6);
  }

  /**
   * Hear a description of hot spot 7
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-7
   */
  async gestureDescribeHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot7);
  }

  /**
   * Hear a description of hot spot 8
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-8
   */
  async gestureDescribeHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot8);
  }

  /**
   * Hear a description of hot spot 9
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-9
   */
  async gestureDescribeHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot9);
  }

  /**
   * Hear a description of hot spot 0
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-0
   */
  async gestureDescribeHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot0);
  }

  /**
   * Monitor hot spot 1
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-1
   */
  async gestureMonitorHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot1);
  }

  /**
   * Monitor hot spot 2
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-2
   */
  async gestureMonitorHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot2);
  }

  /**
   * Monitor hot spot 3
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-3
   */
  async gestureMonitorHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot3);
  }

  /**
   * Monitor hot spot 4
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-4
   */
  async gestureMonitorHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot4);
  }

  /**
   * Monitor hot spot 5
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-5
   */
  async gestureMonitorHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot5);
  }

  /**
   * Monitor hot spot 6
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-6
   */
  async gestureMonitorHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot6);
  }

  /**
   * Monitor hot spot 7
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-7
   */
  async gestureMonitorHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot7);
  }

  /**
   * Monitor hot spot 8
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-8
   */
  async gestureMonitorHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot8);
  }

  /**
   * Monitor hot spot 9
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-9
   */
  async gestureMonitorHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot9);
  }

  /**
   * Monitor hot spot 0
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-0
   */
  async gestureMonitorHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot0);
  }

  /**
   * Jump back to a parent folder
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-\
   */
  async gestureJumpToParentFolder(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToParentFolder);
  }

  /**
   * Hear the application summary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F1
   */
  async gestureHearApplicationSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearApplicationSummary);
  }

  /**
   * Open the Application Chooser
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F1-F1
   */
  async gestureOpenApplicationChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openApplicationChooser);
  }

  /**
   * Hear the window summary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F2
   */
  async gestureHearWindowSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearWindowSummary);
  }

  /**
   * Open the Window Chooser 
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F2-F2
   */
  async gestureOpenWindowChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWindowChooser);
  }

  /**
   * Describe the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F3
   */
  async gestureDescribeItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItem);
  }

  /**
   * Describe the size of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F3
   */
  async gestureDescribeItemSize(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemSize);
  }

  /**
   * Describe the position of the item in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F3-F3
   */
  async gestureDescribeItemPosition(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemPosition);
  }

  /**
   * Describe the item that has the keyboard focus
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F4
   */
  async gestureDescribeItemWithKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemWithKeyboardFocus);
  }

  /**
   * Describe the location of the insertion point (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F4-F4
   */
  async gestureDescribeLocationOfInsertionPoint(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfInsertionPoint);
  }

  /**
   * Describe the item under the mouse cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F5
   */
  async gestureDescribeItemUnderMouseCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemUnderMouseCursor);
  }

  /**
   * Describe the location of the mouse in x, y coordinates (from upper-left corner of screen)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F5-F5
   */
  async gestureDescribeLocationOfMouseInCoordinates(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouseInCoordinates);
  }

  /**
   * Describe the location of the mouse (from upper-left corner of window)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F5-F5-F5
   */
  async gestureDescribeLocationOfMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouse);
  }

  /**
   * Describe the selected item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F6
   */
  async gestureDescribeSelectedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeSelectedItem);
  }

  /**
   * Read everything in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-A
   */
  async gestureReadEverythingInCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInCursor);
  }

  /**
   * Read everything visible in the window or the Dock, or on your desktop, depending on your location
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-W
   */
  async gestureReadEverythingInWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInWindow);
  }

  /**
   * Repeat the last spoken phrase
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Z
   */
  async gestureRepeatLastSpokenPhrase(): Promise<void> {
    return await this.keyCode(keyCodeCommands.repeatLastSpokenPhrase);
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-C
   */
  async gestureCopyLastSpokenPhraseToClipboard(): Promise<void> {
    return await this.keyCode(keyCodeCommands.copyLastSpokenPhraseToClipboard);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Z
   */
  async gestureSaveLastSpokenPhraseToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.saveLastSpokenPhraseToDesktop);
  }

  /**
   * Find
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F
   */
  async gestureFind(): Promise<void> {
    return await this.keyCode(keyCodeCommands.find);
  }

  /**
   * Find the next searched text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-G
   */
  async gestureFindNextSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextSearchedText);
  }

  /**
   * Find the previous searched text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-G
   */
  async gestureFindPreviousSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousSearchedText);
  }

  /**
   * Find the next list
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-X
   */
  async gestureFindNextList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextList);
  }

  /**
   * Find the previous list
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-X
   */
  async gestureFindPreviousList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousList);
  }

  /**
   * Find the next bold text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-B
   */
  async gestureFindNextBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextBoldText);
  }

  /**
   * Find the previous bold text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-B
   */
  async gestureFindPreviousBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousBoldText);
  }

  /**
   * Find the next style change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-C
   */
  async gestureFindNextStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextStyleChange);
  }

  /**
   * Find the previous style change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-C
   */
  async gestureFindPreviousStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousStyleChange);
  }

  /**
   * Find the next italic text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-I
   */
  async gestureFindNextItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItalicText);
  }

  /**
   * Find the previous italic text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-I
   */
  async gestureFindPreviousItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItalicText);
  }

  /**
   * Find the next color change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-K
   */
  async gestureFindNextColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextColorChange);
  }

  /**
   * Find the previous color change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-K
   */
  async gestureFindPreviousColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousColorChange);
  }

  /**
   * Find the next font change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-O
   */
  async gestureFindNextFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextFontChange);
  }

  /**
   * Find the previous font change
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-O
   */
  async gestureFindPreviousFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousFontChange);
  }

  /**
   * Find the next table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-T
   */
  async gestureFindNextTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextTable);
  }

  /**
   * Find the previous table
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-T
   */
  async gestureFindPreviousTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousTable);
  }

  /**
   * Find the next underlined text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-U
   */
  async gestureFindNextUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextUnderlinedText);
  }

  /**
   * Find the previous underlined text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-U
   */
  async gestureFindPreviousUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousUnderlinedText);
  }

  /**
   * Find the next control
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-J
   */
  async gestureFindNextControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextControl);
  }

  /**
   * Find the previous control
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-J
   */
  async gestureFindPreviousControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousControl);
  }

  /**
   * Find the next different item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-D
   */
  async gestureFindNextDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextDifferentItem);
  }

  /**
   * Find the previous different item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-D
   */
  async gestureFindPreviousDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousDifferentItem);
  }

  /**
   * Find the next item that's the same type as the current item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-S
   */
  async gestureFindNextItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the previous item that's the same type as the current item
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-S
   */
  async gestureFindPreviousItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the next graphic
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-G
   */
  async gestureFindNextGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextGraphic);
  }

  /**
   * Find the previous graphic
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-G
   */
  async gestureFindPreviousGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousGraphic);
  }

  /**
   * Find the next heading
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-H
   */
  async gestureFindNextHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeading);
  }

  /**
   * Find the previous heading
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-H
   */
  async gestureFindPreviousHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeading);
  }

  /**
   * Find the next link
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-L
   */
  async gestureFindNextLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextLink);
  }

  /**
   * Find the previous link
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-L
   */
  async gestureFindPreviousLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousLink);
  }

  /**
   * Find the next heading of the same level
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-M
   */
  async gestureFindNextHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeadingOfSameLevel);
  }

  /**
   * Find the previous heading of the same level
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-M
   */
  async gestureFindPreviousHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeadingOfSameLevel);
  }

  /**
   * Find the next plain text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-P
   */
  async gestureFindNextPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextPlainText);
  }

  /**
   * Find the previous plain text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-P
   */
  async gestureFindPreviousPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousPlainText);
  }

  /**
   * Find the next visited link
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-V
   */
  async gestureFindNextVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextVisitedLink);
  }

  /**
   * Find the previous visited link
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-V
   */
  async gestureFindPreviousVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousVisitedLink);
  }

  /**
   * Find the next misspelled word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-E
   */
  async gestureFindNextMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextMisspelledWord);
  }

  /**
   * Find the previous misspelled word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-E
   */
  async gestureFindPreviousMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousMisspelledWord);
  }

  /**
   * Read all text from the VoiceOver cursor to the end of the text
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-A
   */
  async gestureReadAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readAllText);
  }

  /**
   * Select all text in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-A
   */
  async gestureSelectAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectAllText);
  }

  /**
   * Start and stop text selection in a text field (text selection tracking must be on)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Return
   */
  async gestureToggleTextSelection(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleTextSelection);
  }

  /**
   * Speak text attributes
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-T
   */
  async gestureSpeakTextAttributes(): Promise<void> {
    return await this.keyCode(keyCodeCommands.speakTextAttributes);
  }

  /**
   * Read paragraph in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-P
   */
  async gestureReadParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readParagraph);
  }

  /**
   * Read next paragraph
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Page Down
   */
  async gestureReadNextParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextParagraph);
  }

  /**
   * Read previous paragraph
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Page Up
   */
  async gestureReadPreviousParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousParagraph);
  }

  /**
   * Read sentence in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-S
   */
  async gestureReadSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readSentence);
  }

  /**
   * Read next sentence
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Page Down
   */
  async gestureReadNextSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextSentence);
  }

  /**
   * Read previous sentence
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Page Up
   */
  async gestureReadPreviousSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousSentence);
  }

  /**
   * Read line in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-L
   */
  async gestureReadLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLine);
  }

  /**
   * Read next line
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Down Arrow
   */
  async gestureReadNextLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextLine);
  }

  /**
   * Read previous line
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Up Arrow
   */
  async gestureReadPreviousLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousLine);
  }

  /**
   * Read word in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-W
   */
  async gestureReadWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWord);
  }

  /**
   * Read word spelled in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-W-W
   */
  async gestureReadWordSpelled(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordSpelled);
  }

  /**
   * Read word spelled phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-W-W-W
   */
  async gestureReadWordPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordPhonetically);
  }

  /**
   * Read next word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Right Arrow
   */
  async gestureReadNextWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextWord);
  }

  /**
   * Read previous word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Left Arrow
   */
  async gestureReadPreviousWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousWord);
  }

  /**
   * Read character in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-W
   */
  async gestureReadCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacter);
  }

  /**
   * Read character phonetically in VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-C-C
   */
  async gestureReadCharacterPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacterPhonetically);
  }

  /**
   * Read next character
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Right Arrow
   */
  async gestureReadNextCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextCharacter);
  }

  /**
   * Read previous character
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Left Arrow
   */
  async gestureReadPreviousCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousCharacter);
  }

  /**
   * Move to first visible word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Home
   */
  async gestureMoveToFirstVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstVisibleWord);
  }

  /**
   * Move to last visible word
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-End
   */
  async gestureMoveToLastVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLastVisibleWord);
  }

  /**
   * Move to beginning of text, scrolling if necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-Home
   */
  async gestureMoveToBeginningOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToBeginningOfText);
  }

  /**
   * Move to end of text, scrolling if necessary
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-End
   */
  async gestureMoveToEndOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToEndOfText);
  }

  /**
   * Reads the current word and character in the VoiceOver cursor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F3
   */
  async gestureReadCurrentWordAndCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCurrentWordAndCharacter);
  }

  /**
   * Reads the total number of lines and the number of visible lines in a document
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-F3-F3
   */
  async gestureReadNumberOfLines(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNumberOfLines);
  }

  /**
   * Move to the next column
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Y
   */
  async gestureMoveToNextColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextColumn);
  }

  /**
   * Move to the previous column
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-Y
   */
  async gestureMoveToPreviousColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousColumn);
  }

  /**
   * Move to the next frame
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-F
   */
  async gestureMoveToNextFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextFrame);
  }

  /**
   * Move to the previous frame
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-F
   */
  async gestureMoveToPreviousFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousFrame);
  }

  /**
   * Move to the next auto web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-N
   */
  async gestureMoveToNextAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextAutoWebSpot);
  }

  /**
   * Move to the previous auto web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-N
   */
  async gestureMoveToPreviousAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousAutoWebSpot);
  }

  /**
   * Move to the next web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-]
   */
  async gestureMoveToNextWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextWebSpot);
  }

  /**
   * Move to the previous web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-[
   */
  async gestureMoveToPreviousWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousWebSpot);
  }

  /**
   * Open the Web Item rotor
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-U
   */
  async gestureOpenWebItemRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWebItemRotor);
  }

  /**
   * Read from the beginning of a webpage to the current location
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-B
   */
  async gestureReadFromBeginningToCurrent(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readFromBeginningToCurrent);
  }

  /**
   * Read a link address (URL)
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-U
   */
  async gestureReadLinkAddress(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLinkAddress);
  }

  /**
   * Read webpage statistics
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Shift-I
   */
  async gestureReadWebpageStatistics(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWebpageStatistics);
  }

  /**
   * Remove a web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-{
   */
  async gestureRemoveWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.removeWebSpot);
  }

  /**
   * Set a web spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-}
   */
  async gestureSetWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setWebSpot);
  }

  /**
   * Set the sweet spot
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-Command-Shift-}-}
   */
  async gestureSetSweetSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setSweetSpot);
  }

  /**
   * Turn the grouping of items within a table on or off
   *
   * Uses VoiceOver keycode gesture
   *
   * Gesture: VO-=
   */
  async gestureToggleGroupingItemsWithinTable(): Promise<void> {
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
