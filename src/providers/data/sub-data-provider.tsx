'use client'

import { Networks, SubDataProps } from "@/types/networks"
import React from "react"

interface SubDataProviderProps {
    children?: React.ReactNode,
}

const SubDatContext = React.createContext<{
    currentNetwork: Networks,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Networks>>,
    handleSubData?: (payload: SubDataProps) => void
}>({
    currentNetwork: 'mtn',
    setCurrentNetwork: () => {},
    handleSubData: () => {}
})

const SubDataProvider = ({ children }: SubDataProviderProps) => {
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')

    const handleSubData = async (payload: SubDataProps) => {
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
            handleSubData
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
