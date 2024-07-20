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
import { CaretDownIcon } from "@radix-ui/react-icons"
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
      <DropdownMenuTrigger asChild className="flex flex-row items-start w-fit gap-y-1 cursor-pointer dark:bg-transparent">
        <div className="flex flex-row dark:bg-transparent cursor-pointer hover:opacity-80 items-center">
            <Image 
                src={networkImages[currentNetwork]} 
                width={50} 
                height={50} 
                quality={100}
                alt={currentNetwork}
                className='w-12 h-12 rounded-full object-cover'
            />
            <CaretDownIcon className="text-primary h-10 w-10" />
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
