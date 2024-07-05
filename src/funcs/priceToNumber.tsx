// const mock_data = 'N300.00' => 300 or 300.00

export const priceToInteger = (price: string) => {
    return parseInt(price.replace(/\D/g, '')) / 100
}

export const priceToFloat = (price: string) => {
    return parseFloat(price.replace(/\D/g, ''))
}

export const priceToNumber = (price: string) => {
    return priceToFloat(price)
}