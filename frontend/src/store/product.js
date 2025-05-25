import { create } from "zustand";

// Use env variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  fetchProducts: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      set({ products: data.data });
    } catch (error) {
      console.error("Fetch products error:", error);
      set({ products: [] });
    }
  },

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.image || !newProduct.price) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Server error occurred." };
      }

      const data = await res.json();
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      console.error("Create product error:", error);
      return { success: false, message: "Server error. Please try again later." };
    }
  },

  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Delete product error:", error);
      return { success: false, message: "Server error. Please try again later." };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${pid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || "Server error occurred." };
      }

      const data = await res.json();

      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Update product error:", error);
      return { success: false, message: "Server error. Please try again later." };
    }
  },
}));
