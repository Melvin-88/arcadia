const languages = {
  en: 'en',
};

const namespaces = {
  general: 'general',
};

const lng = languages.en;
const ns = Object.values(namespaces);
const defaultNS = namespaces.general;
const nsSeparator = '/';

module.exports = {
  languages,
  namespaces,
  lng,
  ns,
  defaultNS,
  nsSeparator,
};
