import { Book, Clock, Gift, GraduationCap, HomeIcon, Lightbulb, MoreHorizontal, Pen, PhoneCall, Settings2, Tv, Wifi } from "lucide-react";

export const navLinks = [
    {
        href: "/dashboard",
        icon: HomeIcon,
        tooltip: "Home",
      },
    {
        href: "/dashboard/subs"||"/dashboard/data" || "/dashboard/airtime" || "/dashboard/tv-cable" || "/dashboard/electricity" || "/dashboard/education" || "/dashboard/print-recharge-card" || "/dashboard/print-data-card",
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
        href: "/dashboard/education?type=waec",
        icon: GraduationCap,
        label: "WAEC Pin",
      },
    {
        href: "/dashboard/education?type=gce",
        icon: Pen,
        label: "GCE Pin ",
      },
    {
        href: "/dashboard/education?type=jamb",
        icon: Book,
        label: "JAMB Pin",
      },
    {
        href: "/dashboard/subs",
        icon: MoreHorizontal,
        label: "More",
      },
]