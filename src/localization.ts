import _ from 'lodash';

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

  getLocalization(locale: string) {
    const files = this.localizer[locale]();
    const filesJson = _.map(files.keys(), (key) => files(key));
    return _.merge({}, this.default, ...filesJson);
  }
}

export default Localization;
