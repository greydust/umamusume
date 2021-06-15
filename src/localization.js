import _ from 'lodash';

class Localization {
  static getLocalizationJaJp() {
    return require.context('./localization/', true, /ja-jp\.json$/);
  }

  static getLocalizationEnUs() {
    return require.context('./localization/', true, /en-us\.json$/);
  }

  static getLocalizationZhTw() {
    return require.context('./localization/', true, /zh-tw\.json$/);
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

  getLocalization(locale) {
    const files = this.localizer[locale]();
    const filesJson = _.map(files.keys(), (key) => files(key));
    return _.merge({}, this.default, ...filesJson);
  }
}

export default Localization;
