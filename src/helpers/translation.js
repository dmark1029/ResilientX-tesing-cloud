import i18n from "/@src/i18n"

const Translation = {
    async switchLanguage(locale, translations) {
        i18n.global.setLocaleMessage(locale, translations)

        i18n.global.locale.value = locale;

        document.querySelector("html").setAttribute("lang", locale)

        localStorage.setItem("locale", locale)
    },

    getLanguage() {
        return localStorage.getItem("locale") ?? 'en';
    },
}

export default Translation