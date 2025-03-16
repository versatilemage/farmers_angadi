"use client";

import { userRoleDetails } from "@/utils/rolecard";
import Link from "next/link";
import { useAuth } from "@/components/Wrapper/universalState";
import { memo } from "react";

// Memoized UserRoleCard to prevent unnecessary re-renders
const UserRoleCard = memo(() => {
  const { selectedUserData } = useAuth();

  const role = (selectedUserData?.role === "admin" ? "Producers": selectedUserData?.role) || "Consumers"

  const handleRoleCardArr = userRoleDetails.filter((ele) => ele.role === role);

  return (
    <section className="flex xl:flex-row flex-col w-full max-w-[1280px] items-center justify-center gap-12">
      {handleRoleCardArr.map((roleInfo) => {
        const { description, secondaryText, actionText, role, defaultLink } = roleInfo;

        // If the user is an Admin, show both Producers and Consumers cards
        const showAdminCards = selectedUserData?.role === "admin";
        const isUserRole = selectedUserData?.role === role;

        return showAdminCards || isUserRole ? (
          <div
            className={`${
              role === "Producers" ? "bg-sellersbg" : "bg-buyersbg"
            } bg-no-repeat bg-center bg-cover md:p-20 p-10 w-[90%] sm:w-1/2 h-72 rounded-lg gap-1 flex flex-col cursor-pointer items-center sm:items-start transition hover:contrast-75 contrast-100`}
            key={role}
          >
            <h1 className="text-4xl md:text-5xl text-tertiary font-bold md:text-start text-center">{role}</h1>
            <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">
              {description}
            </p>
            <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">
              {secondaryText}
            </p>
            <Link
              href={role === "Producers" ? "/producers/AddProduct" : "/products"}
              className="bg-secondary text-tertiary w-fit p-3 rounded-sm duration-300 hover:bg-tertiary hover:text-secondary ease-in"
            >
              {role === "Producers" ? "Add Products" : "Shop now"}
            </Link>
          </div>
        ) : (
          // Render the default card if no role is set (initial state)
          !selectedUserData?.role && (
            <div
              className={`${
                role === "Producers" ? "bg-sellersbg" : "bg-buyersbg"
              } bg-no-repeat bg-center bg-cover md:p-20 p-10 w-[90%] sm:w-1/2 h-72 rounded-lg gap-1 flex flex-col cursor-pointer items-center sm:items-start transition hover:contrast-75 contrast-100`}
              key={role}
            >
              <h1 className="text-4xl md:text-5xl text-tertiary font-bold md:text-start text-center">{role}</h1>
              <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">
                {description}
              </p>
              <p className="text-tertiary font-lightbold text-sm sm:text-lg font-semibold sm:font-normal md:text-start text-center">
                {secondaryText}
              </p>
              <Link
                href={defaultLink}
                className="bg-secondary text-tertiary w-fit p-3 rounded-sm duration-300 hover:bg-tertiary hover:text-secondary ease-in"
              >
                {actionText}
              </Link>
            </div>
          )
        );
      })}
    </section>
  );
});

export default UserRoleCard;
