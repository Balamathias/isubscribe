import { Asterisk, GraduationCap, HandCoins, History, LayoutDashboardIcon, Lightbulb, MoreHorizontal, PhoneCall, Power, Printer, Settings, Tv, User, Wifi } from "lucide-react";

export const navLinks = [
    {
        href: "/dashboard",
        icon: LayoutDashboardIcon,
        tooltip: "Home",
      },
    {
        href: "/dashboard/subs"||"/dashboard/data" || "/dashboard/airtime" || "/dashboard/tv-cable" || "/dashboard/electricity" || "/dashboard/education" || "/dashboard/print-recharge-card" || "/dashboard/print-data-card",
        icon: HandCoins,
        tooltip: "Subs",
      },
    {
        href: "/dashboard/history",
        icon: History,
        tooltip: "History",
      },
    {
        href: "/dashboard/settings",
        icon: Settings,
        tooltip: "Settings",
      },
]




export const quickActionsLinks = [
    {
        href: "/dashboard/data",
        icon: Wifi,
        label: "Data",
      },
    {
        href: "/dashboard/airtime",
        icon: PhoneCall,
        label: "Airtime",
      },
    {
        href: "/dashboard/tv-cable",
        icon: Tv,
        label: "Tv Cable",
      },
    {
        href: "/dashboard/electricity",
        icon: Lightbulb,
        label: "Electricity",
      },
    {
        href: "/dashboard/education",
        icon: GraduationCap,
        label: "Education",
      },
    {
        href: "/dashboard/print-recharge-card",
        icon: Printer,
        label: "Print ",
      },
    {
        href: "/dashboard/print-data-card",
        icon: Asterisk,
        label: "Print",
      },
    {
        href: "/dashboard/subs",
        icon: MoreHorizontal,
        label: "More",
      },
]