import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Navbar from "./components/Nvmbar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import "./App.css";

export default function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/add" element={<AddRecipe />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <span className="footer-icon">🍋</span>
                <strong>CookRecipeBook</strong>
                <p>Your open culinary companion for crafting, saving, and savoring delicious meals.</p>
              </div>

              <div className="footer-links">
                <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Back to Top ↑
                </a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} CookRecipeBook. Made with fresh ingredients & passion for great food.</p>
            </div>
          </footer>
        </div>
      </Router>
    </RecipeProvider>
  );
}
