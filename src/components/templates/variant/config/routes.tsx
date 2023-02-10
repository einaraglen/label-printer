import React from "react";
import { Route, Routes } from "react-router-dom";
import Variant from "../variant";
import Config from "./config";

const ConfigRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Variant />} />
      <Route path="/config/:config_id" element={< Config />} />
    </Routes>
  );
};

export default ConfigRoutes;
