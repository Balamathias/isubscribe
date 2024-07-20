// {"Plan_ID": 1, "Type": "SME", "Data": "500MB", "Price": "₦128.00", "Duration": "1 Month", "CashBack": "₦4.00"},

export interface ALLDATA {
    planId: number | string;
    dataQty: string;
    duration: string;
    unitPrice: number;
    unitCashback: number;
    interest: number;
    network?: string;
    planType?: string;
}

const plan: ALLDATA = {
    planId: 1,
    planType: 'SME',
    dataQty: '500MB',
    duration: '1 Month',
    unitPrice: 128,
    unitCashback: 4,
    network: 'mtn',
    interest: 0.4
}

const mtnData = {
    daily: [
      {
        variation_code: "mtn-10mb-100",
        name: "MTN N100 100MB - (24 Hours)",
        variation_amount: "100.00",
        fixedPrice: "Yes",
        cashback: "4.00"
      },
    ]
}

const _plan: ALLDATA = {
    planId: 'mtn-10mb-100', // HINT: => from 'variation_code' in mtnData.daily
    dataQty: '100MB',
    duration: '24 Hours', // HINT: => from 'name' in mtnData.daily
    unitPrice: 100, // HINT: => from 'name' in mtnData.daily // NOTE: => this is the price in naira - N100
    unitCashback: 4, // HINT: => from 'cashback' in mtnData.daily
    network: 'mtn', 
    interest: 0.4,

}