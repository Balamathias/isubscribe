// mtn: "MTN N100 100MB - (24 Hours)",
// glo: "Glo Data N1500 - 4.1GB - 30 days"
// airtel: "Airtel Data - 50 Naira - 40MB - 1Day",
// 9mobile: "9mobile 500mb SME plan"

import { Networks } from "@/types/networks"

/**
 * @returns {
 *  network: string,
 * dataAmount: string,
 * duration: string,
 * dataQty: string
 * }
 */
export const parseDataName = (data: string, carrier: Networks): { network: string, dataAmount: string, duration: string, dataQty: string } => {
    let network = ''
    let dataAmount = ''
    let duration = ''
    let dataQty = ''
    switch (carrier) {
        case 'mtn':
            network = 'MTN'
            dataAmount = data.split(' ')[1]
            duration = data.split(' - ')[1]
            dataQty = data.split(' ')[2]
            break
        case 'glo':
            network = 'GLO'
            dataAmount = data.split(' - ')[1]
            duration = data.split(' - ')[2]
            dataQty = data.split(' - ')[1]
            break
        case 'airtel':
            network = 'AIRTEL'
            dataAmount = data.split(' - ')[2]
            duration = data.split(' - ')[3]
            dataQty = data.split(' - ')[2]
            break
        case '9mobile':
            network = '9MOBILE'
            dataAmount = data.split(' ')[1]
            duration = '1 Day'
            dataQty = data.split(' ')[1]
            break
        default:
            break
    }

    return {
        network,
        dataAmount,
        duration,
        dataQty
    }
}