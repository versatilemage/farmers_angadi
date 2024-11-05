"use client";
import AddProductForm from "@/components/Molecules/AddProduct";
import CommonNavBar from "@/components/Molecules/NavBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AddProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User is unauthenticated, redirecting to /authentication");
      router.push("/authentication");
    } else if (session && session.user.role !== "Producers") {
      console.log("User role is not Producers, redirecting to /");
      router.push("/");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  if (session && session.user.role === "Producers") {
    return (
      <div>
        <CommonNavBar />
        <AddProductForm /> {/* Producer content */}
      </div>
    );
  }

  return null;
}
