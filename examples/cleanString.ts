export const cleanString = (str: string): string =>
  str
    .toLowerCase()
    // REF: https://github.com/nvaccess/nvda/blob/master/source/locale/en/symbols.dic
    .replace(/[|¦:;'"`\-‐–—·_()[\]{}\\^~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
