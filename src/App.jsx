import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentProcessor from "./components/DocumentProcessor";
import DocumentStatus from "./components/DocumentStatus";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="documentProcessor" element={<DocumentProcessor />} />
        <Route path="documentStatus" element={<DocumentStatus />} />
      </Routes>
    </Router>
  );
};

export default App;
