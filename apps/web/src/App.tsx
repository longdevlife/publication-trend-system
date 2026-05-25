import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* TODO: add /search, /papers/:id, /reports, /login, /dashboard */}
    </Routes>
  );
}
