import { buildIni } from "./buildIni";

const topLevelPrimitivesInput = {
  a: "string",
  b: 123,
  c: true,
  d: undefined,
  e: null,
  f: Symbol("symbol"),
  g: BigInt(456),
};

const topLevelPrimitivesResult = `a = string
b = 123
c = True
d = undefined
e = null
f = Symbol(symbol)
g = "456"`;

const arrayInput = {
  a: [],
  b: ["first", "second"],
  c: [1, 2],
  d: ["first", 2],
};

const arrayResult = `a = ,
b = first,second,
c = 1,2,
d = first,2,`;

const invalidObjectsInput = {
  a: function a() {},
  b: () => {},
};

const invalidObjectsResult = `a = "function a() { }"
b = "() => { }"`;

const nestedKeysInput = {
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

const nestedKeysResult = `a = "top level key"
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

const realWorldInput = {
  schemaVersion: 22,
  development: {},
  screenCurtain: {
    warnOnLoad: true,
    playToggleSounds: true,
  },
  update: {
    allowUsageStats: false,
    askedAllowUsageStats: true,
    autoCheck: false,
    startupNotification: false,
  },
  addonStore: {
    automaticUpdates: "disabled",
    allowIncompatibleUpdates: false,
    defaultUpdateChannel: 2,
  },
  general: {
    showWelcomeDialogAtStartup: false,
    language: "Windows",
    saveConfigurationOnExit: false,
    askToExit: false,
    playStartAndExitSounds: false,
    loggingLevel: "OFF",
    preventDisplayTurningOff: true,
  },
  speech: {
    synth: "oneCore",
    oneCore: {
      voice:
        "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enGB_GeorgeM",
      volume: 100,
      rate: 100,
      rateBoost: true,
    },
  },
  braille: {
    noBraille: {},
  },
  vision: {
    NVDAHighlighter: {
      highlightFocus: true,
      highlightNavigator: true,
      highlightBrowseMode: true,
      enabled: true,
    },
  },
  speechViewer: {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    displays: ["(1920, 1080)"],
    autoPositionWindow: true,
    showSpeechViewerAtStartup: true,
  },
  virtualBuffers: {
    autoSayAllOnPageLoad: false,
  },
  uwpOcr: {
    language: "en-GB",
  },
};

const realWorldResult = `schemaVersion = 22
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

// @ts-expect-error deliberate repeated keys
const repeatedInput = { a: 123, a: "string" };
const repeatedResult = "a = string";

// @ts-expect-error deliberate repeated keys
const repeatedNestedInput = { a: 123, a: { b: "string" } };
const repeatedNestedResult = "[a]\n\tb = string";

const quotingInput = {
  a: "contains space",
  b: "contains\twhitespace",
  c: "123",
  d: "True",
  e: "",
};

const quotingResult = `a = "contains space"
b = "contains\twhitespace"
c = "123"
d = "True"
e = ""`;

describe("buildIni", () => {
  it.each`
    description                               | input                      | expectedResult
    ${"undefined"}                            | ${undefined}               | ${""}
    ${"null"}                                 | ${null}                    | ${""}
    ${"empty"}                                | ${{}}                      | ${""}
    ${"top level keys with primitive values"} | ${topLevelPrimitivesInput} | ${topLevelPrimitivesResult}
    ${"arrays"}                               | ${arrayInput}              | ${arrayResult}
    ${"invalid objects"}                      | ${invalidObjectsInput}     | ${invalidObjectsResult}
    ${"nested keys"}                          | ${nestedKeysInput}         | ${nestedKeysResult}
    ${"real world"}                           | ${realWorldInput}          | ${realWorldResult}
    ${"repeated"}                             | ${repeatedInput}           | ${repeatedResult}
    ${"repeated nested"}                      | ${repeatedNestedInput}     | ${repeatedNestedResult}
    ${"quoted"}                               | ${quotingInput}            | ${quotingResult}
  `("$description", ({ input, expectedResult }) => {
    expect(buildIni(input)).toEqual(expectedResult);
  });
});
