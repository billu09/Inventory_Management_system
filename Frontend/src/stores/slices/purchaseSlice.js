import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH PURCHASES ================= */
export const fetchPurchases = createAsyncThunk(
  "purchases/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/purchases");

      // ✅ IMPORTANT FIX: unwrap ApiResponse
      return Array.isArray(res.data?.data)
        ? res.data.data
        : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load purchases"
      );
    }
  }
);

/* ================= ADD PURCHASE ================= */
export const addPurchase = createAsyncThunk(
  "purchases/add",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/purchases", payload);

      // ✅ unwrap ApiResponse
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add purchase"
      );
    }
  }
);

/* ================= UPDATE PURCHASE ================= */
export const updatePurchase = createAsyncThunk(
  "purchases/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/purchases/${id}`, data);

      // ✅ unwrap ApiResponse
      return res.data?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update purchase"
      );
    }
  }
);

/* ================= DELETE PURCHASE ================= */
export const deletePurchase = createAsyncThunk(
  "purchases/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/purchases/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete purchase"
      );
    }
  }
);

/* ================= SLICE ================= */
const purchaseSlice = createSlice({
  name: "purchases",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addPurchase.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })

      // ===== UPDATE =====
      .addCase(updatePurchase.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.list = state.list.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })

      // ===== DELETE =====
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default purchaseSlice.reducer;
