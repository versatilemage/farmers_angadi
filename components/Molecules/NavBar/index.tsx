"use client";

import { IUsersDocument } from "@/models/user";
import { navOptions } from "@/utils/NavConstants";
import { CommonApplicationLogo } from "../../Atoms/LogoImage";
import SearchedDataListed from "@/components/Molecules/Searched";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/Wrapper/universalState";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import axios from "axios";

import { CircleUser, ShoppingBasket, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Atoms/UI/sheet";

const CommonNavBar = () => {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const router = useRouter();
  const { selectedUserData } = useAuth() as {
    selectedUserData: IUsersDocument;
  };
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowAddressDropdown(false); // Close dropdown if clicking outside
    }
  };

  useEffect(() => {
    if (showAddressDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showAddressDropdown]);

  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductname] = useState("");
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const { selectedAddress, setSelectedAddress } = useAuth();

  const isAuthenticationPage = pathname === "/authentication";
  const clearSearchText = () => setProductname("");

  const isUserAuthenticated = useMemo(
    () => !!selectedUserData?.email,
    [selectedUserData]
  );
  const userRole = useMemo(() => selectedUserData?.role, [selectedUserData]);

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchUserAddresses();
    }
  }, [isUserAuthenticated]);

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(
        `/api/useraddress?userId=${selectedUserData.id}`
      );
      const addresses = response.data;

      if (addresses.length) {
        // Find the default address
        const defaultAddress = addresses.find((address) => address.default);
        setSelectedAddress(defaultAddress || addresses[0]); // Fallback to the first address if no default
        setUserAddresses(addresses);
      } else {
        setUserAddresses([]);
        setSelectedAddress(null); // Clear selected address if no addresses exist
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
    setShowAddressDropdown(false);
  };

  const modifiedNavOption = navOptions.map((ele) => {
    if (ele.name === "Admin") {
      return { ...ele, show: userRole === "admin" };
    } else {
      return { ...ele };
    }
  });

  const modifiedNavOptions = modifiedNavOption.filter((i) => i.show === true);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg transition-all duration-300 ease-in-out backdrop-blur-md">
      <div className="flex flex-row items-center justify-start lg:justify-between gap-6 w-full max-w-[1280px] mx-auto px-2 py-0 lg:p-0">
        {/* Mobile Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Menu
              className="block lg:hidden text-white w-8 h-8"
              onClick={() => setIsOpen(!isOpen)}
            />
          </SheetTrigger>
          <SheetContent className="bg-gray-600">
            <div className="relative" ref={dropdownRef}>
              {isUserAuthenticated && (
                <div
                  className="flex items-center gap-4 w-[14rem] py-2 px-3 bg-green-900 text-white rounded-md cursor-pointer"
                  onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                >
                  <svg
                    width="2rem"
                    height="2rem"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a5 5 0 0 0-5 5c0 5 5 11 5 11s5-6 5-11a5 5 0 0 0-5-5m0 8a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                  </svg>
                  <div className="truncate-2-lines">
                    {selectedAddress
                      ? `${selectedAddress?.doorNumber}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.pinNumber}`
                      : "Select Location"}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="white"
                    className={`transform transition-transform ${
                      showAddressDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path d="M12 16.59l-4.29-4.3a1 1 0 0 1 1.42-1.42L12 13.76l3.88-3.88a1 1 0 0 1 1.42 1.42l-4.3 4.29a1 1 0 0 1-1.42 0z" />
                  </svg>
                </div>
              )}

              {showAddressDropdown && (
                <div className="absolute top-16 -left-10 w-[20rem] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Saved Addresses
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                    {userAddresses.map((address, index) => (
                      <div
                        key={index}
                        className={`px-4 py-3 flex flex-col gap-1 cursor-pointer transition-colors ${
                          selectedAddress?._id === address._id
                            ? "bg-green-50 border-l-4 border-green-500"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleSelectAddress(address)}
                      >
                        <span className="text-sm font-semibold text-gray-700">
                          {address.doorNumber}, {address.street}
                        </span>
                        <span className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pinNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="px-4 py-3 text-center text-blue-600 font-medium hover:bg-gray-100 cursor-pointer rounded-b-lg"
                    onClick={() => router.push("/address/add")}
                  >
                    Add New Address
                  </div>
                </div>
              )}
            </div>
            <ul className="flex flex-col items-start gap-4 w-full">
              {modifiedNavOptions.map((i) => (
                <li key={i.name} className="flex items-center gap-3">
                  {i.icon()}
                  <Link
                    href={i.link}
                    className="text-lg text-white hover:text-secondary"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/cart"
                  className="text-lg text-white hover:text-secondary flex items-center gap-3"
                >
                  <svg
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 24 24"
                    className="bg-secondary rounded-full w-10 h-10 p-2.5 hover:bg-tertiary"
                  >
                    <ShoppingBasket className="text-white w-10 h-10" />
                  </svg>
                  Cart
                </Link>
              </li>
              {isUserAuthenticated ? (
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg text-white hover:text-secondary"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/authentication?page=signin"
                    className="text-lg text-white hover:text-secondary"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </SheetContent>
        </Sheet>
        <span className="">
          <CommonApplicationLogo />
        </span>
        <div className="flex lg:hidden gap-3 items-center">
          <div className="flex relative">
            <input
              className="w-full h-[2.5em] px-4 rounded-3xl border-2 border-gray-300 focus:border-blue-400 outline-none"
              type="text"
              placeholder="Search Products..."
              value={productName}
              onChange={(e) => setProductname(e.target.value)}
            />
            <button className="absolute right-0 h-[2.5em] px-2">
              {!productName.length ? (
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="green"
                  className="text-slate-500"
                >
                  <g>
                    <path
                      fillRule="evenodd"
                      d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14"
                    />
                    <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                  </g>
                </svg>
              ) : (
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="red"
                  className="cursor-pointer"
                  onClick={clearSearchText}
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </button>
          </div>
          <CircleUser className="text-white w-10 h-10" />
          <ShoppingBasket className="text-white w-10 h-10" />
        </div>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row items-center justify-between w-full gap-8">
          {!isAuthenticationPage && (
            <div className="relative w-[16em]">
              <input
                className="h-[2.5em] px-2 rounded-3xl border-2 border-gray-300 focus:border-blue-400 outline-none"
                type="text"
                placeholder="Search Products..."
                value={productName}
                onChange={(e) => setProductname(e.target.value)}
              />
              <button className="absolute right-0 h-[2.5em] px-2">
                {!productName.length ? (
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="green"
                    className="text-slate-500"
                  >
                    <g>
                      <path
                        fillRule="evenodd"
                        d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14"
                      />
                      <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
                    </g>
                  </svg>
                ) : (
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="cursor-pointer"
                    onClick={clearSearchText}
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Location Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isUserAuthenticated && (
              <div
                className="flex items-center gap-4 w-[14rem] py-2 px-3 bg-green-900 text-white rounded-md cursor-pointer"
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              >
                <svg
                  width="2rem"
                  height="2rem"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0a5 5 0 0 0-5 5c0 5 5 11 5 11s5-6 5-11a5 5 0 0 0-5-5m0 8a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                </svg>
                <div className="truncate-2-lines">
                  {selectedAddress
                    ? `${selectedAddress?.doorNumber}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.pinNumber}`
                    : "Select Location"}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.25rem"
                  height="1.25rem"
                  viewBox="0 0 24 24"
                  fill="white"
                  className={`transform transition-transform ${
                    showAddressDropdown ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <path d="M12 16.59l-4.29-4.3a1 1 0 0 1 1.42-1.42L12 13.76l3.88-3.88a1 1 0 0 1 1.42 1.42l-4.3 4.29a1 1 0 0 1-1.42 0z" />
                </svg>
              </div>
            )}

            {showAddressDropdown && (
              <div className="absolute top-16 left-0 w-[20rem] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 bg-gray-50 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Saved Addresses
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                  {userAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 flex flex-col gap-1 cursor-pointer transition-colors ${
                        selectedAddress?._id === address._id
                          ? "bg-green-50 border-l-4 border-green-500"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {address.doorNumber}, {address.street}
                      </span>
                      <span className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pinNumber}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="px-4 py-3 text-center text-blue-600 font-medium hover:bg-gray-100 cursor-pointer rounded-b-lg"
                  onClick={() => router.push("/address/add")}
                >
                  Add New Address
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-row items-center gap-8 w-full justify-evenly">
            {modifiedNavOptions.map((i) => (
              <li key={i.name}>
                <Link
                  className={`text-lg text-white hover:text-secondary ${
                    pathname === i.link ? "text-secondary" : "text-white"
                  }`}
                  href={i.link}
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* User Options */}
          <ul className="flex flex-row items-center gap-8">
            <li>
              <Link href="/cart">
                <svg
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                  className="bg-secondary rounded-full w-10 h-10 p-2 hover:bg-tertiary hover:text-primary"
                >
                  <ShoppingBasket className="w-10 h-10" />
                </svg>
              </Link>
            </li>
            {isUserAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg text-white hover:text-secondary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/authentication?page=signin"
                  className="text-lg text-white hover:text-secondary"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {productName.length > 0 && (
        <SearchedDataListed
          productName={productName}
          setProductname={clearSearchText}
        />
      )}
    </nav>
  );
};

export default CommonNavBar;
