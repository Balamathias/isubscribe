import { ClassValue } from "clsx"

export const networks: {
    name: string,
    value: string,
    imgURL: string,
    activeClassName: ClassValue,
}[] = [
    {
        name: 'GLO',
        value: 'glo',
        imgURL: '/images/networks/glo.png',
        activeClassName: 'text-white bg-gradient-to-tr from-green-600 to-green-400' 
    },
    {
        name: 'MTN',
        value: 'mtn',
        imgURL: '/images/networks/mtn.png',
        activeClassName: 'text-white bg-gradient-to-tr from-yellow-600 to-yellow-400'
    },
    {
        name: 'Airtel',
        value: 'airtel',
        imgURL: '/images/networks/airtel.png',
        activeClassName: 'text-white bg-gradient-to-tr from-rose-600 to-rose-400'
    },
    {
        name: '9Moblile',
        value: '9mobile',
        imgURL: '/images/networks/9mobile.png',
        activeClassName: 'text-white bg-gradient-to-tr from-lime-600 to-lime-400'
    },
]