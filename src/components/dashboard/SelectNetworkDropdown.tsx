import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNetwork } from "@/providers/data/sub-data-provider"
import Image from "next/image"

export const networkImages = {
    'mtn': '/images/networks/mtn.png',
    'glo': '/images/networks/glo.png',
    'airtel': '/images/networks/airtel.png',
    '9mobile': '/images/networks/9mobile.png',
}

export default function SelectNetworkDropdown({}) {
    const { currentNetwork, setCurrentNetwork } = useNetwork()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex flex-col gap-y-1 cursor-pointer">
        <div className="flex flex-col justify-center items-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-white dark:bg-background cursor-pointer">
            <Image 
                src={networkImages[currentNetwork]} 
                width={50} 
                height={50} 
                quality={100}
                alt={currentNetwork}
                className='md:h-8 md:w-8 h-5 w-5 object-cover'
            />
            {/* <span className="text-sm font-semibold text-violet-600">{currentNetwork}</span> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-none border-none drop-shadow-none rounded-xl">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setCurrentNetwork('mtn')}>
            MTN
            <DropdownMenuShortcut>
                <Image 
                    src='/images/networks/mtn.png' 
                    width={20} 
                    height={20} 
                    quality={100}
                    alt='mtn'
                    className='rounded-md md:h-8 md:w-8 h-6 w-6'
                />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentNetwork('glo')}>
            GLO
            <DropdownMenuShortcut>
                <Image 
                    src='/images/networks/glo.png' 
                    width={20} 
                    height={20} 
                    quality={100}
                    alt='glo'
                    className='rounded-md md:h-8 md:w-8 h-6 w-6'
                />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentNetwork('airtel')}>
            Airtel
            <DropdownMenuShortcut>
                <Image 
                    src='/images/networks/airtel.png' 
                    width={20} 
                    height={20} 
                    quality={100}
                    alt='airtel'
                    className='rounded-md md:h-8 md:w-8 h-6 w-6'
                />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentNetwork('9mobile')}>
            9MOBILE
            <DropdownMenuShortcut>
                <Image 
                    src='/images/networks/9mobile.png' 
                    width={20} 
                    height={20} 
                    quality={100}
                    alt='9mobile'
                    className='rounded-md md:h-8 md:w-8 h-6 w-6'
                />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
