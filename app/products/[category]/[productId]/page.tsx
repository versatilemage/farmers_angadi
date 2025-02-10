import IndividualProductView from "@/components/Molecules/individualCard";
// import CommonNavBar from "@/components/Molecules/NavBar";

export default function IndividualProductdataPage ({params}: {
    params: {productId: string, category: string} }){
        return (
            <>
            {/* <CommonNavBar /> */}
            <IndividualProductView params={params}/>
            </>
        )
}