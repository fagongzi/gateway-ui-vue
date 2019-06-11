/**
 *
 * @param title
 * @param type
 * @returns {*}
 */
export function generateTitle(title, type) {
    let titleStr = type ? type + '.' + title : title;
    const hasKey = this.$t(titleStr);

    if (hasKey) {
        // $t :this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = this.$t(titleStr);

        return translatedTitle;
    }

    return title;
}
