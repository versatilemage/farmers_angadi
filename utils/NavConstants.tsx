export const navOptions = [
    {
        name: "Home",
        show: true,
        link: "/",
        icon: (classname) => (
            <svg
                className={classname}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        ),
    },
    
    {
        name: "Product",
        show: true,
        link: "/products",
        icon: (classname) => (
            <svg
                className={classname}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M5 20h14v-2H5v2zM17 4h-2.4L9 9.6V16h2v-5h2.5L19 7.5V4z" />
            </svg>
        ),
    },
    {
        name: "About",
        show: true,
        link: "/about",
        icon: (classname) => (
            <svg
                className={classname}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M5 20h14v-2H5v2zM17 4h-2.4L9 9.6V16h2v-5h2.5L19 7.5V4z" />
            </svg>
        ),
    },
    {
        name: "Contact",
        show: true,
        link: "/contact",
        icon: (classname) => (
            <svg
                className={classname}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M21 8V7l-3 2-2-2-4 4 1 1h4l3-4zm-7 11H5V7h5V5H5V4h14v2h-4v1l3 2v10h-4v-2h-2v2zm-5-1v-1H8v1h1zm2-3v-1H8v1h3zm3-3V9h-5v3h5z" />
            </svg>
        ),
    },
    {
        name: "Admin",
        show: false,
        link: "/admin/dashboard",
        icon: (classname) => (
            <svg
                className={classname}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M21 8V7l-3 2-2-2-4 4 1 1h4l3-4zm-7 11H5V7h5V5H5V4h14v2h-4v1l3 2v10h-4v-2h-2v2zm-5-1v-1H8v1h1zm2-3v-1H8v1h3zm3-3V9h-5v3h5z" />
            </svg>
        ),
    }
];
