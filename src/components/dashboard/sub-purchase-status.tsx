import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import DynamicModal from "../DynamicModal";
import ShareReciept from "./ShareReciept";
import { LucideCheckCircle2, LucideXCircle } from "lucide-react";

const SubPurchaseStatus = ({
  closeModal,
  dataAmount,
  dataBonus,
  fullName,
  open,
  phoneNumber,
  failed,
  action = "data",
  airtimeAmount,
  errorMessage,
}: {
  dataAmount: string;
  phoneNumber: string;
  fullName: string;
  open: boolean;
  closeModal: () => void;
  failed?: boolean;
  action?: "data" | "airtime";
  airtimeAmount?: string | number;
  errorMessage?: string;
  successMessage?: string;
  dataBonus?: number;
}) => {
  const iconVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { opacity: 1, pathLength: 1, transition: { duration: 1 } },
  };

  return (
    <DynamicModal
      open={open}
      closeModal={closeModal}
      dialogClassName="sm:max-w-[640px] md:max-w-[500px] rounded-2xl"
    >
      <div className="flex flex-col gap-y-1 p-6 items-center justify-center">
        {failed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="text-red-600 dark:text-red-500"
          >
            <LucideXCircle className="w-12 h-12" />
          </motion.div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-green-600/25 flex items-center justify-center">
            <motion.svg
            className="w-6 h-6 text-green-600 dark:text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate="visible"
            variants={iconVariants}
          >
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={iconVariants}
            />
          </motion.svg>
          </div>
        )}

        <motion.h2
          className={cn(
            "text-lg font-semibold text-center",
            failed
              ? "text-red-600 dark:text-red-500"
              : "text-green-600 dark:text-green-500"
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {failed ? "Purchase Failed" : "Purchase Successful"}!
        </motion.h2>

        <motion.h2
          className="font-bold text-lg text-black dark:text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {action === "data" ? dataAmount : airtimeAmount}{" "}
          <span className="font-normal text-base">for {phoneNumber}</span>
        </motion.h2>

        {failed ? (
          <motion.p
            className="text-xs md:text-sm tracking-tighter py-1 text-center text-red-600 dark:text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {errorMessage}
          </motion.p>
        ) : (
          <motion.div
            className="flex flex-col gap-5 mt-2 p-2 max-md:w-[94vw]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShareReciept freeData={formatDataAmount(dataBonus! * DATA_MB_PER_NAIRA)} />
          </motion.div>
        )}

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            className={cn(
              "w-full my-2 rounded-full text-white py-2",)}
            size={"lg"}
            onClick={closeModal}
          >
            Close
          </Button>
        </motion.div>
      </div>
    </DynamicModal>
  );
};

export default SubPurchaseStatus;




















// import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils"
// import { Button } from "../ui/button"
// import { LucideCheckCircle2, LucideXCircle } from "lucide-react"
// import DynamicModal from "../DynamicModal"
// import ShareReciept from "./ShareReciept"
// import { motion } from "framer-motion"
// import Status from "../status"

// const SubPurchaseStatus = ({
//     closeModal, 
//     dataAmount, 
//     dataBonus, 
//     fullName, 
//     open, 
//     phoneNumber, 
//     failed, 
//     action='data', 
//     airtimeAmount,
//     errorMessage,
// }: {
//     dataAmount: string,
//     phoneNumber: string,
//     fullName: string,
//     open: boolean,
//     closeModal: () => void,
//     failed?: boolean,
//     action?: 'data' | 'airtime',
//     airtimeAmount?: string | number,
//     errorMessage?: string,
//     successMessage?: string,
//     dataBonus?: number,
    
// }) => {
//     return (
//         <DynamicModal
//             open={open}
//             closeModal={closeModal}
//             dialogClassName="sm:max-w-[640px] md:max-w-[500px] rounded-2xl"
//         >
//             <div className="flex flex-col gap-y-1 p-3 items-center justify-center">
//                 {
//                     <Status type="icon" status={
//                         failed ? "failed" : "success"
//                     } />
//                 }
//                 <h2 className={cn("text-green-600 dark:text-green-500 md:text-lg font-[500px] text-base", {'text-red-600 dark:text-red-500': failed})}>{failed ? 'Purchase Failed' : 'Successful'}!</h2>
//               <h2 className=' font-bold text-lg text-black dark:text-white'>{action === 'data' ? dataAmount : airtimeAmount} <span className=" font-normal text-base">for {phoneNumber}</span></h2>
//                 {
//                     failed ? (
//                         <p className="text-muted-foreground text-xs md:text-sm tracking-tighter py-1 text-center">
//                             {errorMessage}
//                         </p>
//                     ) : (
//                         <motion.div 
//                             className="flex flex-col gap-5 mt-2 p-2 max-md:w-[94vw]"
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.5 }}
//                         >
//                             <ShareReciept freeData={formatDataAmount(dataBonus! * DATA_MB_PER_NAIRA)} />
//                         </motion.div>
//                     )
//                 }

//                 <Button className="w-full my-2 rounded-full" size={'lg'} variant={failed ? 'destructive' : 'default'} onClick={() => closeModal()}>Close</Button>
//             </div>
//         </DynamicModal>
//     )
// }

// export default SubPurchaseStatus