import React, { useState } from 'react'
import { airtel_data, etisalat_data, glo_data, mtn_data } from '@/utils/constants/data-plans';
import { useNetwork } from '@/providers/data/sub-data-provider';
import DynamicModal from '../../DynamicModal';
import { Button } from '../../ui/button';
import { PaymentMethod, SubDataProps } from '@/types/networks';
import { toast } from 'sonner';
import { useGetWalletBalance } from '@/lib/react-query/funcs/wallet';
import { formatNigerianNaira } from '@/funcs/formatCurrency';
import ConfirmPin from '../ConfirmPin';
import { priceToInteger } from '@/funcs/priceToNumber';
import ActivePaymentMethodButton from './ActivePaymentMethodButton';
import { product } from '@/utils/constants/product';
import { useGetProfile } from '@/lib/react-query/funcs/user';
import NetworkCardItem from './NetworkCardItem';
import ConfirmProductInfo from './confirm-product-info';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import { Loader2 } from 'lucide-react';
import SimpleLoader from '@/components/loaders/simple-loader';

const object = {
    'mtn': mtn_data,
    'glo': glo_data,
    'airtel': airtel_data,
    '9mobile': etisalat_data
}


const DataNetworkCard = () => {
    const { currentNetwork, handleSubData, mobileNumber, setOpenConfirmPurchaseModal, openConfirmPurchaseModal, purchasing } = useNetwork()
    const [selected, setSelected] = useState<SubDataProps | null>(null)

    const {data: wallet, isPending} = useGetWalletBalance()
    
    const { data: profile, isPending: profilePending } = useGetProfile()

    const [proceed, setProceed] = React.useState(false)

    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wallet')

    if (isPending || profilePending) return (
        <SimpleLoader />
    )

  return (
    <div className="grid grid-flow-row grid-cols-5 max-md:grid-cols-3 gap-2 gap-y-4">
        {object[currentNetwork]?.map((d, idx) => (
            <NetworkCardItem 
                key={idx} 
                handler={() => {
                    if (!mobileNumber) return toast.warning('Please enter a mobile number, it can\'t be empty!')
                    if ((mobileNumber.length < 11) || (mobileNumber.length > 11)) return toast.warning('Please enter a valid 11-digit mobile number')

                    setSelected(d)
                    setOpenConfirmPurchaseModal?.(true)
                }}
                dataCashBack={priceToInteger(d.CashBack)}
                dataQty={d.Data}
                dataDuration={d.Duration}
                dataPrice={priceToInteger(d.Price)}
            />
        ))}

        {
            
            <DynamicModal
                open={openConfirmPurchaseModal}
                setOpen={setOpenConfirmPurchaseModal}
                dismissible
                dialogClassName="sm:max-w-[640px] md:max-w-[550px]"
            >
                 {purchasing && 
                    <LoadingSpinner isPending={purchasing} />
                    }
                <div className="flex flex-col gap-y-2.5 w-full">
                    
                    <ConfirmProductInfo 
                        cashBack={priceToInteger(selected?.CashBack || '0.00')}
                        currentNetwork={currentNetwork}
                        dataDuration={selected?.Duration || ''}
                        dataQty={selected?.Data || ''}
                        image={product[currentNetwork].image}
                        mobileNumber={mobileNumber}
                        price={priceToInteger(selected?.Price || '0.00')}
                    />

                    <div className='flex flex-col w-full gap-y-2.5'>
                        <ActivePaymentMethodButton 
                            active={paymentMethod === 'wallet'} 
                            handler={() => {setPaymentMethod('wallet')}} 
                            method='wallet'
                            balance={formatNigerianNaira(wallet?.data?.balance! as number)}
                            disabled={wallet?.data?.balance! < priceToInteger(selected?.Price || '0.00')}
                        />
                        <ActivePaymentMethodButton 
                            active={paymentMethod === 'cashback'} 
                            handler={() => {setPaymentMethod('cashback')}} 
                            method='cashback'
                            balance={formatNigerianNaira(wallet?.data?.cashback_balance! as number)}
                            disabled={wallet?.data?.cashback_balance! < priceToInteger(selected?.Price || '0.00')}
                        />
                    </div>

                    <Button 
                        className='w-full rounded-xl' 
                        size={'lg'}
                        disabled={wallet?.data?.balance! < priceToInteger(selected?.Price || '0.00')}
                        onClick={() => {
                            setProceed(true)
                        }}
                    >Proceed</Button>
                </div>
            </DynamicModal>
        }

        {
            <DynamicModal
                open={proceed}
                setOpen={setProceed}
                dismissible
                dialogClassName={'sm:max-w-fit dark:bg-card'}
                drawerClassName="dark:bg-card"
            >
                <ConfirmPin 
                    className='rounded-none' 
                    func={() => {
                        handleSubData?.({...selected!, method: paymentMethod})
                        setProceed(false)
                    }} 
                    profile={profile?.data!}
                />
            </DynamicModal>
        }
    </div>
  )
}

export default DataNetworkCard
