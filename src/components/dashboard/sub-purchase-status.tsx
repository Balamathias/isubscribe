import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { LucideCheckCircle2, LucideXCircle } from "lucide-react"
import DynamicModal from "../DynamicModal"

const SubPurchaseStatus = ({
    closeModal, 
    dataAmount, 
    fullName, 
    open, 
    phoneNumber, 
    failed, 
    action='data', 
    airtimeAmount,
    errorMessage
}: {
    dataAmount: string,
    phoneNumber: string,
    fullName: string,
    open: boolean,
    closeModal: () => void,
    failed?: boolean,
    action?: 'data' | 'airtime',
    airtimeAmount?: string | number,
    errorMessage?: string,
    successMessage?: string,
}) => {
    return (
        <DynamicModal
            open={open}
            closeModal={closeModal}
        >
            <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
                {
                    failed ? (<LucideXCircle className="text-red-600 dark:text-red-500 mb-1" />) : (<LucideCheckCircle2 size={38} className="text-green-600 dark:green-red-500 mb-1" />)
                }
                <h2 className={cn("text-green-600 dark:text-green-500 md:text-lg text-base", {'text-red-600 dark:text-red-500': failed})}>{failed ? 'Purchase Failed' : 'Success'}!</h2>
                {
                    failed ? (
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            {errorMessage}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            Congratulations {fullName}!, You have successfully topped up {action === 'data' ? dataAmount : airtimeAmount} for {phoneNumber}. Thank you for choosing iSubscribe.
                        </p>
                    )
                }

                <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : 'default'} onClick={() => closeModal()}>Close</Button>
            </div>
        </DynamicModal>
    )
}

export default SubPurchaseStatus