import { Networks, PaymentMethod, SubAirtimeProps, SubDataProps } from "@/types/networks";
import { create } from "zustand";

interface SubStoreProps {
  currentNetwork: Networks,
  sectCurrentNetwork: (network: Networks) => void
  mobileNumber: string,
  setMobileNumber: (number: string) => void,
  pinPasses: boolean,
  setPinPasses: (passes: boolean) => void,
  handleSubData: (payload: SubDataProps & { method?: PaymentMethod}) => void,
  handleSubAirtime: (payload: SubAirtimeProps & { method: PaymentMethod }) => void,
  fundSufficient: boolean,
  setFundSufficient: (sufficient: boolean) => void,
  purchasing: boolean,
  setPurchasing: (purchasing: boolean) => void,
  openConfirmPurchaseModal: boolean,
  setOpenConfirmPurchaseModal: (open: boolean) => void,
}

export const useSubStore = create<SubStoreProps>((set) => ({
  currentNetwork: 'mtn',
  sectCurrentNetwork: (network: Networks) => set({ currentNetwork: network }),
  mobileNumber: '',
  setMobileNumber: (number: string) => set({ mobileNumber: number }),
  pinPasses: false,
  setPinPasses: (passes: boolean) => set({ pinPasses: passes }),
  handleSubData: () => {},
  handleSubAirtime: () => {},
  fundSufficient: false,
  setFundSufficient: (sufficient: boolean) => set({ fundSufficient: sufficient }),
  purchasing: false,
  setPurchasing: (purchasing: boolean) => set({ purchasing: purchasing }),
  openConfirmPurchaseModal: false,
  setOpenConfirmPurchaseModal: (open: boolean) => set({ openConfirmPurchaseModal: open }),
}))