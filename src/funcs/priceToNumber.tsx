// const mock_data = 'N300.00' => 300 or 300.00

const RATE = 0.05

export const priceToInteger = (price: string) => {
    return parseInt(price.replace(/\D/g, '')) / 100
}

export const priceToFloat = (price: string) => {
    return parseFloat(price.replace(/\D/g, ''))
}

export const parseWithInterestPrice = (price: string, rate?: number) => {
    const parsedPrice = priceToInteger(price)
    const priceWithInterest = parseFloat(Math.floor((parsedPrice * (rate || RATE)) + parsedPrice).toString())
    return priceWithInterest
}
