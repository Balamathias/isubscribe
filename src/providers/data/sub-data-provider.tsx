'use client'

import { Networks } from "@/types/networks"
import React from "react"

interface SubDataProviderProps {
    children?: React.ReactNode,
}

const SubDatContext = React.createContext<{
    currentNetwork: Networks,
    setCurrentNetwork: React.Dispatch<React.SetStateAction<Networks>>,
}>({
    currentNetwork: 'mtn',
    setCurrentNetwork: () => {},
})

const SubDataProvider = ({ children }: SubDataProviderProps) => {
    const [currentNetwork, setCurrentNetwork] = React.useState<Networks>('mtn')
    return (
        <SubDatContext.Provider value={{
            currentNetwork,
            setCurrentNetwork
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
