import { Home, Package, Leaf, Contact, Shield } from "lucide-react";

export const navOptions = [
    {
        name: "Home",
        show: true,
        link: "/",
        icon: () => (
            <button className="text-lg text-white hover:text-secondary">
                <Home className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary" />
            </button>
        ),
    },
    
    {
        name: "Products",
        show: true,
        link: "/products",
        icon: () => (
            <button className="text-lg text-white hover:text-secondary">
                <Package className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary" />
            </button>
        ),
    },
    {
        name: "About Us",
        show: true,
        link: "/about",
        icon: () => (
            <button className="text-lg text-white hover:text-secondary">
                <Leaf className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary" />
            </button>
        ),
    },
    {
        name: "Contact Us",
        show: true,
        link: "/contact",
        icon: () => (
            <button className="text-lg text-white hover:text-secondary">
                <Contact className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary" />
            </button>
        ),
    },
    {
        name: "Admin",
        show: false,
        link: "/admin/dashboard",
        icon: () => (
            <button className="text-lg text-white hover:text-secondary">
                <Shield className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary" />
            </button>
        ),
    }
];
