import { EVENT_TYPE } from "./EVENTS";

export const product = {
    'mtn': {
        name: 'MTN',
        image: '/images/networks/mtn.png'
    },
    'glo': {
        name: 'GLO',
        image: '/images/networks/glo.png'
    },
    'airtel': {
        name: 'AIRTEL',
        image: '/images/networks/airtel.png'
    },
    '9mobile': {
        name: '9MOBILE',
        image: '/images/networks/9mobile.png'
    },
    [EVENT_TYPE.wallet_fund]: {
        name: 'WALLET FUND',
        image: '/images/networks/transfer.png'
    },
    [EVENT_TYPE.tv_topup]: {
        name: 'TV Cable',
        image: '/images/networks/tv.png'
    },
    [EVENT_TYPE.meter_topup]: {
        name: 'METER',
        image: '/images/networks/electricity.png'
    },
}