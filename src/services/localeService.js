export class LocaleService {
    constructor(i18nProvider) {
        this.i18nProvider - i18nProvider;
    }

    getCurrentLocale() {
        return this.i18nProvider.getLocale();
    }

    getLocales() {
        return this.i18nProvider.getLocales();
    }

    setLocale(locale) {
        if(this.getLocale().indexOf(locale) !== -1) {
            this.i18nProvider.setlocale(locale)
        }
    }

    translate(string, args = undefined) {
        return this.i18nProvider.translate(string, args);
    }
}