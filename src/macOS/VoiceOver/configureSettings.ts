import { ERR_VOICE_OVER_UNABLE_TO_CONFIGURE_VOICEOVER_SETTING } from "../errors";
import { exec } from "child_process";

const VOICEOVER_TRAINING_DOMAIN = "com.apple.VoiceOverTraining"
const VOICEOVER_DEFAULTS_DOMAIN = "com.apple.VoiceOver4/default";

const VOICEOVER_SETTINGS = {
  doNotShowSplashScreen: {
    domain: VOICEOVER_TRAINING_DOMAIN,
    key: "doNotShowSplashScreen",
    defaultValue: true,
    type: "bool",
  },
  voiceOverCursorEnabled: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "SCRVoiceOverCursorEnabled",
    defaultValue: true,
    type: "bool",
  },
  disableSpeech: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "SCRCategories_SCRCategorySystemWide_SCRSpeechComponentSettings_SCRDisableSpeech",
    defaultValue: false,
    type: "bool",
  },
  disableSound: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "SCRCategories_SCRCategorySystemWide_SCRSoundComponentSettings_SCRDisableSound",
    defaultValue: false,
    type: "bool",
  },
  displayTextEnabled: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "SCRDisplayTextEnabled",
    defaultValue: true,
    type: "bool",
  },
  rateAsPercent: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "SCRCategories_SCRCategorySystemWide_SCRSpeechLanguages_default_SCRSpeechComponentSettings_SCRRateAsPercent",
    defaultValue: 45,
    type: "int",
  },
  loginGreeting: {
    domain: VOICEOVER_DEFAULTS_DOMAIN,
    key: "loginGreeting",
    defaultValue: "Welcome to macOS. VoiceOver is on.",
    type: "string",
  },
};

export type VoiceOverSettings = {
  [Property in keyof typeof VOICEOVER_SETTINGS]: typeof VOICEOVER_SETTINGS[Property]["defaultValue"];
};

export const DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS: VoiceOverSettings = {
  doNotShowSplashScreen: true,
  voiceOverCursorEnabled: true,
  disableSpeech: false,
  disableSound: false,
  displayTextEnabled: true,
  rateAsPercent: 100,
  loginGreeting: "",
};

function convertToBool(value: string): boolean {
  return value === "1" || value === "true";
}

let resetSettings: () => Promise<void> = null;

export async function storeOriginalSettings() {
  if (resetSettings) {
    return resetSettings;
  }

  const [
    doNotShowSplashScreen,
    voiceOverCursorEnabled,
    disableSpeech,
    disableSound,
    displayTextEnabled,
    rateAsPercent,
    loginGreeting,
  ] = await Promise.all(
    Object.values(VOICEOVER_SETTINGS).map(
      ({ domain, key, defaultValue }) =>
        new Promise<string>((resolve) => {
          exec(`defaultValues read ${domain} ${key}`, (e, stdout) => {
            if (e) {
              resolve(defaultValue.toString());
            } else {
              resolve(stdout.trim());
            }
          });
        })
    )
  );

  const originalSettings = {
    doNotShowSplashScreen: convertToBool(doNotShowSplashScreen),
    voiceOverCursorEnabled: convertToBool(voiceOverCursorEnabled),
    disableSpeech: convertToBool(disableSpeech),
    disableSound: convertToBool(disableSound),
    displayTextEnabled: convertToBool(displayTextEnabled),
    rateAsPercent: parseInt(rateAsPercent),
    loginGreeting,
  };

  resetSettings = async () => {
    await configureSettings(originalSettings);
  };

  for (const event of ["exit", "uncaughtException", "unhandledRejection"]) {
    process.on(event, resetSettings);
  }

  return resetSettings;
}

export async function configureSettings(settings: VoiceOverSettings) {
  return await Promise.all(
    Object.entries(VOICEOVER_SETTINGS).map(
      ([name, { domain, key, type }]) =>
        new Promise<void>((resolve, reject) => {
          exec(
            `defaults write ${domain} ${key} -${type} "${settings[
              name
            ].toString()}"`,
            (e) => {
              if (e) {
                reject(
                  new Error(
                    `${ERR_VOICE_OVER_UNABLE_TO_CONFIGURE_VOICEOVER_SETTING}\n${e.message}`
                  )
                );
              } else {
                resolve();
              }
            }
          );
        })
    )
  );
}
