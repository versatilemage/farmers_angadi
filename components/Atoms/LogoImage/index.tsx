import logoImage from "@/utils/MediaUtils/Images/bg-removed-lettermark-logo.png"
import Image from "next/image"

export const CommonApplicationLogo = () => {
    return (
        <Image src={logoImage} className="w-20 h-20 lg:w-32 lg:h-32" width={120} height={120} alt={"Logo"}/>
    )
}