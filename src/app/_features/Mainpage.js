"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import FoodDetailModal from "../_components/dishmodal/FoodDetailModal";
import Toast from "../_components/Toast/Toast";
import CartDrawer from "../_components/CardDrawer/CartDrawer";
import SuccessOrderModal from "../_components/SuccessOrderModal/SuccessOrderModal";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CategorySkeleton from "../_components/Skeleton/CategorySkeleton";
import Image from "next/image";

export default function MainPage({ isCartOpen, openCart, closeCart }) {
  const router = useRouter();
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
  } = useCart();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const shippingFee = 0.99;
  const itemsTotal = getTotalPrice();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://foodapp-back-1p78.onrender.com/api/categories",
        );
        setCategories(res.data);
      } catch (err) {
        console.log("Category load error:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders");
        setOrders(res.data.data);
      } catch (err) {
        console.log("Order fetch error:", err);
      }
    };

    getCategories();
    fetchOrders();
  }, []);

  const handleAddToCart = (dish, count) => {
    const dishId = dish._id;

    setSelectedDish(null);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Cart-д item нэмэх (count удаа)
    for (let i = 0; i < count; i++) {
      addToCart({
        id: dishId,
        name: dish.foodName || dish.name,
        price: dish.price,
        image: dish.image,
        description: dish.ingredients || "",
      });
    }

    openCart();
  };

  const handleUpdateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, qty);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get("/api/orders");
          setOrders(res.data.data);
        } catch (err) {
          console.log("Order fetch error:", err);
        }
      };
      fetchOrders();
    }
  }, [user]);

  return (
    <div>
      {selectedDish && (
        <FoodDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="h-180 w-auto relative flex">
        <Image
          src="/BG.svg"
          fill
          alt="the home picture"
          className="object-cover "
          loading="eager"
        />
      </div>

      <div className="bg-[#404040] flex justify-center">
        <div className="w-full max-w-[1440px] py-[88px] px-10">
          {loading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : (
            categories.map((category, index) => (
              <div key={index} className="mb-20">
                <h2 className="text-white font-semibold text-3xl mb-10">
                  {category.categoryName}
                </h2>

                <div className="grid grid-cols-3 gap-6">
                  {category.dishes?.map((dish, dIndex) => (
                    <div
                      key={dIndex}
                      className="relative rounded-xl bg-white p-3 shadow-lg"
                    >
                      <img
                        src={dish.image}
                        className="w-full h-[210px] rounded-lg object-cover"
                        alt=""
                      />

                      <button
                        onClick={() => setSelectedDish(dish)}
                        className="absolute top-44 right-6 bg-white text-red-500 
                                   border cursor-pointer w-11 h-11 rounded-full 
                                   flex items-center justify-center 
                                   hover:bg-red-500 hover:text-white transition"
                      >
                        +
                      </button>

                      <div className="flex justify-between mt-2">
                        <p className="text-red-500 font-semibold mb-2">
                          {dish.foodName}
                        </p>
                        <p className="font-bold">${dish.price}</p>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-3 mb-2">
                        {dish.ingredients}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        {showToast && <Toast message="Food is being added to the cart!" />}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} orders={orders} />

      {showSuccess && (
        <SuccessOrderModal
          onClose={() => {
            setShowSuccess(false);
            clearCart();
            closeCart();
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
