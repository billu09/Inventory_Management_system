import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH PURCHASES ================= */
export const fetchPurchases = createAsyncThunk(
  "purchases/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/purchases");
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
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
      return res.data?.data ?? res.data;
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
      return res.data?.data ?? res.data;
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
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchPurchases.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(addPurchase.fulfilled, (s, a) => {
        if (a.payload) s.list.unshift(a.payload);
      })

      .addCase(updatePurchase.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.list = s.list.map((p) =>
          p.id === a.payload.id ? a.payload : p
        );
      })

      .addCase(deletePurchase.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.id !== a.payload);
      });
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
