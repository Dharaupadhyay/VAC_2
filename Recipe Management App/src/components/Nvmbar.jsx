import { NavLink } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

export default function Navbar() {
  const { favorites } = useRecipes();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="brand" aria-label="CookRecipeBook home">
          <span className="brand-icon">🍋</span>
          <span className="brand-name">
            <span className="brand-accent">cook</span>
            <span>recipe<span className="brand-accent">book</span></span>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Explore
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            Favorites
            {favorites.length > 0 && (
              <span className="badge-count" aria-label={`${favorites.length} favorites`}>
                {favorites.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) => `nav-add ${isActive ? "active" : ""}`}
          >
            <span>➕</span> Add Recipe
          </NavLink>
        </nav>
      </div>
    </header>
  );
}