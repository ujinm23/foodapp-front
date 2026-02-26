"use client";

import { useRouter } from "next/navigation";
import HutIcon from "@/app/_icons/HutIcon";
import CompanyNew from "@/app/_icons/CompanyNew";
import Sqr from "@/app/_icons/squer";
import SqrWhite from "@/app/_icons/sqrblack";
import CarBlack from "@/app/_icons/Car";
import CarWhiteIcon from "@/app/_icons/CarWhiteIcon";

export default function Sidebar({ activeTab, setActiveTab }) {
  const router = useRouter();

  return (
    <div className="w-[205px] p-9 bg-white flex justify-center">
      <div>
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10">
            <HutIcon />
          </div>
          <div className="w-[81px] h-7">
            <CompanyNew />
            <p className="text-xs text-gray-500">Swift delivery</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("FoodMenu")}
          className={`w-[165px] h-10 mt-10  rounded-full flex gap-2 justify-center items-center ${
            activeTab === "FoodMenu" ? "bg-black text-white" : ""
          }`}
        >
          {activeTab === "FoodMenu" ? <Sqr /> : <SqrWhite />}
          Food Menu
        </button>

        <button
          onClick={() => setActiveTab("OrderMenu")}
          className={`w-[165px] h-10 mt-4 rounded-full flex gap-2 justify-center items-center ${
            activeTab === "OrderMenu" ? "bg-black text-white" : "bg-white"
          }`}
        >
          {activeTab === "OrderMenu" ? <CarWhiteIcon /> : <CarBlack />}
          Orders
        </button>
      </div>
    </div>
  );
}
