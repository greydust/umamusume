import _ from 'lodash';

import { LocalizationData, LocalizationSubData } from './library/common';

class Localization {
  default: {};

  localizer: {
    [key: string]: () => __WebpackModuleApi.RequireContext;
  };

  static getLocalizationJaJp() {
    return require.context('./localization/ja_jp/', true, /\.json$/);
  }

  static getLocalizationEnUs() {
    return require.context('./localization/en_us/', true, /\.json$/);
  }

  static getLocalizationZhTw() {
    return require.context('./localization/zh_tw', true, /\.json$/);
  }

  constructor() {
    this.default = {};
    this.localizer = {
      'ja-jp': Localization.getLocalizationJaJp,
      'en-us': Localization.getLocalizationEnUs,
      'zh-tw': Localization.getLocalizationZhTw,
    };
    this.default = this.getLocalization('ja-jp');
  }

  getLocalization(locale: string): LocalizationData {
    const files = this.localizer[locale]();
    const fileJson: LocalizationSubData = {};
    for (const fileKey of files.keys()) {
      const structure = fileKey.split('.')[1].split('/');

      let target: LocalizationSubData = fileJson;
      for (let i = 1; i < structure.length; i += 1) {
        if (!(structure[i] in fileJson)) {
          target[structure[i]] = {};
        }
        target = target[structure[i]] as LocalizationSubData;
      }
      _.merge(target, files(fileKey));
    }
    return _.merge({}, this.default, fileJson) as LocalizationData;
  }
}

export default Localization;
