'use client'

import { Networks, PaymentMethod, SubDataProps } from "@/types/networks"
import React from "react"

interface SubDataProviderProps {
    children?: React.ReactNode,
}

const SubDatContext = React.createContext<{
    currentNetwork: Networks,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Networks>>,
    handleSubData?: (payload: SubDataProps) => void,
    mobileNumber: string,
    setMobileNumber: React.Dispatch<React.SetStateAction<string>>
}>({
    currentNetwork: 'mtn',
    setCurrentNetwork: () => {},
    handleSubData: () => {},
    mobileNumber: '',
    setMobileNumber: () => {}
})

const SubDataProvider = ({ children }: SubDataProviderProps) => {
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')
    const [mobileNumber, setMobileNumber] = React.useState<string>('' as string)

    const handleSubData = async (payload: SubDataProps & { method?: PaymentMethod }) => {
        try {
            console.log(payload)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <SubDatContext.Provider value={{
            currentNetwork,
            setCurrentNetwork,
            handleSubData,
            mobileNumber,
            setMobileNumber
        }}>
            { children }
        </SubDatContext.Provider>
    )
}

export const useNetwork = () => {
    if (!React.useContext(SubDatContext)) throw new Error('useNetwork must be used within a SubDataProvider')

    return React.useContext(SubDatContext)
}

export default SubDataProvider
