import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StockChart({ products }) {
  if (!products.length) return null;

  const data = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: "Stock Quantity",
        data: products.map((p) => p.quantity),
        backgroundColor: "#6366f1",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h3 className="font-semibold mb-3">
        Stock per Product
      </h3>
      <Bar data={data} />
    </div>
  );
}
