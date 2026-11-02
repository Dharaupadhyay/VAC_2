import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { recipes, favorites } = useRecipes();

  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  return (
    <div className="page-container favorites-page">
      <header className="page-header">
        <div className="header-breadcrumbs">
          <Link to="/">← Back to Explore</Link>
        </div>
        <h1 className="page-title">
          My Saved Favorites <span className="heart-badge">❤️</span>
        </h1>
        <p className="page-subtitle">
          Your personal collection of go-to meals and culinary triumphs.
        </p>
      </header>

      {favoriteRecipes.length > 0 ? (
        <section className="favorites-content">
          <div className="favorites-meta-bar">
            <span>
              Showing {favoriteRecipes.length} saved {favoriteRecipes.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>

          <div className="recipe-grid">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <div className="empty-icon">🤍</div>
          <h2>No favorite recipes saved yet</h2>
          <p>
            Browse through our recipes and tap the heart icon on any card to save your favorite dishes here for quick cooking!
          </p>
          <div className="empty-actions">
            <Link to="/" className="btn-primary">
              🔍 Explore Delicious Recipes
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
