import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin panel — no navbar */}
          <Route path="/admin" element={<Admin />} />

          {/* Public site — with navbar */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Landing />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
