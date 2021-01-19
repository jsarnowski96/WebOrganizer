import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'pl'],
  defaultLocale: 'pl',
  queryParameter: 'lang',
  directory: path.join('../', 'locales'),
  api: {
    '__': 'translate'
  },
});

export default i18n;