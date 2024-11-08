"use client"
import CommonNavBar from "@/components/Molecules/NavBar"
import AuthenticationComponent from "@/components/Organelles/Authentication"
import { useAuth } from "@/components/Wrapper/universalState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticationLoginPage () {
    const router = useRouter();
  const { selectedUserData } = useAuth();
  useEffect(() => {
    if (selectedUserData?.email) {
      router.push("/");
    }
  }, [selectedUserData, router]);


    return (
        <>
        <CommonNavBar />
            <AuthenticationComponent/>
        </>
    )
}