export const formatNigerianNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
};

export const formatCurrency = ({amount, currency, lang}:{amount: number, currency: string, lang: string}): string => {
    return new Intl.NumberFormat(lang, {
        style: 'currency',
        currency,
    }).format(amount)
}