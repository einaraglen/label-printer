import React from "react";
import { Routes, Route } from "react-router-dom";
import Template from "../template";
import ConfigRoutes from "./config/routes";

const VariantRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Template />} />
      <Route path="/:variant_id/*" element={<ConfigRoutes />} />
    </Routes>
  );
};

export default VariantRoutes;
