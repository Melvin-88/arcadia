const {
  languages, lng, ns, defaultNS, nsSeparator,
} = require('./constants');

module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  output: './',
  options: {
    ns,
    defaultNs: defaultNS,
    lngs: Object.values(languages),
    defaultLng: lng,
    defaultValue: '__STRING_NOT_TRANSLATED__',
    debug: true,
    sort: true,
    removeUnusedKeys: true,
    nsSeparator,
    resource: {
      loadPath: 'i18n/{{lng}}/{{ns}}.json',
      savePath: 'i18n/{{lng}}/{{ns}}.json',
    },
    func: {
      list: ['t', '$t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
};
