const __object = {
    'mtn': '01',
    'glo': '02',
    '9mobile': '03',
    'airtel': '04'
}

const __object__string = {
    'mtn': 'MTN',
    'glo': 'GLO',
    '9mobile': '9MOBILE',
    'airtel': 'AIRTEL'
}

export const getNetworkValue = (network: 'mtn' | 'glo' | '9mobile' | 'airtel', type?: 'alpha' | 'alphanumeric') => {
    return type === 'alpha' ? __object__string[network] : __object[network]
}