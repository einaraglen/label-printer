import React from "react";
import Controls from "./components/layout/controls";
import Navigation from "./components/layout/navigation";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Print from "./components/print/print";
import Templates from "./components/templates/templates";
import Community from "./components/community/community";
import Settings from "./components/settings/settings";
import Providers from "./context/providers";

const App = () => {
  return (
    <HashRouter>
      <Providers>
        <div className="w-screen h-screen flex p-6">
          <div className="rounded-xl shadow-lg flex-grow bg-zinc-800 overflow-hidden relative">
            <Controls />
            <Navigation>
              <Routes>
                <Route path="/" element={<Navigate to="/print" />} />
                <Route path="/print" element={<Print />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/community" element={<Community />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Navigation>
          </div>
        </div>
      </Providers>
    </HashRouter>
  );
};

export default App;
