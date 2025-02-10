import CommonNavBar from "@/components/Molecules/NavBar"

const PageWrapper = ({children}) => {
    return (
        <div className="flex flex-col relative">
            <CommonNavBar/>
            {children}
        </div>
    )
}

export default PageWrapper;
