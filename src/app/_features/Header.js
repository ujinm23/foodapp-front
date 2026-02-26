"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CompanyName from "../_icons/CompanyName";
import HutIcon from "../_icons/HutIcon";
import Navigation from "../_icons/Navi";
import Purchase from "../_icons/Purchase";
import Right from "../_icons/Right";
import { UserIcon } from "../_icons/UserIcon";
import { useAuth } from "@/contexts/AuthContext";

export default function Header({ openCart }) {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Dropdown-ийг гадна дарахад хаах
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push("/");
  };

  const handleLogin = () => {
    setShowDropdown(false);
    router.push("/login");
  };

  const handleSignUp = () => {
    setShowDropdown(false);
    router.push("/sign-up");
  };

  const handleAdminPanel = () => {
    setShowDropdown(false);
    router.push("/admin");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="w-auto h-17  bg-[#18181B]  flex justify-between px-22 items-center">
      <div className="w-full h-full flex justify-between items-center">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <HutIcon />

          <div>
            <CompanyName />
            <p className="text-white text-[12px]">Swift delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-[12.81px]">
          <div className="w-[251px] h-9 rounded-full bg-[#FFFFFF] flex items-center justify-center  gap-1">
            <Navigation />
            <p className="text-[#EF4444] text-xs font-normal">
              Delivery address:
            </p>
            <p className="text-xs font-normal text-[#71717A] ml-1">
              Add Location
            </p>
            <Right className="ml-2" />
          </div>

          <div
            onClick={openCart}
            className="rounded-[50px] bg-white w-9 h-9 flex items-center justify-center cursor-pointer"
          >
            <Purchase />
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="rounded-[50px] bg-[#EF4444] w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#dc2626] transition-colors"
            >
              <UserIcon />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName || user.email || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      {isAdmin() && (
                        <button
                          onClick={handleAdminPanel}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-200"
                        >
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
