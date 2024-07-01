'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Check, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { getUser } from '@/lib/supabase/accounts'
import { getWallet, updateWalletBalance } from '@/lib/supabase/wallets'
import { Card } from '../ui/card'
import { getCurrentUser } from '@/lib/supabase/user.actions'
import { Tables } from '@/types/database'
import DynamicModal from '../DynamicModal'
import { Button } from '../ui/button'

interface WelcomeBonusModalProps {
    type?: 'basic' | 'premium',
    profile?: Tables<'profile'>,
    wallet?: Tables<'wallet'>,
}

const WelcomeBonusModal = ({ type = 'basic', profile, wallet }: WelcomeBonusModalProps) => {
    const [claimed, setClaimed] = useState(wallet?.bonus_claimed ?? false)
    
    const reward = 200

  const [loading, setLoading] = useState(false)
  const [successful, setSuccessful] = useState(false)
  const router = useRouter()

  const handleClaimWelcomeBonus = async () => {

    try {
      setLoading(true)
      if (wallet?.bonus_claimed === true){
        toast.info("You have claimed your welcome Bonus already!")
        setLoading(false)
        return
      }

      const walletBalance = parseFloat(wallet?.balance?.toString()!) || 0.00;
      const balance = walletBalance + reward

      await updateWalletBalance(wallet?.id!, balance)
      setSuccessful(true)

      setClaimed(true)

      setLoading(false)

      router.refresh()
    } catch (error) {
      toast.error("Sorry something went wrong, please try again")
      console.log(error)
    } finally {
        setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setSuccessful(false)
  }

  if (!claimed) {
    return (
        <DynamicModal
            open={claimed === false}
            setOpen={setClaimed}
        >
            <div className='flex flex-col py-2 gap-y-4'>
                <h2 className='text-xl font-semibold'>Congratulations <span className="text-primary">{profile?.full_name}</span>!,</h2>
                <p className="text-base tracking-tighter">Your account has been verified successfully! <br />
                    You&apos;ve also been Awarded with <span className='text-primary font-extrabold'>₦200</span> Welcome Bonus for signing up to <span className="text-primary">iSubscribe</span>.
                </p>
                <Button 
                    className='w-full rounded-xl mt-2' 
                    size={'lg'}
                    onClick={handleClaimWelcomeBonus}
                >
                    {loading ? 'Hang tight...' : 'Claim Bonus Now 🎉'}
                </Button>
            </div>
        </DynamicModal>
    )
  }

    return (
        <DynamicModal
            open={successful === true}
            setOpen={setSuccessful}
        >
            <div className='flex flex-col py-2 gap-y-4'>
                <div className='w-full mx-auto flex py-1 items-center justify-center'>
                    <CheckCircle2 strokeWidth={2} size={60} className='text-green-600' />
                </div>
                <h2 className='text-xl font-semibold'>Congratulations <span className="text-primary">{profile?.full_name} 🎉</span>!</h2>
                <p className="text-base tracking-tighter">You have successfully claimed your welcome bonus! We Welcome You to our Community where Bill Payment is just a Click of a Button!
                </p>
                <Button 
                    className='w-full rounded-xl mt-2' 
                    size={'lg'}
                    variant={'destructive'}
                    onClick={handleCloseModal}
                >
                    Continue
                </Button>
            </div>
        </DynamicModal>
    )













//   if(successfull){
//     return(
//       <Card className="border-none shadow-none p-4 lg:p-2 bg-gradient-to-t from-violet-200 to-violet-100 mt- flex flex-col gap-4 items-center dark:from-violet-800  dark:to-violet-900  w-full">
//       <div className="flex flex-col items-center justify-center gap-3">
//            <span className=' flex items-center justify-center max-sm:h-12 max-sm:w-12 h-14 w-14 p-1 rounded-full bg-green-600 text-white'>
//                 <Check size={40} />
//             </span>
//             <p className=' text-3xl'>Successfull</p>
//       </div>
//         <div className="flex flex-col items-center justify-center self-center gap-2 flex-">
//             <h2 className="text-xl py-1 text-nowrap leading-relaxed font-bold">
//                 Hi <span className="text-brand dark:text-white tracking-tighter">{user?.full_name}</span>,<span className=' font-extrabold text-lg text-violet-900'> Congratulations</span>!
//             </h2>
//             <p className="text-sm tracking-tighter"> You&apos;ve Successfully Claimed your Welcome Bonus!</p>
//             <p className="text-sm tracking-tighter lg:text-nowrap"> We Welcome You to our Community where Bill Payment is just a Click of a Button!</p>
//             <p className="text-lg tracking-tighter ">Thank You for Choosing iSubscribe.</p>

//         </div>
//         <div className=' flex items-center flex-row gap-6 py- px- w-full'>
//               <Button className={` bg-red-600 hover:bg-red-700 w-1/2`} onClick={handleCloseModal}>Close</Button>
//               <Button className={` bg-green-600 hover:bg-green-700 w-1/2`} onClick={handleCloseModal}> Continue</Button>
//         </div>
        
//     </Card>
//     )
//   }

//   return (
//     <Card className="border-none shadow-none p-4 lg:p-6 bg-gradient-to-t from-violet-200 to-violet-100 mt- flex justify-between gap-4 items-center dark:from-violet-800 dark:to-violet-900 w-full">
//         <div className="flex flex-col gap-2 flex-1">
//             <h2 className="text-xl py-1 text-nowrap leading-relaxed font-bold">
//                 Hi <span className="text-brand dark:text-white tracking-tighter">{user?.full_name}</span>, <br />Welcome to <span className=' font-extrabold text-lg text-violet-900'>iSubscribe</span>!
//             </h2>
//             <p className="text-sm tracking-tighter">Your account has been verified successfully!</p>
//             <p className="text-sm tracking-tighter">And you&apos;ve been Awarded with <span className=' font-extrabold'>₦200</span> Welcome Bonus to Sub for Any Bill of your Choice!</p>

//             <Button
//               onClick={handleClaimWelcomeBonus}
//               className='w-full bg-gradient-to-br text-white p-3 rounded-md from-violet-700 to-violet-900 hover:bg-violet-900 mt-2 font-semibold'>{loading ? "Processing it..." : "Claim your Reward Now!"}</Button>
//         </div>
//         <div className="flex-1 hidden md:flex">
//             <Image 
//                 src='/welcome-1.jpeg' 
//                 width={300} 
//                 height={300} 
//                 quality={100} 
//                 className={'w-full rounded-lg max-h-[250px] text-violet-400 object-cover'}
//                 alt='Welcome' 
//             />
//         </div>
//     </Card>
//   )
}

export default WelcomeBonusModal