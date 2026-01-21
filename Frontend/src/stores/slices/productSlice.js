import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= FETCH =================
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load products"
      );
    }
  }
);

// ================= ADD =================
export const addProduct = createAsyncThunk(
  "products/add",
  async (product, thunkAPI) => {
    try {
      const res = await api.post("/products", product);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add product"
      );
    }
  }
);

// ================= UPDATE =================
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update product"
      );
    }
  }
);

// ================= DELETE =================
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ IMPORTANT FIX
        state.list = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addProduct.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
      })

      // ===== UPDATE =====
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (!action.payload?.data) return;

        state.list = state.list.map((p) =>
          p.id === action.payload.data.id
            ? action.payload.data
            : p
        );
      })

      // ===== DELETE =====
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
