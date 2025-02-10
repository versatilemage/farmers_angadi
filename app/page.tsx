"use client"
// import CommonNavBar from "@/components/Molecules/NavBar"
import LandingHomePage from "@/components/Organelles/Home"
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();

  // Determine if the current route is an admin route
  const isAdminPage = pathname.startsWith('/admin');
  return (
    <>
                  {/* {!isAdminPage&&<CommonNavBar/>} */}
                  <LandingHomePage/>
    </>
  )
}
