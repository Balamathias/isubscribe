export type TvCables = 'dstv' | 'gotv' | 'startimes' | 'showmax'


export interface SubTvPayload {
    name: string,
    serviceID: string,
    variation_code: string,
    variation_amount:string,
    amount?:  number,
    smartcardNumber?: string | number,
    cashBack?: string,
    fixedPrice?: boolean,
    detail?: {
        providerName: string;
        providerAmount: string;
        duration: string;
    }
}