export const serviceDefinition = {
  modules: {
    ActionPresenter: {
      commands: {
        ShowActionsList: {
          description:
            "Shows a list of all the accessible actions exposed by the focused object.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/ActionPresenter",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
    BraillePresenter: {
      commands: {
        ToggleMonitor: {
          description: "Toggles the braille monitor on and off.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/BraillePresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AvailableContractionTables: {
          description: "Returns a list of available contraction table names.",
        },
        BrailleIsEnabled: {
          description: "Returns whether braille is enabled.",
        },
        BrailleProgressBarUpdates: {
          description:
            "Returns whether braille progress bar updates are enabled.",
        },
        ComputerBrailleAtCursorIsEnabled: {
          description:
            "Returns whether computer braille is used at the cursor position.",
        },
        ContractedBrailleIsEnabled: {
          description: "Returns whether contracted braille is enabled.",
        },
        ContractionTable: {
          description: "Returns the current braille contraction table name.",
        },
        DisplayAncestors: {
          description:
            "Returns whether ancestors of the current object will be displayed.",
        },
        EndOfLineIndicatorIsEnabled: {
          description: "Returns whether the end-of-line indicator is enabled.",
        },
        FlashMessageDuration: {
          description: "Returns flash message duration in milliseconds.",
        },
        FlashMessagesAreDetailed: {
          description:
            "Returns whether 'flash' messages are detailed (as opposed to brief).",
        },
        FlashMessagesAreEnabled: {
          description:
            "Returns whether 'flash' messages (i.e. announcements) are enabled.",
        },
        FlashMessagesArePersistent: {
          description:
            "Returns whether 'flash' messages are persistent (as opposed to temporary).",
        },
        LinkIndicator: {
          description: "Returns the braille link indicator style.",
        },
        MonitorBackground: {
          description: "Returns the braille monitor background color.",
        },
        MonitorCellCount: {
          description: "Returns the configured braille monitor cell count.",
        },
        MonitorForeground: {
          description: "Returns the braille monitor foreground color.",
        },
        MonitorIsEnabled: {
          description: "Returns whether the braille monitor is enabled.",
        },
        MonitorShowDots: {
          description:
            "Returns whether the braille monitor shows Unicode braille dots.",
        },
        PresentMnemonics: {
          description:
            "Returns whether mnemonics are presented on the braille display.",
        },
        ProgressBarBrailleInterval: {
          description:
            "Returns the braille progress bar update interval in seconds.",
        },
        ProgressBarBrailleVerbosity: {
          description: "Returns the braille progress bar verbosity level.",
        },
        RolenameStyle: {
          description:
            "Returns the current rolename style for object presentation.",
        },
        SelectorIndicator: {
          description: "Returns the braille selector indicator style.",
        },
        TextAttributesIndicator: {
          description: "Returns the braille text attributes indicator style.",
        },
        VerbosityLevel: {
          description:
            "Returns the current braille verbosity level for object presentation.",
        },
        WordWrapIsEnabled: {
          description: "Returns whether braille word wrap is enabled.",
        },
      },
      runtimeSetters: {
        BrailleIsEnabled: {
          description: "Sets whether braille is enabled.",
        },
        BrailleProgressBarUpdates: {
          description: "Sets whether braille progress bar updates are enabled.",
        },
        ComputerBrailleAtCursorIsEnabled: {
          description:
            "Sets whether computer braille is used at the cursor position.",
        },
        ContractedBrailleIsEnabled: {
          description: "Sets whether contracted braille is enabled.",
        },
        ContractionTable: {
          description: "Sets the current braille contraction table.",
        },
        DisplayAncestors: {
          description:
            "Sets whether ancestors of the current object will be displayed.",
        },
        EndOfLineIndicatorIsEnabled: {
          description: "Sets whether the end-of-line indicator is enabled.",
        },
        FlashMessageDuration: {
          description: "Sets flash message duration in milliseconds.",
        },
        FlashMessagesAreDetailed: {
          description:
            "Sets whether 'flash' messages are detailed (as opposed to brief).",
        },
        FlashMessagesAreEnabled: {
          description:
            "Sets whether 'flash' messages (i.e. announcements) are enabled.",
        },
        FlashMessagesArePersistent: {
          description:
            "Sets whether 'flash' messages are persistent (as opposed to temporary).",
        },
        LinkIndicator: {
          description: "Sets the braille link indicator style.",
        },
        MonitorBackground: {
          description: "Sets the braille monitor background color.",
        },
        MonitorCellCount: {
          description: "Sets the braille monitor cell count.",
        },
        MonitorForeground: {
          description: "Sets the braille monitor foreground color.",
        },
        MonitorIsEnabled: {
          description: "Sets whether the braille monitor is enabled.",
        },
        MonitorShowDots: {
          description:
            "Sets whether the braille monitor shows Unicode braille dots.",
        },
        PresentMnemonics: {
          description:
            "Sets whether mnemonics are presented on the braille display.",
        },
        ProgressBarBrailleInterval: {
          description:
            "Sets the braille progress bar update interval in seconds.",
        },
        ProgressBarBrailleVerbosity: {
          description: "Sets the braille progress bar verbosity level.",
        },
        RolenameStyle: {
          description:
            "Sets the current rolename style for object presentation.",
        },
        SelectorIndicator: {
          description: "Sets the braille selector indicator style.",
        },
        TextAttributesIndicator: {
          description: "Sets the braille text attributes indicator style.",
        },
        VerbosityLevel: {
          description:
            "Sets the braille verbosity level for object presentation.",
        },
        WordWrapIsEnabled: {
          description: "Sets whether braille word wrap is enabled.",
        },
      },
    },
    CaretNavigator: {
      commands: {
        EndOfFile: {
          description: "Moves to the end of the file.",
          representation: "Ctrl-End",
        },
        EndOfLine: {
          description: "Moves to the end of the line.",
          representation: "End",
        },
        NextCharacter: {
          description: "Moves to the next character.",
          representation: "Right",
        },
        NextLine: {
          description: "Moves to the next line.",
          representation: "Down",
        },
        NextWord: {
          description: "Moves to the next word.",
          representation: "Ctrl-Right",
        },
        PreviousCharacter: {
          description: "Moves to the previous character.",
          representation: "Left",
        },
        PreviousLine: {
          description: "Moves to the previous line.",
          representation: "Up",
        },
        PreviousWord: {
          description: "Moves to the previous word.",
          representation: "Ctrl-Left",
        },
        StartOfFile: {
          description: "Moves to the start of the file.",
          representation: "Ctrl-Home",
        },
        StartOfLine: {
          description: "Moves to the start of the line.",
          representation: "Home",
        },
        ToggleEnabled: {
          description: "Toggles caret navigation.",
          representation: "ORCA-F12",
        },
        ToggleLayoutMode: {
          description:
            "Switches between object mode and layout mode for line presentation.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/CaretNavigator",
      parameterizedCommands: {},
      runtimeGetters: {
        IsEnabled: {
          description: "Returns whether caret navigation is enabled.",
        },
        LayoutMode: {
          description: "Returns whether layout mode is enabled.",
        },
        TriggersFocusMode: {
          description: "Returns whether caret navigation triggers focus mode.",
        },
      },
      runtimeSetters: {
        IsEnabled: {
          description: "Sets whether caret navigation is enabled.",
        },
        LayoutMode: {
          description: "Sets whether layout mode is enabled.",
        },
        TriggersFocusMode: {
          description: "Sets whether caret navigation triggers focus mode.",
        },
      },
    },
    ChatPresenter: {
      commands: {
        PresentNextMessage: {
          description:
            "Navigate to and present the next chat message in the history.",
          representation: "ORCA-Alt-Down",
        },
        PresentPreviousMessage: {
          description:
            "Navigate to and present the previous chat message in the history.",
          representation: "ORCA-Alt-Up",
        },
        ToggleBuddyTyping: {
          description:
            "Toggles whether we announce when our buddies are typing a message.",
          representation: "ORCA-Alt-F11",
        },
        ToggleMessageHistories: {
          description:
            "Toggles whether we provide chat room specific message histories.",
          representation: "ORCA-Alt-F12",
        },
        TogglePrefix: {
          description:
            "Toggles whether we prefix chat room messages with the name of the chat room.",
          representation: "ORCA-Alt-F10",
        },
      },
      objectPath: "/org/gnome/Orca/Service/ChatPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AnnounceBuddyTyping: {
          description: "Returns whether to announce when buddies are typing.",
        },
        MessageVerbosity: {
          description: "Returns the chat message verbosity setting.",
        },
        RoomHistories: {
          description:
            "Returns whether to provide chat room specific message histories.",
        },
        SpeakRoomName: {
          description: "Returns whether to speak the chat room name.",
        },
        SpeakRoomNameLast: {
          description:
            "Returns whether to speak the chat room name after the message.",
        },
      },
      runtimeSetters: {
        AnnounceBuddyTyping: {
          description: "Sets whether to announce when buddies are typing.",
        },
        MessageVerbosity: {
          description: "Sets the chat message verbosity setting.",
        },
        RoomHistories: {
          description:
            "Sets whether to provide chat room specific message histories.",
        },
        SpeakRoomName: {
          description: "Sets whether to speak the chat room name.",
        },
        SpeakRoomNameLast: {
          description:
            "Sets whether to speak the chat room name after the message.",
        },
      },
    },
    ClipboardPresenter: {
      commands: {
        PresentClipboardContents: {
          description: "Presents the clipboard contents.",
          representation: "ORCA-C",
        },
      },
      objectPath: "/org/gnome/Orca/Service/ClipboardPresenter",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
    CommandManager: {
      commands: {
        ToggleKeyboardLayout: {
          description: "Toggles between desktop and laptop keyboard layout.",
          representation: "ORCA-Shift-F12",
        },
      },
      objectPath: "/org/gnome/Orca/Service/CommandManager",
      parameterizedCommands: {},
      runtimeGetters: {
        DesktopModifierKeys: {
          description:
            "Returns the per-layout modifier keys for the desktop layout.",
        },
        KeyboardLayoutIsDesktop: {
          description:
            "Returns True if the current keyboard layout is desktop.",
        },
        LaptopModifierKeys: {
          description:
            "Returns the per-layout modifier keys for the laptop layout.",
        },
      },
      runtimeSetters: {
        DesktopModifierKeys: {
          description:
            "Sets the per-layout modifier keys for the desktop layout.",
        },
        KeyboardLayoutIsDesktop: {
          description:
            "Sets whether the keyboard layout is desktop (True) or laptop (False).",
        },
        LaptopModifierKeys: {
          description:
            "Sets the per-layout modifier keys for the laptop layout.",
        },
      },
    },
    DocumentPresenter: {
      commands: {
        EnableStickyBrowseMode: {
          description: "Enables sticky browse mode.",
        },
        EnableStickyFocusMode: {
          description: "Enables sticky focus mode.",
        },
        TogglePresentationMode: {
          description:
            "Switches between browse mode and focus mode (user-initiated).",
          representation: "ORCA-Space",
        },
      },
      objectPath: "/org/gnome/Orca/Service/DocumentPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AutoStickyFocusModeForWebApps: {
          description:
            "Returns whether to auto-detect web apps and enable sticky focus mode.",
        },
        BrowseModeIsSticky: {
          description:
            "Returns True if browse mode is active and 'sticky' (web content only).",
        },
        FindResultsMinimumLength: {
          description:
            "Returns the minimum length for find results to be spoken.",
        },
        FocusModeIsSticky: {
          description:
            "Returns True if focus mode is active and 'sticky' (web content only).",
        },
        InFocusMode: {
          description:
            "Returns True if focus mode is active (web content only).",
        },
        NativeNavTriggersFocusMode: {
          description: "Returns whether native navigation triggers focus mode.",
        },
        OnlySpeakChangedLines: {
          description:
            "Returns whether to only speak changed lines during find.",
        },
        PageSummaryOnLoad: {
          description:
            "Returns whether to present a page summary when a document loads.",
        },
        SayAllOnLoad: {
          description:
            "Returns whether to perform say all when a document loads.",
        },
        SpeakFindResults: {
          description: "Returns whether to speak find results.",
        },
      },
      runtimeSetters: {
        AutoStickyFocusModeForWebApps: {
          description:
            "Sets whether to auto-detect web apps and enable sticky focus mode.",
        },
        FindResultsMinimumLength: {
          description: "Sets the minimum length for find results to be spoken.",
        },
        NativeNavTriggersFocusMode: {
          description: "Sets whether native navigation triggers focus mode.",
        },
        OnlySpeakChangedLines: {
          description: "Sets whether to only speak changed lines during find.",
        },
        PageSummaryOnLoad: {
          description:
            "Sets whether to present a page summary when a document loads.",
        },
        SayAllOnLoad: {
          description: "Sets whether to perform say all when a document loads.",
        },
        SpeakFindResults: {
          description: "Sets whether to speak find results.",
        },
      },
    },
    FlatReviewPresenter: {
      commands: {
        AppendToClipboard: {
          description: "Appends the string just presented to the clipboard.",
        },
        CopyToClipboard: {
          description: "Copies the string just presented to the clipboard.",
        },
        GetCurrentObject: {
          description: "Returns the current accessible object.",
        },
        GoAbove: {
          description: "Moves to the character above.",
          representation: "ORCA-KP4",
        },
        GoBelow: {
          description: "Moves to the character below.",
          representation: "ORCA-KP6",
        },
        GoBottomLeft: {
          description: "Moves to the bottom left of the current window.",
        },
        GoEnd: {
          description: "Moves to the bottom right of the current window.",
          representation: "ORCA-KP9",
        },
        GoEndOfLine: {
          description: "Moves to the end of the line.",
          representation: "ORCA-KP1",
        },
        GoHome: {
          description: "Moves to the top left of the current window.",
          representation: "ORCA-KP7",
        },
        GoNextCharacter: {
          description: "Moves to the next character.",
          representation: "ORCA-KP3",
        },
        GoNextItem: {
          description: "Moves to the next item or word.",
          representation: "ORCA-KP6",
        },
        GoNextLine: {
          description: "Moves to the next line.",
          representation: "ORCA-KP9",
        },
        GoPreviousCharacter: {
          description: "Moves to the previous character.",
          representation: "ORCA-KP1",
        },
        GoPreviousItem: {
          description: "Moves to the previous item or word.",
          representation: "ORCA-KP4",
        },
        GoPreviousLine: {
          description: "Moves to the previous line.",
          representation: "KP7",
        },
        GoStartOfLine: {
          description: "Moves to the beginning of the current line.",
          representation: "KP7",
        },
        LeftClickOnObject: {
          description:
            "Attempts to synthesize a left click on the current accessible.",
          representation: "ORCA-KP/",
        },
        PhoneticItem: {
          description:
            "Presents the current word letter by letter phonetically.",
        },
        PhoneticLine: {
          description:
            "Presents the current line letter by letter phonetically.",
        },
        PresentCharacter: {
          description: "Presents the current character.",
          representation: "KP2",
        },
        PresentItem: {
          description: "Presents the current item/word.",
          representation: "KP5",
        },
        PresentLine: {
          description: "Presents the current line.",
          representation: "KP8",
        },
        PresentObject: {
          description: "Presents the current accessible object.",
        },
        RightClickOnObject: {
          description:
            "Attempts to synthesize a right click on the current accessible.",
          representation: "ORCA-KP*",
        },
        RoutePointerToObject: {
          description: "Routes the mouse pointer to the current accessible.",
          representation: "ORCA-KP/",
        },
        SayAll: {
          description: "Speaks the contents of the entire window.",
          representation: "KP+",
        },
        ShowContents: {
          description:
            "Displays the entire flat review contents in a text view.",
        },
        SpellCharacter: {
          description: "Presents the current character phonetically.",
        },
        SpellItem: {
          description: "Presents the current item/word letter by letter.",
        },
        SpellLine: {
          description: "Presents the current line letter by letter.",
        },
        ToggleFlatReviewMode: {
          description:
            "Toggles between flat review mode and focus tracking mode.",
          representation: "ORCA-KP-",
        },
        ToggleRestrict: {
          description:
            "Toggles the restricting of flat review to the current object.",
        },
        UnicodeCurrentCharacter: {
          description: "Presents the current character's unicode value.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/FlatReviewPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        IsRestricted: {
          description:
            "Returns whether flat review is restricted to the current object.",
        },
      },
      runtimeSetters: {
        IsRestricted: {
          description:
            "Sets whether flat review is restricted to the current object.",
        },
      },
    },
    MouseReviewer: {
      commands: {
        Toggle: {
          description: "Toggle mouse reviewing on or off (requires Wnck).",
          representation: "ORCA-M",
        },
      },
      objectPath: "/org/gnome/Orca/Service/MouseReviewer",
      parameterizedCommands: {},
      runtimeGetters: {
        IsEnabled: {
          description:
            "Returns whether mouse review is enabled (requires Wnck).",
        },
        PresentTooltips: {
          description:
            "Returns whether tooltips displayed due to mouse hover are spoken (requires X11).",
        },
      },
      runtimeSetters: {
        IsEnabled: {
          description: "Sets whether mouse review is enabled (requires Wnck).",
        },
        PresentTooltips: {
          description:
            "Sets whether tooltips displayed due to mouse hover are spoken (requires X11).",
        },
      },
    },
    NotificationPresenter: {
      commands: {
        PresentLastNotification: {
          description: "Presents the last notification.",
          representation: "ORCA-N",
        },
        PresentNextNotification: {
          description: "Presents the next notification.",
          representation: "ORCA-Shift-N",
        },
        PresentPreviousNotification: {
          description: "Presents the previous notification.",
          representation: "ORCA-Ctrl-N",
        },
        ShowNotificationList: {
          description: "Opens a dialog with a list of the notifications.",
          representation: "ORCA-Alt-N",
        },
      },
      objectPath: "/org/gnome/Orca/Service/NotificationPresenter",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
    ObjectNavigator: {
      commands: {
        MoveToFirstChild: {
          description:
            "Moves the navigator focus to the first child of the current focus.",
          representation: "ORCA-Shift-Down",
        },
        MoveToNextSibling: {
          description:
            "Moves the navigator focus to the next sibling of the current focus.",
          representation: "ORCA-Down",
        },
        MoveToParent: {
          description:
            "Moves the navigator focus to the parent of the current focus.",
          representation: "ORCA-Shift-Up",
        },
        MoveToPreviousSibling: {
          description:
            "Moves the navigator focus to the previous sibling of the current focus.",
          representation: "ORCA-Up",
        },
        PerformAction: {
          description: "Attempts to click on the current focus.",
          representation: "ORCA-Enter",
        },
        ToggleSimplify: {
          description: "Toggles simplified navigation.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/ObjectNavigator",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
    ProfileManager: {
      commands: {
        CycleSettingsProfile: {
          description: "Cycle through the user's existing settings profiles.",
          representation: "ORCA-Ctrl-S",
        },
        PresentCurrentProfile: {
          description: "Present the name of the currently active profile.",
          representation: "ORCA-Ctrl-P",
        },
      },
      objectPath: "/org/gnome/Orca/Service/ProfileManager",
      parameterizedCommands: {},
      runtimeGetters: {
        ActiveProfile: {
          description:
            "Returns the internal name of the currently active profile.",
        },
        AvailableProfiles: {
          description:
            "Returns list of available profiles as [display_name, internal_name] pairs.",
        },
        StartingProfile: {
          description: "Returns the starting profile (always Default).",
        },
      },
      runtimeSetters: {
        ActiveProfile: {
          description: "Sets the active profile by internal name.",
        },
        StartingProfile: {
          description:
            "No-op for backwards compatibility. Starting profile is always Default.",
        },
      },
    },
    SayAllPresenter: {
      commands: {
        FastForward: {
          description: "Jumps forward in the current Say All.",
          representation: "Down",
        },
        Rewind: {
          description: "Jumps back in the current Say All.",
          representation: "Up",
        },
        SayAll: {
          description:
            "Speaks the entire document or text, starting from the current position.",
          representation: "ORCA-KP+",
        },
      },
      objectPath: "/org/gnome/Orca/Service/SayAllPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AnnounceBlockquote: {
          description:
            "Returns whether blockquotes are announced when entered.",
        },
        AnnounceForm: {
          description:
            "Returns whether non-landmark forms are announced when entered.",
        },
        AnnounceGrouping: {
          description: "Returns whether groupings are announced when entered.",
        },
        AnnounceLandmark: {
          description: "Returns whether landmarks are announced when entered.",
        },
        AnnounceList: {
          description: "Returns whether lists are announced when entered.",
        },
        AnnounceTable: {
          description: "Returns whether tables are announced when entered.",
        },
        OnlySpeakDisplayedText: {
          description: "Returns whether Say All only speaks displayed text.",
        },
        RewindAndFastForwardEnabled: {
          description: "Returns whether Up and Down can be used in Say All.",
        },
        StructuralNavigationEnabled: {
          description:
            "Returns whether structural navigation keys can be used in Say All.",
        },
        Style: {
          description: "Returns the current Say All style.",
        },
      },
      runtimeSetters: {
        AnnounceBlockquote: {
          description: "Sets whether blockquotes are announced when entered.",
        },
        AnnounceForm: {
          description:
            "Sets whether non-landmark forms are announced when entered.",
        },
        AnnounceGrouping: {
          description: "Sets whether groupings are announced when entered.",
        },
        AnnounceLandmark: {
          description: "Sets whether landmarks are announced when entered.",
        },
        AnnounceList: {
          description: "Sets whether lists are announced when entered.",
        },
        AnnounceTable: {
          description: "Sets whether tables are announced when entered.",
        },
        OnlySpeakDisplayedText: {
          description: "Sets whether Say All only speaks displayed text.",
        },
        RewindAndFastForwardEnabled: {
          description: "Returns whether Up and Down can be used in Say All.",
        },
        StructuralNavigationEnabled: {
          description:
            "Sets whether structural navigation keys can be used in Say All.",
        },
        Style: {
          description: "Sets the current Say All style.",
        },
      },
    },
    SleepModeManager: {
      commands: {
        ToggleSleepMode: {
          description: "Toggles sleep mode for the active application.",
          representation: "ORCA-Shift-S",
        },
      },
      objectPath: "/org/gnome/Orca/Service/SleepModeManager",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
    SoundPresenter: {
      commands: {},
      objectPath: "/org/gnome/Orca/Service/SoundPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        BeepProgressBarUpdates: {
          description: "Returns whether beep progress bar updates are enabled.",
        },
        ProgressBarBeepInterval: {
          description:
            "Returns the beep progress bar update interval in seconds.",
        },
        ProgressBarBeepVerbosity: {
          description: "Returns the beep progress bar verbosity level.",
        },
        SoundIsEnabled: {
          description: "Returns whether sound is enabled.",
        },
        SoundVolume: {
          description: "Returns the sound volume (0.0 to 1.0).",
        },
      },
      runtimeSetters: {
        BeepProgressBarUpdates: {
          description: "Sets whether beep progress bar updates are enabled.",
        },
        ProgressBarBeepInterval: {
          description: "Sets the beep progress bar update interval in seconds.",
        },
        ProgressBarBeepVerbosity: {
          description: "Sets the beep progress bar verbosity level.",
        },
        SoundIsEnabled: {
          description: "Sets whether sound is enabled.",
        },
        SoundVolume: {
          description: "Sets the sound volume (0.0 to 1.0).",
        },
      },
    },
    SpeechManager: {
      commands: {
        CycleCapitalizationStyle: {
          description:
            "Cycle through the speech-dispatcher capitalization styles.",
          representation: "ORCA-Alt-C",
        },
        CyclePunctuationLevel: {
          description: "Cycles through punctuation levels for speech.",
          representation: "ORCA-P",
        },
        CycleSynthesizer: {
          description: "Cycles through available speech synthesizers.",
          representation: "ORCA-Ctrl-S",
        },
        DecreasePitch: {
          description: "Decreases the speech pitch",
          representation: "ORCA-Alt-Left",
        },
        DecreaseRate: {
          description: "Decreases the speech rate.",
          representation: "ORCA-Ctrl-Left",
        },
        DecreaseVolume: {
          description: "Decreases the speech volume",
          representation: "ORCA-Alt-Down",
        },
        IncreasePitch: {
          description: "Increase the speech pitch",
          representation: "ORCA-Alt-Right",
        },
        IncreaseRate: {
          description: "Increases the speech rate.",
          representation: "ORCA-Ctrl-Right",
        },
        IncreaseVolume: {
          description: "Increases the speech volume",
          representation: "ORCA-Alt-Up",
        },
        InterruptSpeech: {
          description: "Interrupts the speech server.",
          representation: "Ctrl",
        },
        RefreshSpeech: {
          description: "Shuts down and re-initializes speech.",
        },
        ShutdownSpeech: {
          description: "Shuts down the speech server.",
        },
        StartSpeech: {
          description: "Starts the speech server.",
        },
        ToggleSpeech: {
          description: "Toggles speech on and off.",
          representation: "ORCA-S",
        },
      },
      objectPath: "/org/gnome/Orca/Service/SpeechManager",
      parameterizedCommands: {
        GetVoicesForLanguage: {
          description:
            "Returns a list of available voices for the specified language.",
          parameters: [
            {
              name: "language",
              type: "str",
            },
            {
              name: "variant",
              type: "str",
            },
            {
              name: "notify_user",
              type: "bool",
            },
          ],
        },
      },
      runtimeGetters: {
        AutoLanguageSwitching: {
          description:
            "Returns whether automatic language switching is enabled.",
        },
        AvailableServers: {
          description: "Returns a list of available servers.",
        },
        AvailableSynthesizers: {
          description:
            "Returns a list of available synthesizers of the speech server.",
        },
        AvailableVoices: {
          description:
            "Returns a list of available voices for the current synthesizer.",
        },
        CapitalizationStyle: {
          description: "Returns the current capitalization style.",
        },
        CurrentServer: {
          description:
            "Returns the name of the current speech server (Speech Dispatcher or Spiel).",
        },
        CurrentSynthesizer: {
          description: "Returns the current synthesizer of the speech server.",
        },
        CurrentVoice: {
          description: "Returns the current voice name.",
        },
        InsertPausesBetweenUtterances: {
          description:
            "Returns whether pauses are inserted between utterances, e.g. between name and role.",
        },
        Pitch: {
          description: "Returns the current speech pitch.",
        },
        PunctuationLevel: {
          description: "Returns the current punctuation level.",
        },
        Rate: {
          description: "Returns the current speech rate.",
        },
        SpeakNumbersAsDigits: {
          description: "Returns whether numbers are spoken as digits.",
        },
        SpeechIsEnabled: {
          description:
            "Returns whether the speech server is enabled. See also is-muted.",
        },
        SpeechIsMuted: {
          description: "Returns whether speech output is temporarily muted.",
        },
        UseColorNames: {
          description:
            "Returns whether colors are announced by name or as RGB values.",
        },
        UsePronunciationDictionary: {
          description:
            "Returns whether the user's pronunciation dictionary should be applied.",
        },
        Volume: {
          description: "Returns the current speech volume.",
        },
      },
      runtimeSetters: {
        AutoLanguageSwitching: {
          description: "Sets whether automatic language switching is enabled.",
        },
        CapitalizationStyle: {
          description: "Sets the capitalization style.",
        },
        CurrentServer: {
          description:
            "Sets the current speech server (e.g. Speech Dispatcher or Spiel).",
        },
        CurrentSynthesizer: {
          description:
            "Sets the current synthesizer of the active speech server.",
        },
        CurrentVoice: {
          description: "Sets the current voice for the active synthesizer.",
        },
        InsertPausesBetweenUtterances: {
          description:
            "Sets whether pauses are inserted between utterances, e.g. between name and role.",
        },
        Pitch: {
          description:
            "Sets the current speech pitch (0.0-10.0, default: 5.0).",
        },
        PunctuationLevel: {
          description: "Sets the punctuation level.",
        },
        Rate: {
          description: "Sets the current speech rate (0-100, default: 50).",
        },
        SpeakNumbersAsDigits: {
          description: "Sets whether numbers are spoken as digits.",
        },
        SpeechIsEnabled: {
          description:
            "Sets whether the speech server is enabled. See also is-muted.",
        },
        SpeechIsMuted: {
          description: "Sets whether speech output is temporarily muted.",
        },
        UseColorNames: {
          description:
            "Sets whether colors are announced by name or as RGB values.",
        },
        UsePronunciationDictionary: {
          description:
            "Sets whether the user's pronunciation dictionary should be applied.",
        },
        Volume: {
          description:
            "Sets the current speech volume (0.0-10.0, default: 10.0).",
        },
      },
    },
    SpeechPresenter: {
      commands: {
        ChangeNumberStyle: {
          description: "Changes spoken number style between digits and words.",
        },
        ToggleIndentationAndJustification: {
          description: "Toggles the speaking of indentation and justification.",
        },
        ToggleMonitor: {
          description: "Toggles the speech monitor on and off.",
        },
        ToggleTableCellReadingMode: {
          description: "Toggles between speak cell and speak row.",
        },
        ToggleVerbosity: {
          description:
            "Toggles speech verbosity level between verbose and brief.",
        },
      },
      objectPath: "/org/gnome/Orca/Service/SpeechPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AlwaysAnnounceSelectedRangeInSpreadsheet: {
          description:
            "Returns whether the selected range in spreadsheets is always announced.",
        },
        AnnounceBlockquote: {
          description:
            "Returns whether blockquotes are announced when entered.",
        },
        AnnounceCellCoordinates: {
          description:
            "Returns whether (non-spreadsheet) cell coordinates are announced.",
        },
        AnnounceCellHeaders: {
          description: "Returns whether cell headers are announced.",
        },
        AnnounceCellSpan: {
          description:
            "Returns whether cell spans are announced when greater than 1.",
        },
        AnnounceForm: {
          description:
            "Returns whether non-landmark forms are announced when entered.",
        },
        AnnounceGrouping: {
          description: "Returns whether groupings are announced when entered.",
        },
        AnnounceLandmark: {
          description: "Returns whether landmarks are announced when entered.",
        },
        AnnounceList: {
          description: "Returns whether lists are announced when entered.",
        },
        AnnounceSpreadsheetCellCoordinates: {
          description:
            "Returns whether spreadsheet cell coordinates are announced.",
        },
        AnnounceTable: {
          description: "Returns whether tables are announced when entered.",
        },
        MessagesAreDetailed: {
          description:
            "Returns whether informative messages will be detailed or brief.",
        },
        MonitorBackground: {
          description: "Returns the speech monitor background color.",
        },
        MonitorFontSize: {
          description: "Returns the speech monitor font size.",
        },
        MonitorForeground: {
          description: "Returns the speech monitor foreground color.",
        },
        MonitorIsEnabled: {
          description: "Returns whether the speech monitor is enabled.",
        },
        OnlySpeakDisplayedText: {
          description: "Returns whether only displayed text should be spoken.",
        },
        ProgressBarSpeechInterval: {
          description:
            "Returns the speech progress bar update interval in seconds.",
        },
        ProgressBarSpeechVerbosity: {
          description: "Returns the speech progress bar verbosity level.",
        },
        RepeatedCharacterLimit: {
          description:
            "Returns the count at which repeated, non-alphanumeric symbols will be described.",
        },
        SpeakBlankLines: {
          description: "Returns whether blank lines will be spoken.",
        },
        SpeakDescription: {
          description: "Returns whether object descriptions are spoken.",
        },
        SpeakIndentationAndJustification: {
          description:
            "Returns whether speaking of indentation and justification is enabled.",
        },
        SpeakIndentationOnlyIfChanged: {
          description:
            "Returns whether indentation will be announced only if it has changed.",
        },
        SpeakMisspelledIndicator: {
          description: "Returns whether the misspelled indicator is spoken.",
        },
        SpeakPositionInSet: {
          description:
            "Returns whether the position and set size of objects are spoken.",
        },
        SpeakProgressBarUpdates: {
          description:
            "Returns whether speech progress bar updates are enabled.",
        },
        SpeakRowInDocumentTable: {
          description:
            "Returns whether Up/Down in text-document tables speaks the row or just the cell.",
        },
        SpeakRowInGuiTable: {
          description:
            "Returns whether Up/Down in GUI tables speaks the row or just the cell.",
        },
        SpeakRowInSpreadsheet: {
          description:
            "Returns whether Up/Down in spreadsheets speaks the row or just the cell.",
        },
        SpeakTutorialMessages: {
          description: "Returns whether tutorial messages are spoken.",
        },
        SpeakWidgetMnemonic: {
          description: "Returns whether widget mnemonics are spoken.",
        },
        VerbosityLevel: {
          description:
            "Returns the current speech verbosity level for object presentation.",
        },
      },
      runtimeSetters: {
        AlwaysAnnounceSelectedRangeInSpreadsheet: {
          description:
            "Sets whether the selected range in spreadsheets is always announced.",
        },
        AnnounceBlockquote: {
          description: "Sets whether blockquotes are announced when entered.",
        },
        AnnounceCellCoordinates: {
          description:
            "Sets whether (non-spreadsheet) cell coordinates are announced.",
        },
        AnnounceCellHeaders: {
          description: "Sets whether cell headers are announced.",
        },
        AnnounceCellSpan: {
          description:
            "Sets whether cell spans are announced when greater than 1.",
        },
        AnnounceForm: {
          description:
            "Sets whether non-landmark forms are announced when entered.",
        },
        AnnounceGrouping: {
          description: "Sets whether groupings are announced when entered.",
        },
        AnnounceLandmark: {
          description: "Sets whether landmarks are announced when entered.",
        },
        AnnounceList: {
          description: "Sets whether lists are announced when entered.",
        },
        AnnounceSpreadsheetCellCoordinates: {
          description:
            "Sets whether spreadsheet cell coordinates are announced.",
        },
        AnnounceTable: {
          description: "Sets whether tables are announced when entered.",
        },
        MessagesAreDetailed: {
          description:
            "Sets whether informative messages will be detailed or brief.",
        },
        MonitorBackground: {
          description: "Sets the speech monitor background color.",
        },
        MonitorFontSize: {
          description: "Sets the speech monitor font size.",
        },
        MonitorForeground: {
          description: "Sets the speech monitor foreground color.",
        },
        MonitorIsEnabled: {
          description: "Sets whether the speech monitor is enabled.",
        },
        OnlySpeakDisplayedText: {
          description: "Sets whether only displayed text should be spoken.",
        },
        ProgressBarSpeechInterval: {
          description:
            "Sets the speech progress bar update interval in seconds.",
        },
        ProgressBarSpeechVerbosity: {
          description: "Sets the speech progress bar verbosity level.",
        },
        RepeatedCharacterLimit: {
          description:
            "Sets the count at which repeated, non-alphanumeric symbols will be described.",
        },
        SpeakBlankLines: {
          description: "Sets whether blank lines will be spoken.",
        },
        SpeakDescription: {
          description: "Sets whether object descriptions are spoken.",
        },
        SpeakIndentationAndJustification: {
          description:
            "Sets whether speaking of indentation and justification is enabled.",
        },
        SpeakIndentationOnlyIfChanged: {
          description:
            "Sets whether indentation will be announced only if it has changed.",
        },
        SpeakMisspelledIndicator: {
          description: "Sets whether the misspelled indicator is spoken.",
        },
        SpeakPositionInSet: {
          description:
            "Sets whether the position and set size of objects are spoken.",
        },
        SpeakProgressBarUpdates: {
          description: "Sets whether speech progress bar updates are enabled.",
        },
        SpeakRowInDocumentTable: {
          description:
            "Sets whether Up/Down in text-document tables speaks the row or just the cell.",
        },
        SpeakRowInGuiTable: {
          description:
            "Sets whether Up/Down in GUI tables speaks the row or just the cell.",
        },
        SpeakRowInSpreadsheet: {
          description:
            "Sets whether Up/Down in spreadsheets speaks the row or just the cell.",
        },
        SpeakTutorialMessages: {
          description: "Sets whether tutorial messages are spoken.",
        },
        SpeakWidgetMnemonic: {
          description: "Sets whether widget mnemonics are spoken.",
        },
        VerbosityLevel: {
          description:
            "Sets the speech verbosity level for object presentation.",
        },
      },
    },
    SpellCheckPresenter: {
      commands: {},
      objectPath: "/org/gnome/Orca/Service/SpellCheckPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        PresentContext: {
          description:
            "Returns whether to present the context/surrounding sentence.",
        },
        SpellError: {
          description: "Returns whether misspelled word should be spelled.",
        },
        SpellSuggestion: {
          description:
            "Returns whether the suggested correction should be spelled.",
        },
      },
      runtimeSetters: {
        PresentContext: {
          description:
            "Sets whether to present the context/surrounding sentence.",
        },
        SpellError: {
          description: "Sets whether misspelled word should be spelled.",
        },
        SpellSuggestion: {
          description:
            "Sets whether the suggested correction should be spelled.",
        },
      },
    },
    StructuralNavigator: {
      commands: {
        ContainerEnd: {
          description: "Moves to the end of the current container.",
          representation: "Comma",
        },
        ContainerStart: {
          description: "Moves to the start of the current container.",
          representation: "Shift-Comma",
        },
        CycleMode: {
          description: "Cycles among the structural navigation modes.",
        },
        ListBlockquotes: {
          description: "Displays a list of blockquotes.",
          representation: "Alt-Shift-Q",
        },
        ListButtons: {
          description: "Displays a list of buttons.",
          representation: "Alt-Shift-B",
        },
        ListCheckboxes: {
          description: "Displays a list of checkboxes.",
          representation: "Alt-Shift-X",
        },
        ListClickables: {
          description: "Displays a list of clickables.",
          representation: "Alt-Shift-A",
        },
        ListComboboxes: {
          description: "Displays a list of combo boxes.",
          representation: "Alt-Shift-C",
        },
        ListEntries: {
          description: "Displays a list of entries.",
          representation: "Alt-Shift-E",
        },
        ListFormFields: {
          description: "Displays a list of form fields.",
          representation: "Alt-Shift-F",
        },
        ListHeadings: {
          description: "Displays a list of headings.",
          representation: "Alt-Shift-H",
        },
        ListHeadingsLevel1: {
          description: "Displays a list of level 1 headings.",
          representation: "Alt-Shift-1",
        },
        ListHeadingsLevel2: {
          description: "Displays a list of level 2 headings.",
          representation: "Alt-Shift-2",
        },
        ListHeadingsLevel3: {
          description: "Displays a list of level 3 headings.",
          representation: "Alt-Shift-3",
        },
        ListHeadingsLevel4: {
          description: "Displays a list of level 4 headings.",
          representation: "Alt-Shift-4",
        },
        ListHeadingsLevel5: {
          description: "Displays a list of level 5 headings.",
          representation: "Alt-Shift-5",
        },
        ListHeadingsLevel6: {
          description: "Displays a list of level 6 headings.",
          representation: "Alt-Shift-6",
        },
        ListIframes: {
          description: "Displays a list of iframes.",
        },
        ListImages: {
          description: "Displays a list of images.",
          representation: "Alt-Shift-G",
        },
        ListLandmarks: {
          description: "Displays a list of landmarks.",
          representation: "Alt-Shift-M",
        },
        ListLargeObjects: {
          description: "Displays a list of large objects.",
          representation: "Alt-Shift-O",
        },
        ListLinks: {
          description: "Displays a list of links.",
          representation: "Alt-Shift-K",
        },
        ListListItems: {
          description: "Displays a list of list items.",
          representation: "Alt-Shift-I",
        },
        ListLists: {
          description: "Displays a list of lists.",
          representation: "Alt-Shift-L",
        },
        ListParagraphs: {
          description: "Displays a list of paragraphs.",
          representation: "Alt-Shift-P",
        },
        ListRadioButtons: {
          description: "Displays a list of radio buttons.",
          representation: "Alt-Shift-R",
        },
        ListTables: {
          description: "Displays a list of tables.",
          representation: "Alt-Shift-T",
        },
        ListUnvisitedLinks: {
          description: "Displays a list of unvisited links.",
          representation: "Alt-Shift-U",
        },
        ListVisitedLinks: {
          description: "Displays a list of visited links.",
          representation: "Alt-Shift-V",
        },
        NextBlockquote: {
          description: "Goes to the next blockquote.",
          representation: "Q",
        },
        NextButton: {
          description: "Goes to the next button.",
          representation: "B",
        },
        NextCheckbox: {
          description: "Goes to the next checkbox.",
          representation: "X",
        },
        NextClickable: {
          description: "Goes to the next clickable.",
          representation: "A",
        },
        NextCombobox: {
          description: "Goes to the next combo box.",
          representation: "C",
        },
        NextEntry: {
          description: "Goes to the next entry.",
          representation: "E",
        },
        NextFormField: {
          description: "Goes to the next form field.",
          representation: "F",
        },
        NextHeading: {
          description: "Goes to the next heading.",
          representation: "H",
        },
        NextHeadingLevel1: {
          description: "Goes to the next level 1 heading.",
          representation: "1",
        },
        NextHeadingLevel2: {
          description: "Goes to the next level 2 heading.",
          representation: "2",
        },
        NextHeadingLevel3: {
          description: "Goes to the next level 3 heading.",
          representation: "3",
        },
        NextHeadingLevel4: {
          description: "Goes to the next level 4 heading.",
          representation: "4",
        },
        NextHeadingLevel5: {
          description: "Goes to the next level 5 heading.",
          representation: "5",
        },
        NextHeadingLevel6: {
          description: "Goes to the next level 6 heading.",
          representation: "6",
        },
        NextIframe: {
          description: "Goes to the next iframe.",
        },
        NextImage: {
          description: "Goes to the next image.",
          representation: "G",
        },
        NextLandmark: {
          description: "Goes to the next landmark.",
          representation: "M",
        },
        NextLargeObject: {
          description: "Goes to the next large object.",
          representation: "O",
        },
        NextLink: {
          description: "Goes to the next link.",
          representation: "K",
        },
        NextList: {
          description: "Goes to the next list.",
          representation: "L",
        },
        NextListItem: {
          description: "Goes to the next list item.",
          representation: "I",
        },
        NextLiveRegion: {
          description: "Goes to the next live region.",
        },
        NextParagraph: {
          description: "Goes to the next paragraph.",
          representation: "P",
        },
        NextRadioButton: {
          description: "Goes to the next radio button.",
          representation: "R",
        },
        NextSeparator: {
          description: "Goes to the next separator.",
          representation: "S",
        },
        NextTable: {
          description: "Goes to the next table.",
          representation: "T",
        },
        NextUnvisitedLink: {
          description: "Goes to the next unvisited link.",
          representation: "U",
        },
        NextVisitedLink: {
          description: "Goes to the next visited link.",
          representation: "V",
        },
        PreviousBlockquote: {
          description: "Goes to the previous blockquote.",
          representation: "Shift-Q",
        },
        PreviousButton: {
          description: "Goes to the previous button.",
          representation: "Shift-B",
        },
        PreviousCheckbox: {
          description: "Goes to the previous checkbox.",
          representation: "Shift-X",
        },
        PreviousClickable: {
          description: "Goes to the previous clickable.",
          representation: "Shift-A",
        },
        PreviousCombobox: {
          description: "Goes to the previous combo box.",
          representation: "Shift-C",
        },
        PreviousEntry: {
          description: "Goes to the previous entry.",
          representation: "Shift-E",
        },
        PreviousFormField: {
          description: "Goes to the previous form field.",
          representation: "Shift-F",
        },
        PreviousHeading: {
          description: "Goes to the previous heading.",
          representation: "Shift-H",
        },
        PreviousHeadingLevel1: {
          description: "Goes to the previous level 1 heading.",
          representation: "Shift-1",
        },
        PreviousHeadingLevel2: {
          description: "Goes to the previous level 2 heading.",
          representation: "Shift-2",
        },
        PreviousHeadingLevel3: {
          description: "Goes to the previous level 3 heading.",
          representation: "Shift-3",
        },
        PreviousHeadingLevel4: {
          description: "Goes to the previous level 4 heading.",
          representation: "Shift-4",
        },
        PreviousHeadingLevel5: {
          description: "Goes to the previous level 5 heading.",
          representation: "Shift-5",
        },
        PreviousHeadingLevel6: {
          description: "Goes to the previous level 6 heading.",
          representation: "Shift-6",
        },
        PreviousIframe: {
          description: "Goes to the previous iframe.",
        },
        PreviousImage: {
          description: "Goes to the previous image.",
          representation: "Shift-G",
        },
        PreviousLandmark: {
          description: "Goes to the previous landmark.",
          representation: "Shift-M",
        },
        PreviousLargeObject: {
          description: "Goes to the previous large object.",
          representation: "Shift-O",
        },
        PreviousLink: {
          description: "Goes to the previous link.",
          representation: "Shift-K",
        },
        PreviousList: {
          description: "Goes to the previous list.",
          representation: "Shift-L",
        },
        PreviousListItem: {
          description: "Goes to the previous list item.",
          representation: "Shift-I",
        },
        PreviousLiveRegion: {
          description: "Goes to the previous live region.",
        },
        PreviousParagraph: {
          description: "Goes to the previous paragraph.",
          representation: "Shift-P",
        },
        PreviousRadioButton: {
          description: "Goes to the previous radio button.",
          representation: "Shift-R",
        },
        PreviousSeparator: {
          description: "Goes to the previous separator.",
          representation: "Shift-S",
        },
        PreviousTable: {
          description: "Goes to the previous table.",
          representation: "Shift-T",
        },
        PreviousUnvisitedLink: {
          description: "Goes to the previous unvisited link.",
          representation: "Shift-U",
        },
        PreviousVisitedLink: {
          description: "Goes to the previous visited link.",
          representation: "Shift-V",
        },
      },
      objectPath: "/org/gnome/Orca/Service/StructuralNavigator",
      parameterizedCommands: {},
      runtimeGetters: {
        IsEnabled: {
          description: "Returns whether structural navigation is enabled.",
        },
        LargeObjectTextLength: {
          description:
            "Returns the minimum number of characters to be considered a 'large object'.",
        },
        NavigationWraps: {
          description:
            "Returns whether navigation wraps when reaching the top/bottom of the document.",
        },
        TriggersFocusMode: {
          description:
            "Returns whether structural navigation triggers focus mode.",
        },
      },
      runtimeSetters: {
        IsEnabled: {
          description: "Sets whether structural navigation is enabled.",
        },
        LargeObjectTextLength: {
          description:
            "Sets the minimum number of characters to be considered a 'large object'.",
        },
        NavigationWraps: {
          description:
            "Sets whether navigation wraps when reaching the top/bottom of the document.",
        },
        TriggersFocusMode: {
          description:
            "Sets whether structural navigation triggers focus mode.",
        },
      },
    },
    SystemInformationPresenter: {
      commands: {
        PresentBatteryStatus: {
          description: "Presents the battery status.",
          representation: "ORCA-Shift-B",
        },
        PresentCpuAndMemoryUsage: {
          description: "Presents the cpu and memory usage.",
          representation: "ORCA-Shift-E",
        },
        PresentDate: {
          description: "Presents the current date.",
          representation: "ORCA-Shift-T",
        },
        PresentTime: {
          description: "Presents the current time.",
          representation: "ORCA-T",
        },
      },
      objectPath: "/org/gnome/Orca/Service/SystemInformationPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        AvailableDateFormats: {
          description: "Returns a list of available date format names.",
        },
        AvailableTimeFormats: {
          description: "Returns a list of available time format names.",
        },
        DateFormat: {
          description: "Returns the current date format name.",
        },
        TimeFormat: {
          description: "Returns the current time format name.",
        },
      },
      runtimeSetters: {
        DateFormat: {
          description: "Sets the date format.",
        },
        TimeFormat: {
          description: "Sets the time format.",
        },
      },
    },
    TableNavigator: {
      commands: {
        ClearDynamicColumnHeadersRow: {
          description: "Clears the row for the dynamic column headers.",
          representation: "ORCA-Shift-Alt-R",
        },
        ClearDynamicRowHeadersColumn: {
          description: "Clears the column for the dynamic row headers.",
          representation: "ORCA-Shift-Alt-C",
        },
        MoveDown: {
          description: "Moves to the cell below.",
          representation: "ORCA-Down",
        },
        MoveLeft: {
          description: "Moves to the cell on the left.",
          representation: "ORCA-Left",
        },
        MoveRight: {
          description: "Moves to the cell on the right.",
          representation: "ORCA-Right",
        },
        MoveToBeginningOfRow: {
          description: "Moves to the beginning of the row.",
          representation: "ORCA-Home",
        },
        MoveToBottomOfColumn: {
          description: "Moves to the bottom of the column.",
          representation: "ORCA-Shift-Down",
        },
        MoveToEndOfRow: {
          description: "Moves to the end of the row.",
          representation: "ORCA-End",
        },
        MoveToFirstCell: {
          description: "Moves to the first cell.",
          representation: "ORCA-Ctrl-Home",
        },
        MoveToLastCell: {
          description: "Moves to the last cell.",
          representation: "ORCA-Ctrl-End",
        },
        MoveToTopOfColumn: {
          description: "Moves to the top of the column.",
          representation: "ORCA-Shift-Up",
        },
        MoveUp: {
          description: "Moves to the cell above.",
          representation: "ORCA-Up",
        },
        SetDynamicColumnHeadersRow: {
          description:
            "Sets the row for the dynamic header columns to the current row.",
          representation: "ORCA-Shift-Alt-R",
        },
        SetDynamicRowHeadersColumn: {
          description:
            "Sets the column for the dynamic row headers to the current column.",
          representation: "ORCA-Shift-Alt-C",
        },
        ToggleEnabled: {
          description: "Toggles table navigation.",
          representation: "ORCA-Shift-T",
        },
      },
      objectPath: "/org/gnome/Orca/Service/TableNavigator",
      parameterizedCommands: {},
      runtimeGetters: {
        IsEnabled: {
          description: "Returns whether table navigation is enabled.",
        },
        SkipBlankCells: {
          description:
            "Returns whether blank cells should be skipped during navigation.",
        },
      },
      runtimeSetters: {
        IsEnabled: {
          description:
            "Sets whether blank cells should be skipped during navigation.",
        },
      },
    },
    TextAttributeManager: {
      commands: {},
      objectPath: "/org/gnome/Orca/Service/TextAttributeManager",
      parameterizedCommands: {},
      runtimeGetters: {
        AttributesToBraille: {
          description:
            "Returns the list of text attributes to mark in braille.",
        },
        AttributesToSpeak: {
          description: "Returns the list of text attributes to speak.",
        },
      },
      runtimeSetters: {
        AttributesToBraille: {
          description: "Sets the list of text attributes to mark in braille.",
        },
        AttributesToSpeak: {
          description: "Sets the list of text attributes to speak.",
        },
      },
    },
    TypingEchoPresenter: {
      commands: {
        CycleKeyEcho: {
          description: "Cycle through the key echo levels.",
          representation: "ORCA-Shift-K",
        },
      },
      objectPath: "/org/gnome/Orca/Service/TypingEchoPresenter",
      parameterizedCommands: {},
      runtimeGetters: {
        ActionKeysEnabled: {
          description:
            "Returns whether action keys will be echoed when key echo is enabled.",
        },
        AlphabeticKeysEnabled: {
          description:
            "Returns whether alphabetic keys will be echoed when key echo is enabled.",
        },
        CharacterEchoEnabled: {
          description:
            "Returns whether echo of inserted characters is enabled.",
        },
        DiacriticalKeysEnabled: {
          description:
            "Returns whether diacritical keys will be echoed when key echo is enabled.",
        },
        FunctionKeysEnabled: {
          description:
            "Returns whether function keys will be echoed when key echo is enabled.",
        },
        KeyEchoEnabled: {
          description:
            "Returns whether echo of key presses is enabled. See also get_character_echo_enabled.",
        },
        LockingKeysPresented: {
          description: "Returns whether locking keys are presented.",
        },
        ModifierKeysEnabled: {
          description:
            "Returns whether modifier keys will be echoed when key echo is enabled.",
        },
        NavigationKeysEnabled: {
          description:
            "Returns whether navigation keys will be echoed when key echo is enabled.",
        },
        NumericKeysEnabled: {
          description:
            "Returns whether numeric keys will be echoed when key echo is enabled.",
        },
        PunctuationKeysEnabled: {
          description:
            "Returns whether punctuation keys will be echoed when key echo is enabled.",
        },
        SentenceEchoEnabled: {
          description: "Returns whether sentence echo is enabled.",
        },
        SpaceEnabled: {
          description:
            "Returns whether space key will be echoed when key echo is enabled.",
        },
        WordEchoEnabled: {
          description: "Returns whether word echo is enabled.",
        },
      },
      runtimeSetters: {
        ActionKeysEnabled: {
          description:
            "Sets whether action keys will be echoed when key echo is enabled.",
        },
        AlphabeticKeysEnabled: {
          description:
            "Sets whether alphabetic keys will be echoed when key echo is enabled.",
        },
        CharacterEchoEnabled: {
          description: "Sets whether echo of inserted characters is enabled.",
        },
        DiacriticalKeysEnabled: {
          description:
            "Sets whether diacritical keys will be echoed when key echo is enabled.",
        },
        FunctionKeysEnabled: {
          description:
            "Sets whether function keys will be echoed when key echo is enabled.",
        },
        KeyEchoEnabled: {
          description:
            "Sets whether echo of key presses is enabled. See also set_character_echo_enabled.",
        },
        LockingKeysPresented: {
          description: "Sets whether locking keys are presented.",
        },
        ModifierKeysEnabled: {
          description:
            "Sets whether modifier keys will be echoed when key echo is enabled.",
        },
        NavigationKeysEnabled: {
          description:
            "Sets whether navigation keys will be echoed when key echo is enabled.",
        },
        NumericKeysEnabled: {
          description:
            "Sets whether numeric keys will be echoed when key echo is enabled.",
        },
        PunctuationKeysEnabled: {
          description:
            "Sets whether punctuation keys will be echoed when key echo is enabled.",
        },
        SentenceEchoEnabled: {
          description: "Sets whether sentence echo is enabled.",
        },
        SpaceEnabled: {
          description:
            "Sets whether space key will be echoed when key echo is enabled.",
        },
        WordEchoEnabled: {
          description: "Sets whether word echo is enabled.",
        },
      },
    },
    WhereAmIPresenter: {
      commands: {
        PresentCellFormula: {
          description:
            "Presents the formula associated with the current spreadsheet cell.",
          representation: "ORCA-Shift-F",
        },
        PresentCharacterAttributes: {
          description:
            "Presents the font and formatting details for the current character.",
          representation: "ORCA-F",
        },
        PresentDefaultButton: {
          description: "Presents the default button of the current dialog.",
          representation: "ORCA-Enter",
        },
        PresentLink: {
          description: "Presents details about the current link.",
          representation: "ORCA-Shift-L",
        },
        PresentSelectedText: {
          description: "Presents the selected text.",
          representation: "ORCA-Shift-Up",
        },
        PresentSelection: {
          description: "Presents the selected text or selected objects.",
          representation: "ORCA-Shift-S",
        },
        PresentSizeAndPosition: {
          description: "Presents the size and position of the current object.",
          representation: "ORCA-Shift-P",
        },
        PresentStatusBar: {
          description:
            "Presents the status bar and info bar of the current window.",
          representation: "ORCA-Shift-End",
        },
        PresentTitle: {
          description: "Presents the title of the current window.",
          representation: "ORCA-Ctrl-T",
        },
        WhereAmIBasic: {
          description: "Presents basic information about the current location.",
          representation: "ORCA-KP_Enter",
        },
        WhereAmIDetailed: {
          description:
            "Presents detailed information about the current location.",
          representation: "ORCA-KP_Enter",
        },
      },
      objectPath: "/org/gnome/Orca/Service/WhereAmIPresenter",
      parameterizedCommands: {},
      runtimeGetters: {},
      runtimeSetters: {},
    },
  },
  service: {
    name: "org.gnome.Orca.Service",
    objectPath: "/org/gnome/Orca/Service",
  },
  version: "50.2",
} as const;
