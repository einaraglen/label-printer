import React, { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Variant from "./variant/variant";

const Templates = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col space-y-3">
              <span>Templates</span>
              <Link to="create">Create</Link>
              <Link to="123">ID</Link>
            </div>
          }
        />
        <Route
          path="/create"
          element={
            <div className="flex flex-col space-y-3">
              <span>Create</span>
              <Link to="/templates">Back</Link>
            </div>
          }
        />
        <Route
          path="/:template_id"
          element={<Variant />}
        />
      </Routes>
  );
};

export default Templates;
