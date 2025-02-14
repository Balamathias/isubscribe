import { Book, Clock, Gift, GraduationCap, HomeIcon, Lightbulb, LucideArrowUpDown, MoreHorizontal, Pen, PhoneCall, Settings2, Tv, Wifi } from "lucide-react";

export const navLinks = [
    {
        href: "/dashboard",
        icon: HomeIcon,
        tooltip: "Home",
      },
    {
        href: "/dashboard/subs",
        icon: Gift,
        tooltip: "Subs",
      },
    {
        href: "/dashboard/history",
        icon: Clock,
        tooltip: "History",
      },
    {
        href: "/dashboard/settings",
        icon: Settings2,
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
          href: "/dashboard/electricity",
          icon: Lightbulb,
          label: "Electricity",
        },
    {
        href: "/dashboard/tv-cable",
        icon: Tv,
        label: "Tv Cable",
      },
    {
        href: "/dashboard/education?type=waec",
        icon: GraduationCap,
        label: "Education",
      },
    {
        href: "/dashboard/transfer",
        icon: LucideArrowUpDown,
        label: "Transfer",
      },
    {
        href: "/dashboard/share",
        icon: Gift,
        label: "Share & Earn",
      },
    {
        href: "/dashboard/subs",
        icon: MoreHorizontal,
        label: "More",
      },
]