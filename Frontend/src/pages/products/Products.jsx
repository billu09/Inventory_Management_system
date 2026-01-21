import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../stores/slices/productSlice";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

export default function Products() {
  const dispatch = useDispatch();

  const { list: products = [], loading } = useSelector(
    (s) => s.products
  );

  // ===== FORM STATE =====
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ===== DELETE STATE (NEW) =====
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ===== LOAD PRODUCTS =====
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ===== SUBMIT =====
  const submitProduct = async (e) => {
    e.preventDefault();

    if (!name || !sku || !costPrice || !sellingPrice || !quantity) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
    };

    try {
      if (editingId) {
        await dispatch(
          updateProduct({ id: editingId, data: payload })
        ).unwrap();
        toast.success("Product updated");
        setEditingId(null);
      } else {
        await dispatch(addProduct(payload)).unwrap();
        toast.success("Product added");
      }
      resetForm();
    } catch (err) {
      toast.error(err || "Failed to save product");
    }
  };

  // ===== EDIT =====
  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setSku(p.sku);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setQuantity(p.quantity);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== CONFIRM DELETE (NEW, NO ALERT) =====
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await dispatch(deleteProduct(deleteId)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setName("");
    setSku("");
    setCostPrice("");
    setSellingPrice("");
    setQuantity("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===== FORM ===== */}
      <section className="lg:col-span-1 bg-white p-4 rounded shadow border">
        <h2 className="font-semibold mb-3">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={submitProduct} className="space-y-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Cost Price"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />

          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                }}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
            )}
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </section>

      {/* ===== LIST ===== */}
      <section className="lg:col-span-2 bg-white p-4 rounded shadow border">
        <h3 className="font-semibold mb-3">Products</h3>

        {loading && <p>Loading...</p>}

        <ul className="space-y-3">
          {products.length === 0 && <li>No products found</li>}

          {products.map((p) => (
            <li
              key={p.id}
              className="p-4 border rounded flex justify-between"
            >
              <div>
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-gray-600">
                  SKU: {p.sku}
                </div>
                <div className="text-sm">
                  ₹{p.sellingPrice} | Qty: {p.quantity}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="px-3 py-1 bg-yellow-400 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== DELETE MODAL (NEW) ===== */}
      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
