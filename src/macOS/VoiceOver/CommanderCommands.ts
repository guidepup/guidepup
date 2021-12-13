export enum CommanderCommands {
  // General Commands

  ACTIONS = "actions",
  ADD_PRONUNCIATION = "add pronunciation",
  BRING_WINDOW_TO_FRONT = "bring window to front",
  CLICK_MOUSE = "click mouse",
  CLOSE_WINDOW = "close window",
  DESCRIBE_POSITION_OF_WINDOW = "describe position of window",
  DESCRIBE_SIZE_OF_WINDOW = "describe size of window",
  DOUBLE_CLICK_MOUSE = "double click mouse",
  DROP_MARKED_ITEM_AFTER_CHOSEN_HOT_SPOT = "drop marked item after chosen hot spot",
  DROP_MARKED_ITEM_AFTER_VOICEOVER_CURSOR = "drop marked item after voiceover cursor",
  DROP_MARKED_ITEM_BEFORE_CHOSEN_HOT_SPOT = "drop marked item before chosen hot spot",
  DROP_MARKED_ITEM_BEFORE_VOICEOVER_CURSOR = "drop marked item before voiceover cursor",
  DROP_MARKED_ITEM_ON_CHOSEN_HOT_SPOT = "drop marked item on chosen hot spot",
  DROP_MARKED_ITEM_ON_VOICEOVER_CURSOR = "drop marked item on voiceover cursor",
  ESCAPE = "escape",
  FAST_FORWARD = "fast-forward",
  IGNORE_NEXT_KEYPRESS = "ignore next keypress",
  INTERACT_WITH_SCROLL_BAR = "interact with scroll bar",
  ITEM_CHOOSER = "item chooser",
  KEYBOARD_HELP = "keyboard help",
  LABEL_ITEM = "label item",
  MAGIC_TAP = "magic tap",
  MARK_ITEM_TO_DRAG_AND_DROP = "mark item to drag and drop",
  MORE_CONTENT = "more content",
  MOUSE_DOWN = "mouse down",
  MOUSE_UP = "mouse up",
  MOVE_DOWN = "move down",
  MOVE_LEFT = "move left",
  MOVE_RIGHT = "move right",
  MOVE_UP = "move up",
  OPEN_ACTIVITY_CHOOSER = "open activity chooser",
  OPEN_APPLICATION_CHOOSER = "open application chooser",
  OPEN_COMMANDS_MENU = "open commands menu",
  OPEN_CONTROL_CENTER = "open control center",
  OPEN_NEXT_SPEECH_ATTRIBUTE_GUIDE = "open next speech attribute guide",
  OPEN_NOTIFICATION_CENTRE = "open notification centre",
  OPEN_PREVIOUS_SPEECH_ATTRIBUTE_GUIDE = "open previous speech attribute guide",
  OPEN_QUICK_START_TUTORIAL = "open quick start tutorial",
  OPEN_SHORTCUT_MENU = "open shortcut menu",
  OPEN_THE_ANNOUNCEMENT_HISTORY_MENU = "open the announcement history menu",
  OPEN_THE_NOTIFICATIONS_MENU = "open the notifications menu",
  OPEN_VERBOSITY_ROTOR = "open verbosity rotor",
  OPEN_VOICEOVER_HELP_MENU = "open voiceover help menu",
  OPEN_VOICEOVER_UTILITY = "open voiceover utility",
  OPEN_WINDOW_CHOOSER = "open window chooser",
  PAUSE_OR_RESUME_SPEAKING = "pause or resume speaking",
  PERFORM_ACTION_FOR_ITEM = "perform action for item",
  PREVIOUS_ACTIVITY = "previous activity",
  READ_CONTENTS_OF_VOICEOVER_CURSOR = "read contents of voiceover cursor",
  READ_CONTENTS_OF_WINDOW = "read contents of window",
  READ_CURRENT_ITEM_ALPHABETICALLY = "read current item alphabetically",
  READ_CURRENT_ITEM_PHONETICALLY = "read current item phonetically",
  READ_HELP_TAG_FOR_ITEM = "read help tag for item",
  READ_IMAGE_DESCRIPTION_FOR_ITEM = "read image description for item",
  READ_SELECTED_TEXT_OR_ITEM = "read selected text or item",
  READ_VISIBLE_TEXT = "read visible text",
  READ_VOICEOVER_HINT = "read voiceover hint",
  REMOVE_FROM_WINDOW_SPOTS = "remove from window spots",
  REWIND = "rewind",
  RIGHT_CLICK_MOUSE = "right click mouse",
  ROTOR = "rotor",
  SELECT_ITEM = "select item",
  SELECT_NEXT_OPTION_DOWN_IN_SPEECH_ATTRIBUTE_GUIDE = "select next option down in speech attribute guide",
  SELECT_NEXT_OPTION_UP_IN_SPEECH_ATTRIBUTE_GUIDE = "select next option up in speech attribute guide",
  SET_AS_A_WINDOW_SPOT = "set as a window spot",
  SET_THE_SWEET_SPOT = "set the sweet spot",
  START_INTERACTING_WITH_ITEM = "start interacting with item",
  STOP_INTERACTING_WITH_ITEM = "stop interacting with item",
  TOGGLE_CURSOR_TRACKING_ON_OR_OFF = "toggle cursor tracking on or off",
  TOGGLE_DISCLOSURE_TRIANGLE_OPEN_OR_CLOSED = "toggle disclosure triangle open or closed",
  TOGGLE_KEYBOARD_COMMANDER_ON_OR_OFF = "toggle keyboard commander on or off",
  TOGGLE_MULTIPLE_SELECTION_ON_OR_OFF = "toggle multiple selection on or off",
  TOGGLE_NUMPAD_COMMANDER_ON_OR_OFF = "toggle numpad commander on or off",
  TOGGLE_QUICK_NAV_ON_OR_OFF = "toggle quick nav on or off",
  TOGGLE_SCREEN_CURTAIN_ON_OR_OFF = "toggle screen curtain on or off",
  TOGGLE_SINGLE_KEY_QUICK_NAV_ON_OR_OFF = "toggle single-key quick nav on or off",
  TOGGLE_THE_VO_MODIFIER_LOCK_ON_OR_OFF = "toggle the vo modifier lock on or off",
  TOGGLE_TRACKPAD_COMMANDER_ON_OR_OFF = "toggle trackpad commander on or off",
  USER_GUIDE = "user guide",

  // Information Commands

  DESCRIBE_ITEM_IN_MOUSE_POINTER = "describe item in mouse pointer",
  DESCRIBE_ITEM_IN_VOICEOVER_CURSOR = "describe item in voiceover cursor",
  DESCRIBE_ITEM_WITH_KEYBOARD_FOCUS = "describe item with keyboard focus",
  DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_SCREEN = "describe mouse pointer location (from top left of screen)",
  DESCRIBE_MOUSE_POINTER_LOCATION_FROM_TOP_LEFT_OF_WINDOW = "describe mouse pointer location (from top left of window)",
  DESCRIBE_OPEN_APPLICATIONS = "describe open applications",
  DESCRIBE_POSITION_OF_ITEM_IN_VOICEOVER_CURSOR = "describe position of item in voiceover cursor",
  DESCRIBE_SIZE_OF_ITEM_IN_VOICEOVER_CURSOR = "describe size of item in voiceover cursor",
  DESCRIBE_WINDOW = "describe window",

  // Navigation Commands

  GO_DOWN_ONE_PAGE = "go down one page",
  GO_LEFT_A_BIT = "go left a bit",
  GO_LEFT_ONE_PAGE = "go left one page",
  GO_RIGHT_A_BIT = "go right a bit",
  GO_RIGHT_ONE_PAGE = "go right one page",
  GO_TO_BEGINNING = "go to beginning",
  GO_TO_BOTTOM_OF_WINDOW = "go to bottom of window",
  GO_TO_DESKTOP = "go to desktop",
  GO_TO_DOCK = "go to dock",
  GO_TO_END = "go to end",
  GO_TO_LINKED_ITEM = "go to linked item",
  GO_TO_MENU_BAR = "go to menu bar",
  GO_TO_POP_UP_ITEM = "go to pop-up item",
  GO_TO_STATUS_MENUS = "go to status menus",
  GO_TO_TOP_OF_WINDOW = "go to top of window",
  GO_TO_VISIBLE_BEGINNING = "go to visible beginning",
  GO_TO_VISIBLE_END = "go to visible end",
  GO_UP_ONE_PAGE = "go up one page",
  MOVE_DOWN_IN_ROTOR = "move down in rotor",
  MOVE_KEYBOARD_FOCUS_TO_VOICEOVER_CURSOR = "move keyboard focus to voiceover cursor",
  MOVE_MOUSE_POINTER_TO_VOICEOVER_CURSOR = "move mouse pointer to voiceover cursor",
  MOVE_TO_AREA_AFTER_SPLITTER = "move to area after splitter",
  MOVE_TO_AREA_BEFORE_SPLITTER = "move to area before splitter",
  MOVE_TO_NEXT_SECTION = "move to next section",
  MOVE_TO_PREVIOUS_SECTION = "move to previous section",
  MOVE_UP_IN_ROTOR = "move up in rotor",
  MOVE_VOICEOVER_CURSOR_TO_KEYBOARD_FOCUS = "move voiceover cursor to keyboard focus",
  MOVE_VOICEOVER_CURSOR_TO_MOUSE_POINTER = "move voiceover cursor to mouse pointer",
  NEXT_CONTENT = "next content",
  NEXT_ROTOR_ITEM = "next rotor item",
  PREVIOUS_CONTENT = "previous content",
  PREVIOUS_ROTO_ITEM = "previous rotor item",
  ROTATE_LEFT = "rotate left",
  ROTATE_RIGHT = "rotate right",
  SCROLL_DOWN_ONE_PAGE = "scroll down one page",
  SCROLL_LEFT_ONE_PAGE = "scroll left one page",
  SCROLL_RIGHT_ONE_PAGE = "scroll right one page",
  SCROLL_UP_ONE_PAGE = "scroll up one page",
  SPEAK_CURRENT_PAGE_IN_SCROLL_AREA = "speak current page in scroll area",
  SWITCH_WINDOW = "switch window",
  TOGGLE_VOICEOVER_CURSOR_FOLLOWS_MOUSE_ON_OR_OFF = "toggle voiceover cursor follows mouse on or off",

  // TODO: Text Commands

  // TODO: Web Commands

  // TODO: Find Commands

  // TODO: Tables Commands

  // TODO: Size and Position Commands

  // TODO: Audio Commands

  // TODO: Braille Commands

  // TODO: Visuals Commands

  // TODO: Speech Commands

  // TODO: Hot Spots Commands

  // TODO: Custom Commands
}
