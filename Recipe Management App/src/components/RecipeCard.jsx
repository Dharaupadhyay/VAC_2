import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";

export default function RecipeCard({ recipe }) {
  const { favorites, toggleFavorite } = useRecipes();
  const isFavorite = favorites.includes(recipe.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  const difficultyColors = {
    Easy: "difficulty-easy",
    Medium: "difficulty-medium",
    Hard: "difficulty-hard"
  };

  return (
    <article className="recipe-card">
      <div className="card-image-wrap">
        <img
          src={recipe.image || DEFAULT_IMAGE}
          alt={recipe.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        <span className={`category-pill category-${recipe.category ? recipe.category.toLowerCase() : "other"}`}>
          {recipe.category || "General"}
        </span>
        <button
          type="button"
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="meta-time">⏱️ {recipe.time} min</span>
          <span className="meta-dot">•</span>
          <span className={`difficulty-badge ${difficultyColors[recipe.difficulty] || "difficulty-easy"}`}>
            {recipe.difficulty || "Easy"}
          </span>
        </div>

        <h3 className="card-title">
          <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
        </h3>

        <p className="card-desc">{recipe.description}</p>

        <div className="card-bottom">
          <span className="servings">🍽️ {recipe.servings} servings</span>
          <Link className="text-link" to={`/recipe/${recipe.id}`}>
            View recipe →
          </Link>
        </div>
      </div>
    </article>
  );
}