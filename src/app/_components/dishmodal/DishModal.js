"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function DishModal({ onClose, onAddDish, categoryName }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;
    if (uploading) return alert("Please wait until image upload finishes.");
    if (!image) return alert("Please upload an image first.");

    const newDish = {
      name,
      price,
      ingredients,
      image,
      category: categoryName,
    };

    onAddDish(newDish);
    onClose();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please use a file smaller than 5MB.");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewImage(localPreviewUrl);
    setImage(null);
    setUploading(true);

    const getUploadedUrl = (payload) =>
      payload?.url ||
      payload?.imageUrl ||
      payload?.secure_url ||
      payload?.data?.url ||
      payload?.data?.imageUrl ||
      payload?.data?.secure_url ||
      payload?.data?.data?.url ||
      payload?.data?.data?.imageUrl ||
      payload?.result?.url ||
      payload?.result?.secure_url;

    const getErrorMessage = (err) => {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const apiMessage =
        data?.message ||
        data?.error ||
        data?.msg ||
        (typeof data === "string" ? data : null);
      const fallback =
        err?.message ||
        (status ? `Request failed with status ${status}` : "Upload failed");
      return apiMessage
        ? `${apiMessage}${status ? ` (HTTP ${status})` : ""}`
        : fallback;
    };

    const tryUpload = async (payload, label) => {
      try {
        const res = await axios.post("/api/upload", payload);
        return { ok: true, res };
      } catch (err) {
        console.log(`${label} upload attempt failed:`, err?.response?.data || err);
        return { ok: false, err };
      }
    };

    try {
      const fdFile = new FormData();
      fdFile.append("file", file);

      const fdImage = new FormData();
      fdImage.append("image", file);

      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const attempts = [
        { label: "multipart:file", payload: fdFile },
        { label: "multipart:image", payload: fdImage },
        { label: "base64:data", payload: { data: base64 } },
        { label: "base64:image", payload: { image: base64 } },
      ];

      let uploadedUrl = null;
      let lastError = null;

      for (const attempt of attempts) {
        const result = await tryUpload(attempt.payload, attempt.label);
        if (!result.ok) {
          lastError = result.err;
          continue;
        }

        uploadedUrl = getUploadedUrl(result.res?.data);
        if (uploadedUrl) break;
      }

      if (!uploadedUrl) {
        if (lastError) throw lastError;
        throw new Error("Upload succeeded but response URL was missing.");
      }

      setImage(uploadedUrl);
    } catch (err) {
      const message = getErrorMessage(err);
      console.log("Upload error:", err?.response?.data || err);
      if (err?.response?.data) {
        alert(`${message}\n${JSON.stringify(err.response.data)}`);
      } else {
        alert(message);
      }
      setImage(null);
    } finally {
      setUploading(false);
    }
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
          {previewImage || image ? (
            <img src={previewImage || image} className="w-full h-full object-cover" />
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
