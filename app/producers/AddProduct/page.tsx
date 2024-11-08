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
    } else if (session && session.user.role !== "Producers" && session.user.role !== "admin") {
      console.log("User role is not Producers or Admin, redirecting to /");
      router.push("/");
    }
  }, [status, router, session, session?.user?.role]);

  if (status === "loading") {
    return <div>Loading...</div>; // Optional loading state
  }

  // Allow access to users with "Producers" or "Admin" roles
  if (session && (session.user.role === "Producers" || session.user.role === "admin")) {
    return (
      <div>
        <CommonNavBar />
        <AddProductForm /> {/* Producer/Admin content */}
      </div>
    );
  }

  return null;
}
