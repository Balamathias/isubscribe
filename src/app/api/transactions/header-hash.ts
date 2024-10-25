const sha512 = require('js-sha512').sha512;

const DEFAULT_MERCHANT_CLIENT_SECRET = process.env.NEXT_MONNIFY_SECRET_KEY

export const computeHash = (requestBody: any) => {
    const result = sha512.hmac(DEFAULT_MERCHANT_CLIENT_SECRET, requestBody)
    return result
}


const stringifiedRequestBody = '{"eventData":{"product":{"reference":"111222333","type":"OFFLINE_PAYMENT_AGENT"},"transactionReference":"MNFY|76|20211117154810|000001","paymentReference":"0.01462001097368737","paidOn":"17/11/2021 3:48:10 PM","paymentDescription":"Mockaroo Jesse","metaData":{},"destinationAccountInformation":{},"paymentSourceInformation":{},"amountPaid":78000,"totalPayable":78000,"offlineProductInformation":{"code":"41470","type":"DYNAMIC"},"cardDetails":{},"paymentMethod":"CASH","currency":"NGN","settlementAmount":77600,"paymentStatus":"PAID","customer":{"name":"Mockaroo Jesse","email":"111222333@ZZAMZ4WT4Y3E.monnify"}},"eventType":"SUCCESSFUL_TRANSACTION"}';
const computedHash = computeHash(stringifiedRequestBody);
console.log("Computed hash", computedHash);
