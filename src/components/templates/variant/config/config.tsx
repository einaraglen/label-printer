import React from "react";
import { Route, Routes } from "react-router-dom";

const Config = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Configs</div>} />
      <Route path="/:create" element={<div>Create</div>} />
      <Route path="/:config_id" element={<div>Config ID</div>} />
    </Routes>
  );
};

export default Config;
