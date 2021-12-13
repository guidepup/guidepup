// This file was automatically generated.
// Manual changes will not be preserved.

import { VoiceOverBase } from "./base";
import { keyCodeCommands } from "./keyCodeCommands";

export class VoiceOver extends VoiceOverBase {
  /**
   * Lock and unlock the VO (Control and Option) keys
   *
   * Gesture: VO-;
   */
  async gestureToggleLock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleLock);
  }

  /**
   * Open VoiceOver Utility
   *
   * Gesture: VO-F8
   */
  async gestureOpenVoiceOverUtility(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverUtility);
  }

  /**
   * Open the VoiceOver Help menu
   *
   * Gesture: VO-H
   */
  async gestureOpenVoiceOverHelpMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverHelpMenu);
  }

  /**
   * Open the VoiceOver Quick Start
   *
   * Gesture: VO-Command-F8
   */
  async gestureOpenVoiceOverQuickStart(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverQuickStart);
  }

  /**
   * Open VoiceOver online help
   *
   * Gesture: VO-Shift-/
   */
  async gestureOpenVoiceOverOnlineHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVoiceOverOnlineHelp);
  }

  /**
   * Start keyboard help
   *
   * Gesture: VO-K
   */
  async gestureStartKeyboardHelp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.startKeyboardHelp);
  }

  /**
   * Hear a description of the item in the VoiceOver cursor
   *
   * Gesture: VO-Shift-N
   */
  async gestureHearItemDescription(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearItemDescription);
  }

  /**
   * Open the Commands menu
   *
   * Gesture: VO-H-H
   */
  async gestureOpenCommandsMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openCommandsMenu);
  }

  /**
   * Open the Find menu
   *
   * Gesture: VO-Shift-F
   */
  async gestureOpenFindMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openFindMenu);
  }

  /**
   * Close a menu or rotor, stop an action, or exit a mode
   *
   * Gesture: Escape
   */
  async gestureStopAction(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopAction);
  }

  /**
   * Tell VoiceOver to ignore the next key combination you press
   *
   * Gesture: VO-Tab
   */
  async gestureIgnoreNextKeyCombination(): Promise<void> {
    return await this.keyCode(keyCodeCommands.ignoreNextKeyCombination);
  }

  /**
   * Open the verbosity rotor
   *
   * Gesture: VO-V
   */
  async gestureOpenVerbosityRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openVerbosityRotor);
  }

  /**
   * Magnify the item in the VoiceOver cursor
   *
   * Gesture: VO-}
   */
  async gestureMagnifyItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.magnifyItem);
  }

  /**
   * Shrink the item in the VoiceOver cursor
   *
   * Gesture: VO-{
   */
  async gestureShrinkItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.shrinkItem);
  }

  /**
   * Temporarily hide or show the VoiceOver cursor and the caption or braille panels
   *
   * Gesture: VO-F11
   */
  async gestureToggleVoiceOverCursorAndPanels(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleVoiceOverCursorAndPanels);
  }

  /**
   * Hide or show the caption panel only
   *
   * Gesture: VO-Command-F10
   */
  async gestureToggleCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCaptionPanel);
  }

  /**
   * Resize or move the caption panel
   *
   * Gesture: VO-Shift-F10
   */
  async gestureResizeOrMoveCaptionPanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveCaptionPanel);
  }

  /**
   * Hide or show the braille panel only
   *
   * Gesture: VO-Command-F9
   */
  async gestureToggleBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleBraillePanel);
  }

  /**
   * Resize or move the braille panel
   *
   * Gesture: VO-Shift-F9
   */
  async gestureResizeOrMoveBraillePanel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeOrMoveBraillePanel);
  }

  /**
   * Tile visuals (dim the screen, highlight the caption or braille panel, and show the item in the VoiceOver cursor in the center of the screen).
   *
   * Gesture: VO-F10
   */
  async gestureTileVisuals(): Promise<void> {
    return await this.keyCode(keyCodeCommands.tileVisuals);
  }

  /**
   * Enable or disable the Keyboard Commander
   *
   * Gesture: VO-Shift-K
   */
  async gestureToggleKeyboardCommander(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleKeyboardCommander);
  }

  /**
   * Turn the screen black (screen curtain)
   *
   * Gesture: VO-Shift-F11
   */
  async gestureToggleScreenCurtain(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleScreenCurtain);
  }

  /**
   * Press and release mouse button
   *
   * Gesture: VO-Shift-Space bar
   */
  async gestureClick(): Promise<void> {
    return await this.keyCode(keyCodeCommands.click);
  }

  /**
   * Interact with an item
   *
   * Gesture: VO-Shift-Down Arrow
   */
  async gestureInteractWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithItem);
  }

  /**
   * Stop interacting with an item
   *
   * Gesture: VO-Shift-Up Arrow
   */
  async gestureStopInteractingWithItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.stopInteractingWithItem);
  }

  /**
   * Perform the default action for the item in the VoiceOver cursor
   *
   * Gesture: VO-Space bar
   */
  async gesturePerformDefaultActionForItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.performDefaultActionForItem);
  }

  /**
   * Select a menu or list item
   *
   * Gesture: VO-Return
   */
  async gestureSelectItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectItem);
  }

  /**
   * Select multiple items
   *
   * Gesture: VO-Command-Space bar
   */
  async gestureSelectMultipleItems(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectMultipleItems);
  }

  /**
   * Perform a sticky mouse down or mouse up (for use when dragging an item from one location to drop in another location)
   *
   * Gesture: VO-Command-Shift-Space bar
   */
  async gestureToggleStickyMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleStickyMouse);
  }

  /**
   * Click the item under the mouse cursor
   *
   * Gesture: VO-Shift-Space bar-Space bar
   */
  async gestureDoubleClick(): Promise<void> {
    return await this.keyCode(keyCodeCommands.doubleClick);
  }

  /**
   * Open or close a disclosure triangle
   *
   * Gesture: VO-\
   */
  async gestureToggleDisclosureTriangle(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleDisclosureTriangle);
  }

  /**
   * Read a row in a table
   *
   * Gesture: VO-R
   */
  async gestureReadTableRow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRow);
  }

  /**
   * Read a column in a table
   *
   * Gesture: VO-C-C
   */
  async gestureReadTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumn);
  }

  /**
   * Read the column header in a table
   *
   * Gesture: VO-C
   */
  async gestureReadTableColumnHeader(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableColumnHeader);
  }

  /**
   * Read row and column numbers in a table
   *
   * Gesture: VO-Shift-T
   */
  async gestureReadTableRowAndColumnNumbers(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readTableRowAndColumnNumbers);
  }

  /**
   * Sort a column in a table
   *
   * Gesture: VO-|
   */
  async gestureSortTableColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.sortTableColumn);
  }

  /**
   * Interact with scroll bars
   *
   * Gesture: VO-Shift-S
   */
  async gestureInteractWithScrollbars(): Promise<void> {
    return await this.keyCode(keyCodeCommands.interactWithScrollbars);
  }

  /**
   * Resize a window or an object
   *
   * Gesture: VO-~
   */
  async gestureResizeObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.resizeObject);
  }

  /**
   * Move a window or an object
   *
   * Gesture: VO-`
   */
  async gestureMoveObject(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveObject);
  }

  /**
   * Move up
   *
   * Gesture: VO-Up Arrow
   */
  async gestureMoveUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveUp);
  }

  /**
   * Move down
   *
   * Gesture: VO-Down Arrow
   */
  async gestureMoveDown(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveDown);
  }

  /**
   * Move to previous
   *
   * Gesture: VO-Left Arrow
   */
  async gestureMoveToPrevious(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPrevious);
  }

  /**
   * Move to next
   *
   * Gesture: VO-Right Arrow
   */
  async gestureMoveToNext(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNext);
  }

  /**
   * Move to the top of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Gesture: VO-Home
   */
  async gestureMoveToVisibleAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaTop);
  }

  /**
   * Move to the bottom of the visible area (such as a window or text area) where the VoiceOver cursor is located
   *
   * Gesture: VO-End
   */
  async gestureMoveToVisibleAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToVisibleAreaBottom);
  }

  /**
   * Move to the top of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Gesture: VO-Shift-Home
   */
  async gestureMoveToAreaTop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaTop);
  }

  /**
   * Move to the bottom of the area (such as a window or text area) where the VoiceOver cursor is located, scrolling if necessary
   *
   * Gesture: VO-Shift-End
   */
  async gestureMoveToAreaBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToAreaBottom);
  }

  /**
   * Move to the top of a window, the first item in the Dock, or the first item on your desktop, depending on your location
   *
   * Gesture: VO-Command-Home
   */
  async gestureMoveToFirst(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirst);
  }

  /**
   * Move to the lower-right corner of a window, the last item in the Dock, or the last item on your desktop, depending on your location
   *
   * Gesture: VO-Command-End
   */
  async gestureMoveToLast(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLast);
  }

  /**
   * Move to the front the window where the VoiceOver cursor is located and make it active
   *
   * Gesture: VO-Shift-F2
   */
  async gestureMoveToFrontWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFrontWindow);
  }

  /**
   * Close the window where the VoiceOver cursor is located
   *
   * Gesture: VO-Command-F2
   */
  async gestureCloseWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.closeWindow);
  }

  /**
   * Open the Item Chooser
   *
   * Gesture: VO-I
   */
  async gestureOpenItemChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openItemChooser);
  }

  /**
   * Move to the desktop
   *
   * Gesture: VO-D
   */
  async gestureMoveToDock(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDock);
  }

  /**
   * Move to the desktop
   *
   * Gesture: VO-D
   */
  async gestureMoveToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToDesktop);
  }

  /**
   * Move to the menu bar
   *
   * Gesture: VO-M
   */
  async gestureMoveToMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToMenuBar);
  }

  /**
   * Move to the first status menu in the menu bar
   *
   * Gesture: VO-M-M
   */
  async gestureMoveToFirstStatusMenuInMenuBar(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstStatusMenuInMenuBar);
  }

  /**
   * Open the Spotlight menu
   *
   * Gesture: VO-M-M-M
   */
  async gestureOpenSpotlightMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openSpotlightMenu);
  }

  /**
   * Open a shortcut menu
   *
   * Gesture: VO-Shift-J
   */
  async gestureOpenShortcutMenu(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openShortcutMenu);
  }

  /**
   * Jump to a linked item (for example, from a Mail message in the Inbox to its message text)
   *
   * Gesture: VO-J
   */
  async gestureJumpToLinkedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLinkedItem);
  }

  /**
   * Temporarily disable or enable the cursor tracking options you selected in VoiceOver Utility. The command doesn't change the settings in VoiceOver Utility.
   *
   * Gesture: VO-Shift-F3
   */
  async gestureToggleCursorTrackingOptions(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleCursorTrackingOptions);
  }

  /**
   * Move VoiceOver cursor to keyboard focus
   *
   * Gesture: VO-Shift-F4
   */
  async gestureMoveCursorToKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToKeyboardFocus);
  }

  /**
   * Move keyboard focus to VoiceOver cursor
   *
   * Gesture: VO-Command-F4
   */
  async gestureMoveKeyboardFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveKeyboardFocusToCursor);
  }

  /**
   * Move VoiceOver cursor to mouse cursor
   *
   * Gesture: VO-Shift-F5
   */
  async gestureMoveCursorToMouseFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveCursorToMouseFocus);
  }

  /**
   * Move mouse cursor to VoiceOver cursor
   *
   * Gesture: VO-Command-F5
   */
  async gestureMoveMouseFocusToCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveMouseFocusToCursor);
  }

  /**
   * Jump command
   *
   * Gesture: VO-Shift-J
   */
  async gestureJumpCommand(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpCommand);
  }

  /**
   * Jump to the top edge of an area. Used with jump command
   *
   * Gesture: VO-Shift-Up Arrow
   */
  async gestureJumpToTopEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopEdge);
  }

  /**
   * Jump to the right edge of an area. Used with jump command
   *
   * Gesture: VO-Shift-Right Arrow
   */
  async gestureJumpToRightEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightEdge);
  }

  /**
   * Jump to the bottom edge of an area. Used with jump command
   *
   * Gesture: VO-Shift-Down Arrow
   */
  async gestureJumpToBottomEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomEdge);
  }

  /**
   * Jump to the left edge of an area. Used with jump command
   *
   * Gesture: VO-Shift-Left Arrow
   */
  async gestureJumpToLeftEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftEdge);
  }

  /**
   * Jump to the top visible edge of an area. Used with jump command
   *
   * Gesture: VO-Up Arrow
   */
  async gestureJumpToTopVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToTopVisibleEdge);
  }

  /**
   * Jump to the right visible edge of an area. Used with jump command
   *
   * Gesture: VO-Right Arrow
   */
  async gestureJumpToRightVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToRightVisibleEdge);
  }

  /**
   * Jump to the bottom visible edge of an area. Used with jump command
   *
   * Gesture: VO-Down Arrow
   */
  async gestureJumpToBottomVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToBottomVisibleEdge);
  }

  /**
   * Jump to the left visible edge of an area. Used with jump command
   *
   * Gesture: VO-Left Arrow
   */
  async gestureJumpToLeftVisibleEdge(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToLeftVisibleEdge);
  }

  /**
   * Jump to the area that precedes a horizontal or vertical splitter
   *
   * Gesture: VO-[
   */
  async gestureJumpBeforeSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpBeforeSplitter);
  }

  /**
   * Jump to the area that follows a horizontal or vertical splitter
   *
   * Gesture: VO-]
   */
  async gestureJumpAfterSplitter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpAfterSplitter);
  }

  /**
   * Find text
   *
   * Gesture: VO-F
   */
  async gestureFindText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findText);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Gesture: VO-Command-Shift-Up Arrow
   */
  async gestureNavigateUp(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateUp);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Gesture: VO-Command-Shift-Right Arrow
   */
  async gestureNavigateRight(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateRight);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Gesture: VO-Command-Shift-Down Arrow
   */
  async gestureNavigateBottom(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateBottom);
  }

  /**
   * Navigate in given direction, wrapping when necessary
   *
   * Gesture: VO-Command-Shift-Left Arrow
   */
  async gestureNavigateLeft(): Promise<void> {
    return await this.keyCode(keyCodeCommands.navigateLeft);
  }

  /**
   * Toggle hot spot 1
   *
   * Gesture: VO-Shift-1
   */
  async gestureToggleHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot1);
  }

  /**
   * Toggle hot spot 2
   *
   * Gesture: VO-Shift-2
   */
  async gestureToggleHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot2);
  }

  /**
   * Toggle hot spot 3
   *
   * Gesture: VO-Shift-3
   */
  async gestureToggleHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot3);
  }

  /**
   * Toggle hot spot 4
   *
   * Gesture: VO-Shift-4
   */
  async gestureToggleHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot4);
  }

  /**
   * Toggle hot spot 5
   *
   * Gesture: VO-Shift-5
   */
  async gestureToggleHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot5);
  }

  /**
   * Toggle hot spot 6
   *
   * Gesture: VO-Shift-6
   */
  async gestureToggleHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot6);
  }

  /**
   * Toggle hot spot 7
   *
   * Gesture: VO-Shift-7
   */
  async gestureToggleHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot7);
  }

  /**
   * Toggle hot spot 8
   *
   * Gesture: VO-Shift-8
   */
  async gestureToggleHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot8);
  }

  /**
   * Toggle hot spot 9
   *
   * Gesture: VO-Shift-9
   */
  async gestureToggleHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot9);
  }

  /**
   * Toggle hot spot 0
   *
   * Gesture: VO-Shift-0
   */
  async gestureToggleHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleHotSpot0);
  }

  /**
   * Jump to hot spot 1
   *
   * Gesture: VO-1
   */
  async gestureJumpToHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot1);
  }

  /**
   * Jump to hot spot 2
   *
   * Gesture: VO-2
   */
  async gestureJumpToHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot2);
  }

  /**
   * Jump to hot spot 3
   *
   * Gesture: VO-3
   */
  async gestureJumpToHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot3);
  }

  /**
   * Jump to hot spot 4
   *
   * Gesture: VO-4
   */
  async gestureJumpToHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot4);
  }

  /**
   * Jump to hot spot 5
   *
   * Gesture: VO-5
   */
  async gestureJumpToHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot5);
  }

  /**
   * Jump to hot spot 6
   *
   * Gesture: VO-6
   */
  async gestureJumpToHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot6);
  }

  /**
   * Jump to hot spot 7
   *
   * Gesture: VO-7
   */
  async gestureJumpToHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot7);
  }

  /**
   * Jump to hot spot 8
   *
   * Gesture: VO-8
   */
  async gestureJumpToHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot8);
  }

  /**
   * Jump to hot spot 9
   *
   * Gesture: VO-9
   */
  async gestureJumpToHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot9);
  }

  /**
   * Jump to hot spot 0
   *
   * Gesture: VO-0
   */
  async gestureJumpToHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToHotSpot0);
  }

  /**
   * Hear a description of hot spot 1
   *
   * Gesture: VO-Command-1
   */
  async gestureDescribeHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot1);
  }

  /**
   * Hear a description of hot spot 2
   *
   * Gesture: VO-Command-2
   */
  async gestureDescribeHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot2);
  }

  /**
   * Hear a description of hot spot 3
   *
   * Gesture: VO-Command-3
   */
  async gestureDescribeHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot3);
  }

  /**
   * Hear a description of hot spot 4
   *
   * Gesture: VO-Command-4
   */
  async gestureDescribeHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot4);
  }

  /**
   * Hear a description of hot spot 5
   *
   * Gesture: VO-Command-5
   */
  async gestureDescribeHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot5);
  }

  /**
   * Hear a description of hot spot 6
   *
   * Gesture: VO-Command-6
   */
  async gestureDescribeHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot6);
  }

  /**
   * Hear a description of hot spot 7
   *
   * Gesture: VO-Command-7
   */
  async gestureDescribeHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot7);
  }

  /**
   * Hear a description of hot spot 8
   *
   * Gesture: VO-Command-8
   */
  async gestureDescribeHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot8);
  }

  /**
   * Hear a description of hot spot 9
   *
   * Gesture: VO-Command-9
   */
  async gestureDescribeHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot9);
  }

  /**
   * Hear a description of hot spot 0
   *
   * Gesture: VO-Command-0
   */
  async gestureDescribeHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeHotSpot0);
  }

  /**
   * Monitor hot spot 1
   *
   * Gesture: VO-Command-Shift-1
   */
  async gestureMonitorHotSpot1(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot1);
  }

  /**
   * Monitor hot spot 2
   *
   * Gesture: VO-Command-Shift-2
   */
  async gestureMonitorHotSpot2(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot2);
  }

  /**
   * Monitor hot spot 3
   *
   * Gesture: VO-Command-Shift-3
   */
  async gestureMonitorHotSpot3(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot3);
  }

  /**
   * Monitor hot spot 4
   *
   * Gesture: VO-Command-Shift-4
   */
  async gestureMonitorHotSpot4(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot4);
  }

  /**
   * Monitor hot spot 5
   *
   * Gesture: VO-Command-Shift-5
   */
  async gestureMonitorHotSpot5(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot5);
  }

  /**
   * Monitor hot spot 6
   *
   * Gesture: VO-Command-Shift-6
   */
  async gestureMonitorHotSpot6(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot6);
  }

  /**
   * Monitor hot spot 7
   *
   * Gesture: VO-Command-Shift-7
   */
  async gestureMonitorHotSpot7(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot7);
  }

  /**
   * Monitor hot spot 8
   *
   * Gesture: VO-Command-Shift-8
   */
  async gestureMonitorHotSpot8(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot8);
  }

  /**
   * Monitor hot spot 9
   *
   * Gesture: VO-Command-Shift-9
   */
  async gestureMonitorHotSpot9(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot9);
  }

  /**
   * Monitor hot spot 0
   *
   * Gesture: VO-Command-Shift-0
   */
  async gestureMonitorHotSpot0(): Promise<void> {
    return await this.keyCode(keyCodeCommands.monitorHotSpot0);
  }

  /**
   * Jump back to a parent folder
   *
   * Gesture: VO-Command-\
   */
  async gestureJumpToParentFolder(): Promise<void> {
    return await this.keyCode(keyCodeCommands.jumpToParentFolder);
  }

  /**
   * Hear the application summary
   *
   * Gesture: VO-F1
   */
  async gestureHearApplicationSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearApplicationSummary);
  }

  /**
   * Open the Application Chooser
   *
   * Gesture: VO-F1-F1
   */
  async gestureOpenApplicationChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openApplicationChooser);
  }

  /**
   * Hear the window summary
   *
   * Gesture: VO-F2
   */
  async gestureHearWindowSummary(): Promise<void> {
    return await this.keyCode(keyCodeCommands.hearWindowSummary);
  }

  /**
   * Open the Window Chooser 
   *
   * Gesture: VO-F2-F2
   */
  async gestureOpenWindowChooser(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWindowChooser);
  }

  /**
   * Describe the item in the VoiceOver cursor
   *
   * Gesture: VO-F3
   */
  async gestureDescribeItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItem);
  }

  /**
   * Describe the size of the item in the VoiceOver cursor
   *
   * Gesture: VO-Command-F3
   */
  async gestureDescribeItemSize(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemSize);
  }

  /**
   * Describe the position of the item in the VoiceOver cursor
   *
   * Gesture: VO-Command-F3-F3
   */
  async gestureDescribeItemPosition(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemPosition);
  }

  /**
   * Describe the item that has the keyboard focus
   *
   * Gesture: VO-F4
   */
  async gestureDescribeItemWithKeyboardFocus(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemWithKeyboardFocus);
  }

  /**
   * Describe the location of the insertion point (from upper-left corner of screen)
   *
   * Gesture: VO-F4-F4
   */
  async gestureDescribeLocationOfInsertionPoint(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfInsertionPoint);
  }

  /**
   * Describe the item under the mouse cursor
   *
   * Gesture: VO-F5
   */
  async gestureDescribeItemUnderMouseCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeItemUnderMouseCursor);
  }

  /**
   * Describe the location of the mouse in x, y coordinates (from upper-left corner of screen)
   *
   * Gesture: VO-F5-F5
   */
  async gestureDescribeLocationOfMouseInCoordinates(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouseInCoordinates);
  }

  /**
   * Describe the location of the mouse (from upper-left corner of window)
   *
   * Gesture: VO-F5-F5-F5
   */
  async gestureDescribeLocationOfMouse(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeLocationOfMouse);
  }

  /**
   * Describe the selected item
   *
   * Gesture: VO-F6
   */
  async gestureDescribeSelectedItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.describeSelectedItem);
  }

  /**
   * Read everything in the VoiceOver cursor
   *
   * Gesture: VO-A
   */
  async gestureReadEverythingInCursor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInCursor);
  }

  /**
   * Read everything visible in the window or the Dock, or on your desktop, depending on your location
   *
   * Gesture: VO-Shift-W
   */
  async gestureReadEverythingInWindow(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readEverythingInWindow);
  }

  /**
   * Repeat the last spoken phrase
   *
   * Gesture: VO-Z
   */
  async gestureRepeatLastSpokenPhrase(): Promise<void> {
    return await this.keyCode(keyCodeCommands.repeatLastSpokenPhrase);
  }

  /**
   * Copy the last spoken phrase to the Clipboard (also called the "Pasteboard")
   *
   * Gesture: VO-Shift-C
   */
  async gestureCopyLastSpokenPhraseToClipboard(): Promise<void> {
    return await this.keyCode(keyCodeCommands.copyLastSpokenPhraseToClipboard);
  }

  /**
   * Save the last spoken phrase and the crash log to a file on the desktop for troubleshooting
   *
   * Gesture: VO-Shift-Z
   */
  async gestureSaveLastSpokenPhraseToDesktop(): Promise<void> {
    return await this.keyCode(keyCodeCommands.saveLastSpokenPhraseToDesktop);
  }

  /**
   * Find
   *
   * Gesture: VO-F
   */
  async gestureFind(): Promise<void> {
    return await this.keyCode(keyCodeCommands.find);
  }

  /**
   * Find the next searched text
   *
   * Gesture: VO-G
   */
  async gestureFindNextSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextSearchedText);
  }

  /**
   * Find the previous searched text
   *
   * Gesture: VO-Shift-G
   */
  async gestureFindPreviousSearchedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousSearchedText);
  }

  /**
   * Find the next list
   *
   * Gesture: VO-Command-X
   */
  async gestureFindNextList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextList);
  }

  /**
   * Find the previous list
   *
   * Gesture: VO-Command-Shift-X
   */
  async gestureFindPreviousList(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousList);
  }

  /**
   * Find the next bold text
   *
   * Gesture: VO-Command-B
   */
  async gestureFindNextBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextBoldText);
  }

  /**
   * Find the previous bold text
   *
   * Gesture: VO-Command-Shift-B
   */
  async gestureFindPreviousBoldText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousBoldText);
  }

  /**
   * Find the next style change
   *
   * Gesture: VO-Command-C
   */
  async gestureFindNextStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextStyleChange);
  }

  /**
   * Find the previous style change
   *
   * Gesture: VO-Command-Shift-C
   */
  async gestureFindPreviousStyleChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousStyleChange);
  }

  /**
   * Find the next italic text
   *
   * Gesture: VO-Command-I
   */
  async gestureFindNextItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItalicText);
  }

  /**
   * Find the previous italic text
   *
   * Gesture: VO-Command-Shift-I
   */
  async gestureFindPreviousItalicText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItalicText);
  }

  /**
   * Find the next color change
   *
   * Gesture: VO-Command-K
   */
  async gestureFindNextColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextColorChange);
  }

  /**
   * Find the previous color change
   *
   * Gesture: VO-Command-Shift-K
   */
  async gestureFindPreviousColorChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousColorChange);
  }

  /**
   * Find the next font change
   *
   * Gesture: VO-Command-O
   */
  async gestureFindNextFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextFontChange);
  }

  /**
   * Find the previous font change
   *
   * Gesture: VO-Command-Shift-O
   */
  async gestureFindPreviousFontChange(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousFontChange);
  }

  /**
   * Find the next table
   *
   * Gesture: VO-Command-T
   */
  async gestureFindNextTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextTable);
  }

  /**
   * Find the previous table
   *
   * Gesture: VO-Command-Shift-T
   */
  async gestureFindPreviousTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousTable);
  }

  /**
   * Find the next underlined text
   *
   * Gesture: VO-Command-U
   */
  async gestureFindNextUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextUnderlinedText);
  }

  /**
   * Find the previous underlined text
   *
   * Gesture: VO-Command-Shift-U
   */
  async gestureFindPreviousUnderlinedText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousUnderlinedText);
  }

  /**
   * Find the next control
   *
   * Gesture: VO-Command-J
   */
  async gestureFindNextControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextControl);
  }

  /**
   * Find the previous control
   *
   * Gesture: VO-Command-Shift-J
   */
  async gestureFindPreviousControl(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousControl);
  }

  /**
   * Find the next different item
   *
   * Gesture: VO-Command-D
   */
  async gestureFindNextDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextDifferentItem);
  }

  /**
   * Find the previous different item
   *
   * Gesture: VO-Command-Shift-D
   */
  async gestureFindPreviousDifferentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousDifferentItem);
  }

  /**
   * Find the next item that's the same type as the current item
   *
   * Gesture: VO-Command-S
   */
  async gestureFindNextItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the previous item that's the same type as the current item
   *
   * Gesture: VO-Command-Shift-S
   */
  async gestureFindPreviousItemWithSameTypeAsCurrentItem(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousItemWithSameTypeAsCurrentItem);
  }

  /**
   * Find the next graphic
   *
   * Gesture: VO-Command-G
   */
  async gestureFindNextGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextGraphic);
  }

  /**
   * Find the previous graphic
   *
   * Gesture: VO-Command-Shift-G
   */
  async gestureFindPreviousGraphic(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousGraphic);
  }

  /**
   * Find the next heading
   *
   * Gesture: VO-Command-H
   */
  async gestureFindNextHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeading);
  }

  /**
   * Find the previous heading
   *
   * Gesture: VO-Command-Shift-H
   */
  async gestureFindPreviousHeading(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeading);
  }

  /**
   * Find the next link
   *
   * Gesture: VO-Command-L
   */
  async gestureFindNextLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextLink);
  }

  /**
   * Find the previous link
   *
   * Gesture: VO-Command-Shift-L
   */
  async gestureFindPreviousLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousLink);
  }

  /**
   * Find the next heading of the same level
   *
   * Gesture: VO-Command-M
   */
  async gestureFindNextHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextHeadingOfSameLevel);
  }

  /**
   * Find the previous heading of the same level
   *
   * Gesture: VO-Command-Shift-M
   */
  async gestureFindPreviousHeadingOfSameLevel(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousHeadingOfSameLevel);
  }

  /**
   * Find the next plain text
   *
   * Gesture: VO-Command-P
   */
  async gestureFindNextPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextPlainText);
  }

  /**
   * Find the previous plain text
   *
   * Gesture: VO-Command-Shift-P
   */
  async gestureFindPreviousPlainText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousPlainText);
  }

  /**
   * Find the next visited link
   *
   * Gesture: VO-Command-V
   */
  async gestureFindNextVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextVisitedLink);
  }

  /**
   * Find the previous visited link
   *
   * Gesture: VO-Command-Shift-V
   */
  async gestureFindPreviousVisitedLink(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousVisitedLink);
  }

  /**
   * Find the next misspelled word
   *
   * Gesture: VO-Command-E
   */
  async gestureFindNextMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findNextMisspelledWord);
  }

  /**
   * Find the previous misspelled word
   *
   * Gesture: VO-Command-Shift-E
   */
  async gestureFindPreviousMisspelledWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.findPreviousMisspelledWord);
  }

  /**
   * Read all text from the VoiceOver cursor to the end of the text
   *
   * Gesture: VO-A
   */
  async gestureReadAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readAllText);
  }

  /**
   * Select all text in the VoiceOver cursor
   *
   * Gesture: VO-Shift-A
   */
  async gestureSelectAllText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.selectAllText);
  }

  /**
   * Start and stop text selection in a text field (text selection tracking must be on)
   *
   * Gesture: VO-Return
   */
  async gestureToggleTextSelection(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleTextSelection);
  }

  /**
   * Speak text attributes
   *
   * Gesture: VO-T
   */
  async gestureSpeakTextAttributes(): Promise<void> {
    return await this.keyCode(keyCodeCommands.speakTextAttributes);
  }

  /**
   * Read paragraph in VoiceOver cursor
   *
   * Gesture: VO-P
   */
  async gestureReadParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readParagraph);
  }

  /**
   * Read next paragraph
   *
   * Gesture: VO-Shift-Page Down
   */
  async gestureReadNextParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextParagraph);
  }

  /**
   * Read previous paragraph
   *
   * Gesture: VO-Shift-Page Up
   */
  async gestureReadPreviousParagraph(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousParagraph);
  }

  /**
   * Read sentence in VoiceOver cursor
   *
   * Gesture: VO-S
   */
  async gestureReadSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readSentence);
  }

  /**
   * Read next sentence
   *
   * Gesture: VO-Command-Page Down
   */
  async gestureReadNextSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextSentence);
  }

  /**
   * Read previous sentence
   *
   * Gesture: VO-Command-Page Up
   */
  async gestureReadPreviousSentence(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousSentence);
  }

  /**
   * Read line in VoiceOver cursor
   *
   * Gesture: VO-L
   */
  async gestureReadLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLine);
  }

  /**
   * Read next line
   *
   * Gesture: VO-Down Arrow
   */
  async gestureReadNextLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextLine);
  }

  /**
   * Read previous line
   *
   * Gesture: VO-Up Arrow
   */
  async gestureReadPreviousLine(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousLine);
  }

  /**
   * Read word in VoiceOver cursor
   *
   * Gesture: VO-W
   */
  async gestureReadWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWord);
  }

  /**
   * Read word spelled in VoiceOver cursor
   *
   * Gesture: VO-W-W
   */
  async gestureReadWordSpelled(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordSpelled);
  }

  /**
   * Read word spelled phonetically in VoiceOver cursor
   *
   * Gesture: VO-W-W-W
   */
  async gestureReadWordPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWordPhonetically);
  }

  /**
   * Read next word
   *
   * Gesture: VO-Right Arrow
   */
  async gestureReadNextWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextWord);
  }

  /**
   * Read previous word
   *
   * Gesture: VO-Left Arrow
   */
  async gestureReadPreviousWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousWord);
  }

  /**
   * Read character in VoiceOver cursor
   *
   * Gesture: VO-W
   */
  async gestureReadCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacter);
  }

  /**
   * Read character phonetically in VoiceOver cursor
   *
   * Gesture: VO-C-C
   */
  async gestureReadCharacterPhonetically(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCharacterPhonetically);
  }

  /**
   * Read next character
   *
   * Gesture: VO-Shift-Right Arrow
   */
  async gestureReadNextCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNextCharacter);
  }

  /**
   * Read previous character
   *
   * Gesture: VO-Shift-Left Arrow
   */
  async gestureReadPreviousCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readPreviousCharacter);
  }

  /**
   * Move to first visible word
   *
   * Gesture: VO-Home
   */
  async gestureMoveToFirstVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToFirstVisibleWord);
  }

  /**
   * Move to last visible word
   *
   * Gesture: VO-End
   */
  async gestureMoveToLastVisibleWord(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToLastVisibleWord);
  }

  /**
   * Move to beginning of text, scrolling if necessary
   *
   * Gesture: VO-Shift-Home
   */
  async gestureMoveToBeginningOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToBeginningOfText);
  }

  /**
   * Move to end of text, scrolling if necessary
   *
   * Gesture: VO-Shift-End
   */
  async gestureMoveToEndOfText(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToEndOfText);
  }

  /**
   * Reads the current word and character in the VoiceOver cursor
   *
   * Gesture: VO-F3
   */
  async gestureReadCurrentWordAndCharacter(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readCurrentWordAndCharacter);
  }

  /**
   * Reads the total number of lines and the number of visible lines in a document
   *
   * Gesture: VO-F3-F3
   */
  async gestureReadNumberOfLines(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readNumberOfLines);
  }

  /**
   * Move to the next column
   *
   * Gesture: VO-Command-Y
   */
  async gestureMoveToNextColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextColumn);
  }

  /**
   * Move to the previous column
   *
   * Gesture: VO-Command-Shift-Y
   */
  async gestureMoveToPreviousColumn(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousColumn);
  }

  /**
   * Move to the next frame
   *
   * Gesture: VO-Command-F
   */
  async gestureMoveToNextFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextFrame);
  }

  /**
   * Move to the previous frame
   *
   * Gesture: VO-Command-Shift-F
   */
  async gestureMoveToPreviousFrame(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousFrame);
  }

  /**
   * Move to the next auto web spot
   *
   * Gesture: VO-Command-F
   */
  async gestureMoveToNextAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextAutoWebSpot);
  }

  /**
   * Move to the previous auto web spot
   *
   * Gesture: VO-Command-Shift-N
   */
  async gestureMoveToPreviousAutoWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousAutoWebSpot);
  }

  /**
   * Move to the next web spot
   *
   * Gesture: VO-Command-]
   */
  async gestureMoveToNextWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToNextWebSpot);
  }

  /**
   * Move to the previous web spot
   *
   * Gesture: VO-Command-[
   */
  async gestureMoveToPreviousWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.moveToPreviousWebSpot);
  }

  /**
   * Open the Web Item rotor
   *
   * Gesture: VO-U
   */
  async gestureOpenWebItemRotor(): Promise<void> {
    return await this.keyCode(keyCodeCommands.openWebItemRotor);
  }

  /**
   * Read from the beginning of a webpage to the current location
   *
   * Gesture: VO-B
   */
  async gestureReadFromBeginningToCurrent(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readFromBeginningToCurrent);
  }

  /**
   * Read a link address (URL)
   *
   * Gesture: VO-Shift-U
   */
  async gestureReadLinkAddress(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readLinkAddress);
  }

  /**
   * Read webpage statistics
   *
   * Gesture: VO-Shift-I
   */
  async gestureReadWebpageStatistics(): Promise<void> {
    return await this.keyCode(keyCodeCommands.readWebpageStatistics);
  }

  /**
   * Remove a web spot
   *
   * Gesture: VO-Command-Shift-{
   */
  async gestureRemoveWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.removeWebSpot);
  }

  /**
   * Set a web spot
   *
   * Gesture: VO-Command-Shift-}
   */
  async gestureSetWebSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setWebSpot);
  }

  /**
   * Set the sweet spot
   *
   * Gesture: VO-Command-Shift-}-}
   */
  async gestureSetSweetSpot(): Promise<void> {
    return await this.keyCode(keyCodeCommands.setSweetSpot);
  }

  /**
   * Turn the grouping of items within a table on or off
   *
   * Gesture: VO-=
   */
  async gestureToggleGroupingItemsWithinTable(): Promise<void> {
    return await this.keyCode(keyCodeCommands.toggleGroupingItemsWithinTable);
  }
}
