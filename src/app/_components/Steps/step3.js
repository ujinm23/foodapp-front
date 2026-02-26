"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import BackButton from "./BackButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Step3({ reduceStep }) {
  const router = useRouter();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validEmail = /^\S+@\S+\.\S+$/.test(email);

  const handleNext = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://foodapp-back-1p78.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      console.log("STATUS =", res.status);

      // Content-Type шалгах
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        setError("Server алдаа гарлаа. Дахин оролдоно уу.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("RESPONSE =", data);

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Хэрэглэгчийн мэдээллийг AuthContext-д хадгалах (localStorage болон state хоёуланг нь шинэчлэнэ)
      if (data.user) {
        // Backend-аас accessToken эсвэл token буцааж байна
        const token = data.accessToken || data.token || null;
        login(data.user, token);
        console.log("✅ User мэдээлэл хадгалагдлаа:", data.user);
        console.log("   Role:", data.user.role);
      } else {
        // Хэрэв user мэдээлэл байхгүй бол зөвхөн token хадгалах
        const token = data.accessToken || data.token || null;
        if (token) {
          login(null, token);
        }
      }

      router.push("/");
    } catch (err) {
      console.log("FETCH ERROR:", err);
      if (err instanceof SyntaxError) {
        setError("Server-ийн хариу буруу байна. Дахин оролдоно уу.");
      } else {
        setError("Server error. Try again.");
      }
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));

    const redirectPath = localStorage.getItem("redirectTo") || "/";
    localStorage.removeItem("redirectTo");

    window.location.href = redirectPath;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex items-center justify-center w-1/2 bg-white">
        <div className="w-full max-w-[416px]">
          <div className="mb-6">
            <BackButton onClick={() => router.push("/")} />
          </div>

          <div className="mb-6">
            <h1 className="font-semibold text-2xl">Log in</h1>
            <p className="text-[#71717A]">
              Log in to enjoy your favorite dishes.
            </p>
          </div>

          <div className="relative mb-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className={`w-[416px] ${
                !validEmail && touched
                  ? "border-red-300 focus-visible:ring-red-300"
                  : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </div>

          <div className="mb-1">
            <Input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-[416px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="h-2 mb-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {!validEmail && touched && (
              <p className="text-red-300 text-sm">Invalid email format.</p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Checkbox id="show" checked={show} onCheckedChange={setShow} />
            <label
              htmlFor="show"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Show password
            </label>
          </div>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!validEmail || !password || loading}
            className={`w-[416px] h-9 mb-6 cursor-pointer ${
              validEmail && password && !loading
                ? "bg-[#18181B] text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>

      <div className="w-1/2 h-full p-3">
        <img
          src="/Delivery.svg"
          alt="auth illustration"
          className="w-[2440px] h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
