import _ from 'lodash';

class Localization {
  constructor() {
    const files = require.context('./localization/', true, /ja-jp\.json$/);
    const filesJson = _.map(files.keys(), (key) => files(key));
    this.default = _.merge({}, ...filesJson);
  }

  getLocalization(locale) {
    const files = require.context('./localization/', true, /.json$/);
    const filesJson = _
      .chain(files.keys())
      .filter((key) => _.includes(key, locale))
      .map((key) => files(key))
      .value();
    return _.merge({}, this.default, ...filesJson);
  }
}

export default Localization;
