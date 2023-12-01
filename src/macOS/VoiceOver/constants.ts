import { DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS } from "./configureSettings";

export const SPOKEN_PHRASES_POLL_INTERVAL = 20;
export const SPOKEN_PHRASES_RETRY_COUNT = 10;

export const ITEM_TEXT_POLL_INTERVAL = 20;
export const ITEM_TEXT_RETRY_COUNT = 10;

export const APPROX_WORDS_PER_SECOND =
  DEFAULT_GUIDEPUP_VOICEOVER_SETTINGS.rateAsPercent / 12;
