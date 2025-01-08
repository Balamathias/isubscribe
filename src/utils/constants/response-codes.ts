export const RESPONSE_CODES = {
    TIME_NOT_CORRECT: {
        code: "085",
        message: "Invalid Device time, Please ensure that your device time is properly set in the 24 Hour format or GMT + 1." 
    },
    TRANSACTION_FAILED: {
        code: "016",
        message: "Transaction failed, please verify your details and try again.",
    },
    TRANSACTION_SUCCESSFUL: {
        code: '000',
        message: "Transaction completed successfully. Thank you for choosing isubscribe!"
    },
    NO_PRODUCT_VARIATION: {
        code: '010',
        message: "It appears the Product you selected does not exist in stock, please choose another one."
    },
    PRODUCT_DOES_NOT_EXIST: {
        code: '012',
        message: "It appears the Product you selected does not exist, please choose another one."
    },
    LOW_WALLET_BALANCE: {
        code: '018',
        message: `This service provider is currently unavailable, please try again later.`
    },
    TRANSACTION_PENDING: {
        code: '099',
        message: `This transaction is pending.`
    },
} as const