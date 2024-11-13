import "./App.css";

import { Routes, Route, BrowserRouter } from "react-router-dom";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/details/:id/:method" element={<DetailPage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
