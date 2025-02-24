import CommonNavBar from "@/components/Molecules/NavBar";
import Footer from "../Molecules/Footer";

const PageWrapper = ({children}) => {
    return (
        <div className="flex flex-col relative">
            <CommonNavBar/>
            {children}
            <Footer />
        </div>
    )
}

export default PageWrapper;
