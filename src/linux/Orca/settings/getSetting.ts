import { getSettings } from "./getSettings";

export const getSetting = (key: string): unknown => getSettings()[key];
