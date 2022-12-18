import { REG_SZ_Value, promisified as regedit, RegistryItem } from "regedit";
import { ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY } from "../errors";
import { SUB_KEY_GUIDEPUP_NVDA } from "./constants";

interface NVDARegistryItem extends RegistryItem {
  values: {
    [name: string]: REG_SZ_Value;
  };
}

let data: NVDARegistryItem;

export async function getNVDARegistryData(): Promise<NVDARegistryItem> {
  if (data) {
    return data;
  }

  try {
    const { [SUB_KEY_GUIDEPUP_NVDA]: data } = await regedit.list([
      SUB_KEY_GUIDEPUP_NVDA,
    ]);

    return data as NVDARegistryItem;
  } catch (e) {
    throw new Error(`${ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY}\n${e.message}`);
  }
}
