import Dashboard from '../../assets/images/grid-view.png'
import Product from '../../assets/images/product.png'
import Inventory from '../../assets/images/inventory.png'
import Member from '../../assets/images/members.png'
import Notification from '../../assets/images/notifications.png'
import Machine from '../../assets/images/machines.png'
import Report from '../../assets/images/report.png'
import Setting from '../../assets/images/setting.png'


const Sidebar = [
    {
        title: "Dashboard",
        href: "/",
        icon: Dashboard

    },
    {
        title: "Products",
        href: "/products",
        icon: Product,
        hasMenu: true,
        menuLinks: [
            {
                title: "Products",
                href: "/products",

            },
            // {
            //     title: "Variants",
            //     href: "/variants",

            // },
            {
                title: "Manufacturer",
                href: "/manufacturer",

            },
        ]
    },
    {
        title: "Inventory",
        href: "/inventory",
        icon: Inventory
    },
    {
        title: "Members",
        href: "/members",
        icon: Member
    },
    {
        title: "Notifications",
        href: "/notifications",
        icon: Notification
    },
    {
        title: "Machines",
        href: "/machines",
        icon: Machine
    },
    {
        title: "Reports",
        href: "/reports",
        icon: Report
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Setting
    }
]

export default Sidebar
