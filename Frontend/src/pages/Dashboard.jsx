import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../stores/slices/companySlice";
import { fetchProducts } from "../stores/slices/productSlice";

import StockChart from "../components/dashboard/StockChart";
import CompanyStatusChart from "../components/dashboard/CompanyStatusChart";

export default function Dashboard() {
  const dispatch = useDispatch();

  // ===== AUTH =====
  const user = useSelector((state) => state.auth.user);
  const role = user?.role; // "admin" | "company"

  const isAdmin = role === "admin";
  const isCompany = role === "company";

  // ===== DATA =====
  const companies = useSelector(
    (state) => state.companies.list || []
  );
  const products = useSelector(
    (state) => state.products.list || []
  );

  // ===== LOAD DATA =====
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchCompanies());
    }

    if (isCompany) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isAdmin, isCompany]);

  // ===== METRICS =====
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(
    (c) => c.active
  ).length;
  const inactiveCompanies =
    totalCompanies - activeCompanies;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* ================= COMPANY DASHBOARD ================= */}
      {isCompany && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Total Products"
              value={products.length}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockChart products={products} />
          </div>
        </>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}
      {isAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StatCard
              title="Total Companies"
              value={totalCompanies}
            />
            <StatCard
              title="Active Companies"
              value={activeCompanies}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompanyStatusChart
              active={activeCompanies}
              inactive={inactiveCompanies}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ===== REUSABLE CARD =====
function StatCard({ title, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-3xl mt-3">{value}</p>
    </div>
  );
}
