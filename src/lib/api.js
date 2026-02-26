export const signUpApi = {
  sendEmail: async ({ email }) => {
    return fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  },

  finishSignup: async ({ email, password }) => {
    return fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  },
};

export const orderApi = {
  createOrder: async ({ user, foodOrderItems, totalPrice, address }) => {
    const res = await fetch(
      "https://foodapp-back-1p78.onrender.com/api/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, foodOrderItems, totalPrice, address }),
      },
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Захиалга үүсгэхэд алдаа гарлаа");
    }

    return res.json();
  },

  getOrders: async (userId = null) => {
    const url = userId
      ? `https://foodapp-back-1p78.onrender.com/api/orders?userId=${userId}`
      : "https://foodapp-back-1p78.onrender.com/api/orders";

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Захиалга авахад алдаа гарлаа");
    }

    const data = await res.json();
    return data.data || data;
  },

  getOrderById: async (orderId) => {
    const res = await fetch(
      `https://foodapp-back-1p78.onrender.com/api/orders/${orderId}`,
    );

    if (!res.ok) {
      throw new Error("Захиалга олдсонгүй");
    }

    const data = await res.json();
    return data.data;
  },
};
