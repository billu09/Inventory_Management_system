import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= FETCH =================
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories");
      return res.data?.data ?? res.data; // ✅ safe
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to load categories"
      );
    }
  }
);

// ================= ADD =================
export const addCategory = createAsyncThunk(
  "categories/add",
  async (name, thunkAPI) => {
    try {
      const res = await api.post("/categories", { name });
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to add category"
      );
    }
  }
);

// ================= UPDATE =================
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, name }, thunkAPI) => {
    try {
      const res = await api.put(`/categories/${id}`, { name });
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update category"
      );
    }
  }
);

// ================= DELETE =================
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // ===== UPDATE =====
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.list = state.list.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })

      // ===== DELETE =====
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
