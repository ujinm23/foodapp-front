"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/app/_icons/Avatar";
import CarBlack from "@/app/_icons/Car";
import CompanyNew from "@/app/_icons/CompanyNew";
import HutIcon from "@/app/_icons/HutIcon";
import Plus from "@/app/_icons/Plus";
import Sqr from "@/app/_icons/squer";
import DishModal from "../dishmodal/DishModal";
import InfoIconPencil from "@/app/_icons/InfoIcon";
import EditDishModal from "../dishmodal/EdithDishModel";
import axios from "axios";
import toast from "react-hot-toast";
import SqrWhite from "@/app/_icons/sqrblack";
import CarWhiteIcon from "@/app/_icons/CarWhiteIcon";
import OrdersPage from "./OrderMenu";

export default function Order() {
  const router = useRouter();
  const [showDishModal, setShowDishModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [showAllDishes, setShowAllDishes] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [activeTab, setActiveTab] = useState("FoodMenu");
  const [newCategories, setNewCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Responsive хийх - hydration алдааг засах
  useEffect(() => {
    setMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(
          "https://foodapp-back-1p78.onrender.com/api/categories",
        );
        setNewCategories(res.data);
      } catch (err) {
        console.log("Error loading categories:", err);
      }
    };
    getCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await axios.post(
      "https://foodapp-back-1p78.onrender.com/api/categories",
      {
        categoryName: newCategory.trim(),
      },
    );

    const createdCategory = res.data.data;

    setNewCategories([...newCategories, createdCategory]);
    setNewCategory("");
    setShowCategoryModal(false);

    toast.success("New Category is being added to the menu", {
      duration: 2500,
      style: {
        background: "#111",
        color: "#fff",
      },
    });
  };

  const handleDeleteCategory = async (index) => {
    const categoryId = newCategories[index]._id;
    try {
      await axios.delete(
        `https://foodapp-back-1p78.onrender.com/api/categories/${categoryId}`,
      );
      setNewCategories(newCategories.filter((_, i) => i !== index));
      if (activeCategoryIndex === index) setActiveCategoryIndex(null);
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err);
    }
  };

  const handleAddDish = async (newDish) => {
    if (activeCategoryIndex === null) {
      toast.error("Please select a category first", {
        duration: 2000,
        style: {
          background: "#111",
          color: "#fff",
        },
      });
      return;
    }

    try {
      const categoryId = newCategories[activeCategoryIndex]._id;

      if (!categoryId) {
        toast.error("Category not found", {
          duration: 2000,
          style: {
            background: "#111",
            color: "#fff",
          },
        });
        return;
      }

      const dishRes = await axios.post(
        "https://foodapp-back-1p78.onrender.com/api/foods",
        {
          foodName: newDish.name,
          price: newDish.price,
          ingredients: newDish.ingredients,
          image: newDish.image,
          category: categoryId,
        },
      );

      const createdDish = dishRes.data.data;
      const updated = [...newCategories];
      updated[activeCategoryIndex].dishes = [
        ...(updated[activeCategoryIndex].dishes || []),
        createdDish,
      ];

      setNewCategories(updated);
      setShowDishModal(false);

      toast.success("New dish is being added to menu", {
        duration: 2500,
        style: {
          background: "#111",
          color: "#fff",
        },
      });
    } catch (err) {
      console.log("Dish add error:", err.response?.data || err);

      toast.error("Failed to add dish!");
    }
  };

  const handleDeleteDish = async (catIndex, dishIndex) => {
    try {
      const dishId = newCategories[catIndex].dishes[dishIndex]._id;
      const dishName = newCategories[catIndex].dishes[dishIndex].foodName;

      await axios.delete(
        `https://foodapp-back-1p78.onrender.com/api/foods/${dishId}`,
      );

      const updated = [...newCategories];
      updated[catIndex].dishes = updated[catIndex].dishes.filter(
        (_, i) => i !== dishIndex,
      );

      setNewCategories(updated);

      toast.success(`"${dishName}" deleted successfully`, {
        duration: 2000,
        style: {
          background: "#111",
          color: "#fff",
        },
      });
    } catch (err) {
      console.log("DELETE dish ERROR:", err.response?.data || err);
      toast.error("Failed to delete dish", {
        duration: 2000,
        style: {
          background: "#111",
          color: "#fff",
        },
      });
    }
  };

  return (
    <>
      {activeTab === "FoodMenu" && (
        <>
          {showEditModal && selectedDish && (
            <EditDishModal
              onClose={() => setShowEditModal(false)}
              dish={selectedDish}
              categories={newCategories}
              onSave={(updatedDish) => {
                const updated = [...newCategories];
                updated[updatedDish.catIndex].dishes[updatedDish.dishIndex] =
                  updatedDish;
                setNewCategories(updated);
                setShowEditModal(false);
              }}
              onDeleteDish={handleDeleteDish}
            />
          )}

          {showCategoryModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto">
              <div
                className={`bg-white p-6 rounded-xl ${isMobile ? "w-[90%] max-w-[400px] m-4" : "w-[400px]"} relative`}
              >
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="absolute top-3 right-4 cursor-pointer"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">Add new category</h2>

                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border w-full rounded-lg p-3 text-sm"
                  placeholder="Category name..."
                />

                <button
                  onClick={handleAddCategory}
                  className="w-full bg-black text-white rounded-lg p-3 mt-5"
                >
                  Add Category
                </button>
              </div>
            </div>
          )}

          {showDishModal && activeCategoryIndex !== null && (
            <DishModal
              onClose={() => setShowDishModal(false)}
              onAddDish={handleAddDish}
              categoryName={
                newCategories[activeCategoryIndex]?.categoryName || "Category"
              }
            />
          )}

          <div
            className={`mx-auto w-full max-w-[1440px] px-4 md:px-8 ${isMobile ? "flex-col h-screen flex" : "flex gap-10 pr-10"}`}
          >
            <div
              className={`${isMobile ? "w-full p-4 flex-shrink-0 bg-white border-b" : "w-[205px] p-9"}`}
            >
              <div
                onClick={() => router.push("/")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <HutIcon />
                <div>
                  <CompanyNew />
                  <p className="text-xs text-gray-500">Swift delivery</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("FoodMenu")}
                className={`w-full p-2 mt-10 cursor-pointer rounded-full flex gap-2 justify-center items-center ${
                  activeTab === "FoodMenu"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {activeTab === "FoodMenu" ? <Sqr /> : <SqrWhite />}
                Food Menu
              </button>

              <button
                onClick={() => setActiveTab("OrderMenu")}
                className={`w-full p-2 mt-4 cursor-pointer rounded-full flex gap-2 justify-center items-center ${
                  activeTab === "OrderMenu"
                    ? "bg-black text-white"
                    : " text-black"
                }`}
              >
                {activeTab === "OrderMenu" ? <CarWhiteIcon /> : <CarBlack />}
                Orders
              </button>
            </div>

            <div
              className={`${isMobile ? "w-full mt-4 overflow-y-auto flex-1 scrollbar-hide" : "w-full mt-8"}`}
            >
              <div className="flex justify-end mb-6">
                <Avatar />
              </div>

              <div
                className={`border rounded-xl ${isMobile ? "p-4 mb-4" : "p-6 mb-6"}`}
              >
                <h1 className="text-xl font-semibold mb-4">Dishes category</h1>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      setShowAllDishes(true);
                      setActiveCategoryIndex(null);
                    }}
                    className={`px-4 py-2 rounded-full flex gap-2 cursor-pointer border
    ${showAllDishes ? "border-[#EF4444] " : "border-gray-300 hover:bg-gray-100"}
  `}
                  >
                    All dishes
                    <span className="bg-black text-white rounded-full text-xs px-2 flex items-center">
                      {newCategories.reduce(
                        (t, c) => t + (c.dishes?.length || 0),
                        0,
                      )}
                    </span>
                  </button>

                  {newCategories.map((category, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setActiveCategoryIndex(index);
                        setShowAllDishes(false);
                      }}
                      className={`relative px-4 py-2 rounded-full flex gap-2 cursor-pointer border ${
                        activeCategoryIndex === index && !showAllDishes
                          ? "border-[#EF4444]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {category.categoryName}
                      <span className="bg-black text-white rounded-full text-xs px-2 flex items-center">
                        {category.dishes?.length || 0}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(index);
                        }}
                        className="absolute -top-2 -right-2 bg-gray-200 text-black w-4 h-4 rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-red-500 w-9 h-9 rounded-full flex justify-center items-center text-white"
                  >
                    <Plus />
                  </button>
                </div>
              </div>

              <div className="grid gap-8">
                {(showAllDishes
                  ? newCategories
                  : [newCategories[activeCategoryIndex]]
                )
                  .filter(Boolean)
                  .map((cat, i) => {
                    // Get the actual category index from newCategories array
                    const actualCatIndex = showAllDishes
                      ? newCategories.findIndex((c) => c._id === cat._id)
                      : activeCategoryIndex;

                    return (
                      <div
                        key={cat._id || i}
                        className="bg-white p-6 border rounded-xl"
                      >
                        <h2 className="text-lg font-semibold mb-4">
                          {cat.categoryName} ({cat.dishes?.length || 0})
                        </h2>

                        <div
                          className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-4"} gap-5 overflow-x-auto`}
                        >
                          <div
                            onClick={() => {
                              setActiveCategoryIndex(actualCatIndex);
                              setShowDishModal(true);
                            }}
                            className={`border-2 border-dashed border-red-500 rounded-xl ${isMobile ? "w-full min-w-[200px]" : "w-[270px]"} h-[241px] flex justify-center items-center hover:bg-red-50 cursor-pointer`}
                          >
                            <button className="bg-red-500 w-9 cursor-pointer h-9 rounded-full flex justify-center items-center text-white">
                              <Plus />
                            </button>
                          </div>

                          {cat.dishes?.map((dish, dIndex) => (
                            <div
                              key={dIndex}
                              className={`relative border rounded-xl p-3 ${isMobile ? "w-full min-w-[200px]" : "w-[270px]"} h-[241px] shadow`}
                            >
                              <button
                                onClick={() => {
                                  setSelectedDish({
                                    ...dish,
                                    catIndex: actualCatIndex,
                                    dishIndex: dIndex,
                                  });
                                  setShowEditModal(true);
                                }}
                                className="absolute top-25 right-6 bg-white  cursor-pointer rounded-full w-9 h-9 flex justify-center items-center"
                              >
                                <InfoIconPencil className="w-5 h-5 stroke-red-500" />
                              </button>

                              <img
                                src={dish.image}
                                className="h-[129px] w-full rounded-lg object-cover"
                              />

                              <div className="flex justify-between mt-2">
                                <p className="text-red-500 font-semibold">
                                  {dish.foodName}
                                </p>
                                <p className="font-bold">${dish.price}</p>
                              </div>

                              <p className="text-xs text-gray-500 line-clamp-3">
                                {dish.ingredients}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
      {activeTab === "OrderMenu" && (
        <OrdersPage activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </>
  );
}
