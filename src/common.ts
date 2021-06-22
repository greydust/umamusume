export interface LocalizationData {
  character: {
    name: LocalizationMap,
  },
  course: {
    name: LocalizationMap,
  },
  site: LocalizationMap,
  [key: string]: string | LocalizationSubData,
}

export interface LocalizationSubData {
  [key: string]: string | LocalizationSubData,
}

interface LocalizationMap {
  [key: string]: string,
}

class Common {
}

export default Common;
