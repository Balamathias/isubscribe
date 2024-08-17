import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { LucideCheckCircle2, LucideXCircle } from "lucide-react"
import DynamicModal from "../DynamicModal"
import ShareReciept from "./ShareReciept"

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
            dialogClassName="sm:max-w-[640px] md:max-w-[500px] "
            drawerClassName=''
        >
            <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
                {
                    failed ? (<LucideXCircle className="text-red-600 dark:text-red-500 mb-1" />) : (<LucideCheckCircle2 size={38} className="text-green-600 dark:green-red-500 mb-1" />)
                }
                <h2 className={cn("text-green-600 dark:text-green-500 md:text-lg font-[500px] text-base", {'text-red-600 dark:text-red-500': failed})}>{failed ? 'Purchase Failed' : 'Successfull'}!</h2>
              <h2 className=' font-bold text-lg text-black dark:text-white'>{action === 'data' ? dataAmount : airtimeAmount} <span className=" font-normal text-base">for {phoneNumber}</span></h2>
                {
                    failed ? (
                        <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                            {errorMessage}
                        </p>
                    ) : (
                        <div className="flex flex-col gap-5 mt-2 p-2  max-md:w-[94vw]">
                            <ShareReciept freeData={"250MB"} rLink={"#"} sLink={"#"} />
                        </div>
                        // <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
                        //     Congratulations {fullName}!, You have successfully topped up {action === 'data' ? dataAmount : airtimeAmount} for {phoneNumber}. Thank you for choosing iSubscribe.
                        // </p>
                    )
                }

                <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : 'default'} onClick={() => closeModal()}>Close</Button>
            </div>
        </DynamicModal>
    )
}

export default SubPurchaseStatus