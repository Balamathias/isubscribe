import { Coins, HelpCircle, LayoutDashboard, LucideIcon, RefreshCwIcon, Settings } from "lucide-react"

export interface SubLinkProps {
    title: string,
    href: string
}

export interface LinksProps {
    icon: LucideIcon,
    title: string,
    href: string,
    subLinks?: SubLinkProps[]
}

export const sidebarLinks: LinksProps[] = [
    {
        href: '/dashboard',
        icon: LayoutDashboard,
        title: 'Dashboard',
    },
    {
        href: '/dashboard/services',
        icon: RefreshCwIcon,
        title: 'Services',
        subLinks: [
            {
                href: '/dashboard/services/airtime',
                title: 'Airtime',
            },
            {
                href: '/dashboard/services/data',
                title: 'Data',
            },
            {
                href: '/dashboard/services/electricity',
                title: 'Electricity',
            },
            {
                href: '/dashboard/services/gift-data',
                title: 'Gift Data',
            },
            {
                href: '/dashboard/services/gift-airtime',
                title: 'Gift Airtime',
            },
        ]
    },
    {
        href: '/dashboard/transactions',
        icon: Coins,
        title: 'Transactions',
        subLinks: [
            {
                href: '/dashboard/transactions/history',
                title: 'History',
            },
            {
                href: '/dashboard/transactions/purchases',
                title: 'Purchases',
            },
            {
                href: '/dashboard/transactions/status',
                title: 'Status',
            },
        ]
    },
    {
        href: '/dashboard/settings',
        icon: Settings,
        title: 'Settings',
        subLinks: [
            {
                href: '/dashboard/settings/general',
                title: 'General',
            },
            {
                href: '/dashboard/settings/account',
                title: 'Account',
            },
            {
                href: '/dashboard/settings/apperance',
                title: 'Appearance',
            },
        ]
    },
    {
        href: '/dashboard/help',
        icon: HelpCircle,
        title: 'Help',
        subLinks: [
            {
                href: '/dashboard/help/tutorial',
                title: 'Tutorial',
            },
            {
                href: '/dashboard/help/support',
                title: 'Support',
            },
            {
                href: '/dashboard/help/faqs',
                title: 'FAQs',
            },
        ]
    },
]

export const mobileLinks = [
    {
        href: '/dashboard',
        imgURL: '/images/home.png',
        title: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/dashboard/services',
        imgURL: '/images/vehicle.png',
        title: 'Services',
        icon: RefreshCwIcon,
    },
    // {
    //     href: '/dashboard/transactions',
    //     imgURL: '/images/transactions.png',
    //     title: 'Transactions',
    //      icon: Coins,
    // },
    {
        href: '/dashboard/settings',
        imgURL: '/images/settings.png',
        title: 'Settings',
        icon: Settings,
    },
    // {
    //     href: '/dashboard/help',
    //     imgURL: '/images/help.png',
    //     title: 'Help',
    //     icon: HelpCircle,
    // },
]