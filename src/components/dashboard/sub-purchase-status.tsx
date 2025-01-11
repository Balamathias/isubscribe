import { cn, DATA_MB_PER_NAIRA, formatDataAmount } from "@/lib/utils";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import DynamicModal from "../DynamicModal";
import ShareReciept from "./ShareReciept";
import { LucideCheckCircle2, LucideXCircle, LucideX, LucideClock } from "lucide-react";
import { formatNigerianNaira } from "@/funcs/formatCurrency";
import Confetti from 'react-confetti'

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
  successMessage
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

  const isPending = successMessage?.includes('pending')

  return (
    <DynamicModal
      open={open}
      closeModal={closeModal}
      dialogClassName="sm:max-w-[640px] md:max-w-[500px] rounded-2xl"
      dismissible={false}
      hideDrawerCancel
    >
      {!failed && !isPending ? <Confetti className="w-full h-full" tweenDuration={3000} recycle={false} /> : null}
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
        ) : isPending ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="text-amber-600 dark:text-amber-500"
          >
            <LucideClock className="w-12 h-12" />
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
            { "text-red-600 dark:text-red-500": failed, 
              "text-green-600 dark:text-green-500": !failed && !isPending, 
              "text-amber-600 dark:text-amber-500": isPending }
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {failed ? "Failed" : isPending ? "Pending" : "Successful"}!
        </motion.h2>

        <motion.h2
          className="text-black dark:text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {action === "data" ? dataAmount : formatNigerianNaira(airtimeAmount as number)}{" "}
          <span className="font-semibold text-base">for {phoneNumber}</span><br />
          {isPending && <span className="text-muted-foreground">{successMessage}</span>}
        </motion.h2>

        {failed ? (
          <motion.p
            className="text-xs md:text-sm tracking-tighter py-1 text-center text-muted-foreground"
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
          className="w-full mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            className='rounded-xl bg-gradient-to-r from-primary to-pink-600 text-white flex items-center gap-1 w-full'
            variant={'secondary'}
            size={'lg'}
            asChild
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.35 }}
            onClick={() => closeModal()}
          >
            Close
            <LucideX className="h-5 w-5" />
          </motion.button>
        </Button>
        </motion.div>
      </div>
    </DynamicModal>
  );
};

export default SubPurchaseStatus;
