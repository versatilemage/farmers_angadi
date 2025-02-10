"use client";

import { useEffect } from "react";
import { useAuth } from "../universalState";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export const AuthWrapper = ({ children }) => {
  const { setSelectedUserdata, setLoading, loading } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const publicPages = [
    "/",
    "/about",
    "/products",
    "/contact",
    "/authentication",
    "/forgot-password",
    "/reset-password",
    "/privacypolicy",
  ];
  const afterAuthRestrictedPages = ["/authentication"];
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    if (status === "unauthenticated" && !publicPages.includes(pathname)) {
      router.replace("/");
    } else if (session) {
      if (afterAuthRestrictedPages.includes(pathname)) {
        router.replace("/");
      }
      setSelectedUserdata(session.user);
    }
    setLoading(false);
  }, [session, status, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return <>{children}</>;
};
