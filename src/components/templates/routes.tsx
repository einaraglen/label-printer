import React from "react";
import { Route, Routes } from "react-router-dom";
import Templates from ".";
import TemplateProvider from "../../context/template";
import CreateTemplate from "./create";
import VariantRoutes from "./variant/routes";

const TemplateRoutes = () => {
  return (
    <TemplateProvider>
      <Routes>
        <Route path="/" element={<Templates />} />
        <Route path="/create" element={<CreateTemplate />} />
        <Route path="/:template_id/*" element={<VariantRoutes />} />
      </Routes>
    </TemplateProvider>
  );
};

export default TemplateRoutes;
