"use client";
import { useState } from "react";
import axios from "axios";

export default function DishModal({ onClose, onAddDish, categoryName }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;
    if (!image) return alert("Please wait until image uploads!");

    const newDish = {
      name,
      price,
      ingredients,
      image, // ❗Cloudinary URL энд байна
      category: categoryName,
    };

    onAddDish(newDish);
    onClose();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    setImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const base64 = reader.result;
        const res = await axios.post(
          "https://foodapp-back-1p78.onrender.com/api/upload",
          {
            data: base64,
          },
        );

        setImage(res.data.url); // ✔ Cloudinary URL боллоо
      } catch (err) {
        console.log("Upload error", err);
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-[550px] rounded-xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[18px] text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h1 className="text-lg font-semibold mb-5">
          Add new Dish to {categoryName}
        </h1>

        <div className="flex gap-4 mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Food name</p>
            <input
              className="w-full border rounded-lg p-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type food name"
            />
          </div>
          <div className="w-[120px]">
            <p className="text-sm font-medium mb-1">Food price</p>
            <input
              className="w-full border rounded-lg p-3 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price..."
            />
          </div>
        </div>

        <p className="text-sm font-mediummb-1">Ingredients</p>
        <textarea
          className="border rounded-lg w-full h-20 p-3 text-sm mb-4"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="List ingredients..."
        />

        <p className="text-sm font-medium mb-1">Food image</p>
        <label className="cursor-pointer block border-2 border-dashed bg-[#2563EB33] opacity-20 rounded-lg h-[120px] flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            <p className=" text-sm">
              {uploading
                ? "Uploading..."
                : "Choose a file or drag & drop it here"}
            </p>
          )}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
        <div className="w-auto flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="mt-5 w-23.75 bg-black text-white py-3 rounded-lg text-sm font-medium disabled:bg-gray-400"
          >
            {uploading ? "Uploading image..." : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}
