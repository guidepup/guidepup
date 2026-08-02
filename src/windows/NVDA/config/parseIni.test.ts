import { parseIni } from "./parseIni";

const topLevelPrimitivesInput = `a = string
b = 123
c = True
d = "quoted string"`;

const topLevelPrimitivesResult = {
  a: "string",
  b: 123,
  c: true,
  d: "quoted string",
};

const nestedKeysInput = `a = "top level key"
[b]
\tc = "nested key"
\t[[d]]
\t\te = "double nested key"
\t\t[[[f]]]
\t\t\tg = "triple nested key"
\t\t[[[h]]]
\t\t\ti = "another triple nested key"
[j]
\tk = "another nested key"`;

const nestedKeysResult = {
  a: "top level key",
  b: {
    c: "nested key",
    d: {
      e: "double nested key",
      f: {
        g: "triple nested key",
      },
      h: {
        i: "another triple nested key",
      },
    },
  },
  j: {
    k: "another nested key",
  },
};

const missingSeparatorInput = `a = "first value"
invalid line
b = "second value"`;

const missingSeparatorResult = {
  a: "first value",
  b: "second value",
};

const realWorldInput = `schemaVersion = 22
[math]
\t[[speech]]
\t\timpairment = Blindness
\t\tlanguage = en
\t\tverbosity = Medium
\t\tmathRate = 100
\t\tpauseFactor = 100
\t\tspeechSound = None
\t\tchemistry = SpellOut
\t\t[[[en]]]
\t\t\tspeechStyle = ClearSpeak
\t[[speech.speechOverrides]]
\t[[speech.ClearSpeak]]
\t[[navigation]]
\t\tnavMode = Enhanced
\t\tresetNavMode = True
\t\toverview = False
\t\tresetOverview = True
\t\tnavVerbosity = Medium
\t\tautoZoomOut = True
\t\tcopyAs = MathML
\t[[braille]]
\t\tbrailleCode = Auto
\t\tbrailleNavHighlight = EndPoints
\t[[braille.nemeth]]
\t[[braille.UEB]]
\t[[braille.vietnam]]
\t[[braille.LaTeX]]
\t[[other]]
\t\tdecimalSeparator = Auto
\t\tuseWordNativeMath = False
\t[[ui]]
\t\tconfirmDisconnectAsFollower = False
\t\tmuteOnLocalControl = False
[remote]
\tenabled = True
\t[[connections]]
\t\tlastConnected = 127.0.0.1:6837,
[development]
[screenCurtain]
\twarnOnLoad = True
\tplayToggleSounds = True
[update]
\tallowUsageStats = False
\taskedAllowUsageStats = True
\tautoCheck = False
\tstartupNotification = False
[addonStore]
\tautomaticUpdates = disabled
\tallowIncompatibleUpdates = False
\tdefaultUpdateChannel = 2
[general]
\tshowWelcomeDialogAtStartup = False
\tlanguage = Windows
\tsaveConfigurationOnExit = False
\taskToExit = False
\tplayStartAndExitSounds = False
\tloggingLevel = OFF
\tpreventDisplayTurningOff = True
[speech]
\tsynth = oneCore
\t[[oneCore]]
\t\tvoice = HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enGB_GeorgeM
\t\tvolume = 100
\t\trate = 100
\t\trateBoost = True
[braille]
\t[[noBraille]]
[vision]
\t[[NVDAHighlighter]]
\t\thighlightFocus = True
\t\thighlightNavigator = True
\t\thighlightBrowseMode = True
\t\tenabled = True
[speechViewer]
\tx = 0
\ty = 0
\twidth = 500
\theight = 500
\tdisplays = "(1920, 1080)",
\tautoPositionWindow = True
\tshowSpeechViewerAtStartup = True
[virtualBuffers]
\tautoSayAllOnPageLoad = False
[uwpOcr]
\tlanguage = en-GB`;

const realWorldResult = {
  addonStore: {
    allowIncompatibleUpdates: false,
    automaticUpdates: "disabled",
    defaultUpdateChannel: 2,
  },
  braille: {
    noBraille: {},
  },
  development: {},
  general: {
    askToExit: false,
    language: "Windows",
    loggingLevel: "OFF",
    playStartAndExitSounds: false,
    preventDisplayTurningOff: true,
    saveConfigurationOnExit: false,
    showWelcomeDialogAtStartup: false,
  },
  math: {
    braille: {
      brailleCode: "Auto",
      brailleNavHighlight: "EndPoints",
    },
    "braille.LaTeX": {},
    "braille.UEB": {},
    "braille.nemeth": {},
    "braille.vietnam": {},
    navigation: {
      autoZoomOut: true,
      copyAs: "MathML",
      navMode: "Enhanced",
      navVerbosity: "Medium",
      overview: false,
      resetNavMode: true,
      resetOverview: true,
    },
    other: {
      decimalSeparator: "Auto",
      useWordNativeMath: false,
    },
    speech: {
      chemistry: "SpellOut",
      en: {
        speechStyle: "ClearSpeak",
      },
      impairment: "Blindness",
      language: "en",
      mathRate: 100,
      pauseFactor: 100,
      speechSound: "None",
      verbosity: "Medium",
    },
    "speech.ClearSpeak": {},
    "speech.speechOverrides": {},
    ui: {
      confirmDisconnectAsFollower: false,
      muteOnLocalControl: false,
    },
  },
  remote: {
    connections: {
      lastConnected: ["127.0.0.1:6837"],
    },
    enabled: true,
  },
  schemaVersion: 22,
  screenCurtain: {
    playToggleSounds: true,
    warnOnLoad: true,
  },
  speech: {
    oneCore: {
      rate: 100,
      rateBoost: true,
      voice:
        "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enGB_GeorgeM",
      volume: 100,
    },
    synth: "oneCore",
  },
  speechViewer: {
    autoPositionWindow: true,
    displays: ["(1920, 1080)"],
    height: 500,
    showSpeechViewerAtStartup: true,
    width: 500,
    x: 0,
    y: 0,
  },
  update: {
    allowUsageStats: false,
    askedAllowUsageStats: true,
    autoCheck: false,
    startupNotification: false,
  },
  uwpOcr: {
    language: "en-GB",
  },
  virtualBuffers: {
    autoSayAllOnPageLoad: false,
  },
  vision: {
    NVDAHighlighter: {
      enabled: true,
      highlightBrowseMode: true,
      highlightFocus: true,
      highlightNavigator: true,
    },
  },
};

describe("parseIni", () => {
  it.each`
    description                               | input                           | expectedResult
    ${"empty"}                                | ${""}                           | ${{}}
    ${"comments"}                             | ${"# comment\na = string"}      | ${{ a: "string" }}
    ${"repeated"}                             | ${"a = string\na = 123"}        | ${{ a: 123 }}
    ${"repeated as section"}                  | ${"a = string\n[a]\n\tb = 123"} | ${{ a: { b: 123 } }}
    ${"separator in string"}                  | ${"a = ==="}                    | ${{ a: "===" }}
    ${"top level keys with primitive values"} | ${topLevelPrimitivesInput}      | ${topLevelPrimitivesResult}
    ${"nested keys"}                          | ${nestedKeysInput}              | ${nestedKeysResult}
    ${"missing separator"}                    | ${missingSeparatorInput}        | ${missingSeparatorResult}
    ${"real world input"}                     | ${realWorldInput}               | ${realWorldResult}
  `("$description", ({ input, expectedResult }) => {
    expect(parseIni(input)).toEqual(expectedResult);
  });
});
