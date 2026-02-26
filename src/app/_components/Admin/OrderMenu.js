"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HutIcon from "@/app/_icons/HutIcon";
import SqrWhite from "@/app/_icons/sqrblack";
import CarWhiteIcon from "@/app/_icons/CarWhiteIcon";
import Sqr from "@/app/_icons/squer";
import CarBlack from "@/app/_icons/Car";
import OrderCN from "@/app/_icons/ordercn";
import OrderTableSkeleton from "../Skeleton/OrderTableSkeleton";
import Sidebar from "./SideBar";

export default function OrdersPage({ activeTab, setActiveTab }) {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive хийх
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setItemsPerPage(5); // Бага дэлгэцэд 5 захиалга
      } else {
        setItemsPerPage(10); // Том дэлгэцэд 10 захиалга
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "https://foodapp-back-1p78.onrender.com/api/orders",
      );
      const response = await res.json();
      // Backend returns { success: true, data: orders }
      setOrders(response.data || response || []);
    } catch (err) {
      console.error("Orders fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `https://foodapp-back-1p78.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus.toLowerCase() }),
        },
      );

      const response = await res.json();

      if (!res.ok) {
        console.error("Status update error:", response.message);
        return;
      }

      // Захиалгын жагсаалтыг шинэчлэх
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus.toLowerCase() }
            : order,
        ),
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Pagination логик
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div
      className={`mx-auto w-full bg-[#F4F4F5]  max-w-[1440px] px-4 md:px-8 ${isMobile ? "flex-col" : "flex gap-10 pr-10"}`}
    >
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Orders content */}
      <div
        className={`p-6 bg-[#F4F4F5] rounded-xl ${isMobile ? "w-full" : "w-[1171px]"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center border rounded-xl px-6 py-4 mb-6 bg-white">
          <div>
            <h1 className="text-xl font-semibold">Orders</h1>
            <p className="text-sm text-gray-500">{orders.length} items</p>
          </div>

          <div className="flex gap-3">
            <div className="border rounded-full px-4 py-2 text-sm">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="outline-none text-sm"
              />
            </div>
            <button className="bg-gray-200 text-gray-400 px-5 py-2 rounded-full text-sm">
              Change delivery state
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <OrderTableSkeleton rows={itemsPerPage} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                currentOrders.map((order, i) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{startIndex + i + 1}</td>
                    <td className="p-3">{order.user?.email || "N/A"}</td>

                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-600">
                          {order.foodOrderItems?.length || 0} items
                        </span>
                        {order.foodOrderItems &&
                          order.foodOrderItems.length > 0 && (
                            <div className="text-xs text-gray-500 max-w-[200px]">
                              {order.foodOrderItems
                                .slice(0, 2)
                                .map((item, idx) => {
                                  // Debug: console.log хийх (production-д арилгах)
                                  if (
                                    idx === 0 &&
                                    !item.food?.foodName &&
                                    !item.food?.name
                                  ) {
                                    console.log("Food item debug:", {
                                      item,
                                      food: item.food,
                                      foodType: typeof item.food,
                                      foodKeys: item.food
                                        ? Object.keys(item.food)
                                        : null,
                                    });
                                  }

                                  const foodName =
                                    item.food?.foodName ||
                                    item.food?.name ||
                                    (typeof item.food === "object" &&
                                    item.food !== null
                                      ? JSON.stringify(item.food).substring(
                                          0,
                                          30,
                                        )
                                      : null) ||
                                    (typeof item.food === "string"
                                      ? item.food
                                      : null) ||
                                    "Хоолны нэр олдсонгүй";
                                  return (
                                    <div key={idx} className="truncate">
                                      • {foodName}
                                    </div>
                                  );
                                })}
                              {order.foodOrderItems.length > 2 && (
                                <div className="text-gray-400">
                                  +{order.foodOrderItems.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </td>

                    <td className="p-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-3">${order.totalPrice || 0}</td>

                    <td className="p-3 text-xs text-gray-500 max-w-[220px] truncate">
                      {order.address ||
                        order.user?.address ||
                        "Хаяг оруулаагүй"}
                    </td>

                    <td className="p-3">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs border
                        ${
                          order.status === "pending"
                            ? "border-red-400 text-red-500"
                            : order.status === "delivered"
                              ? "border-green-400 text-green-600"
                              : order.status === "cancelled"
                                ? "border-gray-400 text-gray-600"
                                : "border-gray-400"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="on_the_way">On the way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === page
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Page info */}
        {!loading && orders.length > 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {startIndex + 1} to {Math.min(endIndex, orders.length)} of{" "}
            {orders.length} orders
          </div>
        )}
      </div>
    </div>
  );
}
