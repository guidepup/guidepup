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
	[[speech]]
		impairment = Blindness
		language = en
		verbosity = Medium
		mathRate = 100
		pauseFactor = 100
		speechSound = None
		chemistry = SpellOut
		[[[en]]]
			speechStyle = ClearSpeak
	[[speech.speechOverrides]]
	[[speech.ClearSpeak]]
	[[navigation]]
		navMode = Enhanced
		resetNavMode = True
		overview = False
		resetOverview = True
		navVerbosity = Medium
		autoZoomOut = True
		copyAs = MathML
	[[braille]]
		brailleCode = Auto
		brailleNavHighlight = EndPoints
	[[braille.nemeth]]
	[[braille.UEB]]
	[[braille.vietnam]]
	[[braille.LaTeX]]
	[[other]]
		decimalSeparator = Auto
		useWordNativeMath = False
	[[ui]]
		confirmDisconnectAsFollower = False
		muteOnLocalControl = False
[development]
[screenCurtain]
	warnOnLoad = True
	playToggleSounds = True
[update]
	allowUsageStats = False
	askedAllowUsageStats = True
	autoCheck = False
	startupNotification = False
[addonStore]
	automaticUpdates = disabled
	allowIncompatibleUpdates = False
	defaultUpdateChannel = 2
[general]
	showWelcomeDialogAtStartup = False
	language = Windows
	saveConfigurationOnExit = False
	askToExit = False
	playStartAndExitSounds = False
	loggingLevel = OFF
	preventDisplayTurningOff = True
[speech]
	synth = oneCore
	[[oneCore]]
		voice = HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enGB_GeorgeM
		volume = 100
		rate = 100
		rateBoost = True
[braille]
	[[noBraille]]
[vision]
	[[NVDAHighlighter]]
		highlightFocus = True
		highlightNavigator = True
		highlightBrowseMode = True
		enabled = True
[speechViewer]
	x = 0
	y = 0
	width = 500
	height = 500
	displays = "(1920, 1080)",
	autoPositionWindow = True
	showSpeechViewerAtStartup = True
[virtualBuffers]
	autoSayAllOnPageLoad = False
[uwpOcr]
	language = en-GB`;

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
    displays: '"(1920, 1080)",',
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
