import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CompanyStatusChart({
  active,
  inactive,
}) {
  const data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h3 className="font-semibold mb-3">
        Company Status
      </h3>
      <Pie data={data} />
    </div>
  );
}
