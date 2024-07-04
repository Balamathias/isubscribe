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
import { Networks } from "@/types/networks"
import { LucideCheck } from "lucide-react"
import Image from "next/image"

export const networkImages = {
    'mtn': '/images/networks/mtn.png',
    'glo': '/images/networks/glo.png',
    'airtel': '/images/networks/airtel.png',
    '9mobile': '/images/networks/9mobile.png',
}

const dropDownNetworks = [
    {
        name: 'MTN',
        value: 'mtn',
        image: '/images/networks/mtn.png'
    },
    {
        name: 'GLO',
        value: 'glo',
        image: '/images/networks/glo.png'
    },
    {
        name: 'Airtel',
        value: 'airtel',
        image: '/images/networks/airtel.png'
    },
    {
        name: '9MOBILE',
        value: '9mobile',
        image: '/images/networks/9mobile.png'
    },

]

export default function SelectNetworkDropdown({}) {
    const { currentNetwork, setCurrentNetwork } = useNetwork()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex flex-col gap-y-1 cursor-pointer">
        <div className="flex flex-col dark:bg-background cursor-pointer hover:opacity-80">
            <Image 
                src={networkImages[currentNetwork]} 
                width={50} 
                height={50} 
                quality={100}
                alt={currentNetwork}
                className='md:h-12 md:w-12 h-10 w-10 rounded-md object-cover'
            />
            {/* <span className="text-sm font-semibold text-violet-600">{currentNetwork}</span> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-none border-none drop-shadow-md rounded-xl">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropDownNetworks.map((network, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => setCurrentNetwork(network.value as Networks)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                <Image
                  src={network.image}
                  width={30}
                  height={30}
                  quality={100}
                  alt={network.name}
                  className="h-8 w-8 rounded-md object-cover"
                />
                <span className="text-sm font-semibold">{network.name}</span>
              </div>
              {currentNetwork === network.value && (
                <DropdownMenuShortcut>
                  <LucideCheck className="text-green-600" />
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
