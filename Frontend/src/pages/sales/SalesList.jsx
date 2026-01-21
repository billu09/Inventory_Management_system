import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSales,
  addSale,
  updateSale,
  deleteSale,
} from "../../stores/slices/salesSlice";
import { fetchProducts } from "../../stores/slices/productSlice";
import toast from "react-hot-toast";

export default function SalesList() {
  const dispatch = useDispatch();

  const { list: sales = [], loading } = useSelector(
    (state) => state.sales
  );

  const products = useSelector(
    (state) => state.products.list || []
  );

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSales());
  }, [dispatch]);

  const submitSale = async () => {
    if (!productId || !quantity) {
      toast.error("Product and quantity required");
      return;
    }

    try {
      await dispatch(
        addSale({
          productId: Number(productId),
          quantity: Number(quantity),
        })
      ).unwrap();

      setProductId("");
      setQuantity("");
      toast.success("Sale added");
    } catch (err) {
  toast.error(
    typeof err === "string"
      ? "Insufficient stock"
      : "Failed To Add"
  );
}

  };

  const startEdit = (sale) => {
    setEditingId(sale.id);
    setEditProductId(sale.productId);
    setEditQuantity(String(sale.quantity));
  };

  const saveEdit = async () => {
    try {
      await dispatch(
        updateSale({
          id: editingId,
          data: {
            productId: Number(editProductId),
            quantity: Number(editQuantity),
          },
        })
      ).unwrap();

      setEditingId(null);
      toast.success("Sale updated");
    } catch {
      toast.error("Failed to update sale");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete sale?")) return;

    try {
      await dispatch(deleteSale(id)).unwrap();
      toast.success("Sale deleted");
    } catch {
      toast.error("Failed to delete sale");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales</h1>

      {/* ADD SALE */}
      <div className="p-4 bg-white rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <button
          onClick={submitSale}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add Sale
        </button>
      </div>

      {/* SALES LIST */}
      <ul className="space-y-3">
        {sales.map((sale) => (
          <li key={sale.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{sale.productName}</div>
            <div className="text-sm text-gray-500">
              Qty: {sale.quantity} • Price: ₹{sale.unitPrice}
            </div>
            <div>Total: ₹{sale.totalAmount}</div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => startEdit(sale)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => remove(sale.id)}
                className="bg-red-500 px-3 py-1 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
