/**
 * merge strings with space
 * merge classes and return string
 * @param pClasses
 * @param pJoin
 */
export const merge = (pClasses: any[], pJoin: string = " "): string => {
  if (pClasses?.length > 0) {
    return pClasses
      .reduce((a, b) => a.concat(b), [])
      .filter((v) => v)
      .join(pJoin)
  }
}
