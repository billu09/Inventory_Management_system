import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
} from "../../stores/slices/purchaseSlice";
import { fetchProducts } from "../../stores/slices/productSlice";
import toast from "react-hot-toast";

export default function PurchaseList() {
  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */
  const { list: purchases = [], loading } = useSelector(
    (state) => state.purchases
  );

  const products = useSelector(
    (state) => state.products.list || []
  );

  /* ================= FORM STATE ================= */
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchPurchases());
  }, [dispatch]);

  /* ================= ADD PURCHASE ================= */
  const submitPurchase = async () => {
    if (!productId || !quantity || !costPrice) {
      toast.error("All fields are required");
      return;
    }

    try {
      await dispatch(
        addPurchase({
          productId: Number(productId),
          quantity: Number(quantity),
          costPrice: Number(costPrice),
        })
      ).unwrap();

      setProductId("");
      setQuantity("");
      setCostPrice("");
      toast.success("Purchase added");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Failed to add purchase"
      );
    }
  };

  /* ================= START EDIT ================= */
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditProductId(p.productId);
    setEditQuantity(String(p.quantity));
    setEditCostPrice(String(p.unitPrice));
  };

  /* ================= SAVE EDIT ================= */
  const saveEdit = async () => {
    if (!editProductId || !editQuantity || !editCostPrice) {
      toast.error("All fields required");
      return;
    }

    try {
      await dispatch(
        updatePurchase({
          id: editingId,
          data: {
            productId: Number(editProductId),
            quantity: Number(editQuantity),
            costPrice: Number(editCostPrice),
          },
        })
      ).unwrap();

      setEditingId(null);
      toast.success("Purchase updated");
    } catch {
      toast.error("Failed to update purchase");
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!window.confirm("Delete purchase?")) return;

    try {
      await dispatch(deletePurchase(id)).unwrap();
      toast.success("Purchase deleted");
    } catch {
      toast.error("Failed to delete purchase");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Purchases</h1>

      {/* ================= ADD PURCHASE ================= */}
      <div className="p-4 bg-white rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Add Purchase
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <select
            className="border px-3 py-2 rounded"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            type="number"
            className="border px-3 py-2 rounded"
            placeholder="Cost Price"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </div>

        <button
          onClick={submitPurchase}
          disabled={loading}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Purchase
        </button>
      </div>

      {/* ================= LIST ================= */}
      <ul className="space-y-3">
        {purchases.length === 0 && !loading && (
          <li className="text-gray-500">
            No purchases yet
          </li>
        )}

        {purchases.map((p) => (
          <li
            key={p.id}
            className="bg-white p-4 rounded shadow border"
          >
            {editingId === p.id ? (
              <div className="flex gap-3">
                <select
                  className="border p-2 rounded flex-1"
                  value={editProductId}
                  onChange={(e) =>
                    setEditProductId(e.target.value)
                  }
                >
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="border p-2 rounded w-24"
                  value={editQuantity}
                  onChange={(e) =>
                    setEditQuantity(e.target.value)
                  }
                />

                <input
                  type="number"
                  className="border p-2 rounded w-28"
                  value={editCostPrice}
                  onChange={(e) =>
                    setEditCostPrice(e.target.value)
                  }
                />

                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {p.productName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {p.quantity} • Cost: ₹{p.unitPrice}
                  </div>
                  <div className="text-sm">
                    Total: ₹{p.totalAmount}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
