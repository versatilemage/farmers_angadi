import logoImage from "@/utils/MediaUtils/Images/logo.png"
import Image from "next/image"

export const CommonApplicationLogo = () => {
    return (
        <Image src={logoImage} className="w-20 h-20 lg:w-28 lg:h-28" width={100} height={100} alt={"Logo"}/>
    )
}