import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeForm from "../components/Recipeform";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, updateRecipe, deleteRecipe, favorites, toggleFavorite } = useRecipes();

  const recipe = getRecipeById(id);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!recipe) {
    return (
      <div className="page-container empty-state">
        <div className="empty-icon">🍽️</div>
        <h2>Recipe not found</h2>
        <p>The recipe you are looking for may have been removed or does not exist.</p>
        <Link to="/" className="btn-primary">
          ← Back to All Recipes
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(recipe.id);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleStepComplete = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleUpdate = (updatedData) => {
    updateRecipe(recipe.id, updatedData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      deleteRecipe(recipe.id);
      navigate("/");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      // fallback
    }
  };

  const baseServings = Number(recipe.servings) || 2;
  const currentServings = Math.round(baseServings * servingMultiplier);

  return (
    <div className="page-container recipe-details-page">
      <div className="details-nav-bar">
        <Link to="/" className="back-link">
          ← Back to Recipes
        </Link>

        <div className="details-top-actions">
          <button
            type="button"
            className="btn-action-outline"
            onClick={handleShare}
            title="Copy recipe link"
          >
            {copySuccess ? "✓ Link Copied!" : "🔗 Share"}
          </button>

          <button
            type="button"
            className={`btn-favorite-pill ${isFavorite ? "active" : ""}`}
            onClick={() => toggleFavorite(recipe.id)}
          >
            {isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
          </button>

          <button
            type="button"
            className="btn-action-outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Edit" : "✏️ Edit"}
          </button>

          <button
            type="button"
            className="btn-action-danger"
            onClick={handleDelete}
            title="Delete this recipe"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form-wrap">
          <h2 className="edit-form-title">Edit "{recipe.title}"</h2>
          <RecipeForm
            initialData={recipe}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            buttonLabel="Save Changes"
          />
        </div>
      ) : (
        <article className="recipe-article">
          {/* Header & Hero Image */}
          <div className="details-hero">
            <div className="details-image-container">
              <img
                src={recipe.image || DEFAULT_IMAGE}
                alt={recipe.title}
                className="details-hero-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_IMAGE;
                }}
              />
              <span className={`category-pill category-${recipe.category ? recipe.category.toLowerCase() : "other"}`}>
                {recipe.category || "Dinner"}
              </span>
            </div>

            <div className="details-header-content">
              <h1 className="details-title">{recipe.title}</h1>
              <p className="details-description">{recipe.description}</p>

              {/* Quick Stat Badges */}
              <div className="details-quick-stats">
                <div className="stat-card">
                  <span className="stat-icon">⏱️</span>
                  <div>
                    <span className="stat-label">Total Time</span>
                    <strong className="stat-value">{recipe.time} mins</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🍽️</span>
                  <div>
                    <span className="stat-label">Servings</span>
                    <strong className="stat-value">{currentServings}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🔥</span>
                  <div>
                    <span className="stat-label">Difficulty</span>
                    <strong className="stat-value">{recipe.difficulty || "Easy"}</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">📂</span>
                  <div>
                    <span className="stat-label">Category</span>
                    <strong className="stat-value">{recipe.category || "General"}</strong>
                  </div>
                </div>
              </div>

              {/* Servings Adjuster */}
              <div className="servings-scale-bar">
                <span className="scale-title">Adjust Portions:</span>
                <div className="scale-buttons">
                  <button
                    type="button"
                    className="scale-btn"
                    onClick={() => setServingMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                    disabled={servingMultiplier <= 0.5}
                    title="Fewer servings"
                  >
                    –
                  </button>
                  <span className="scale-indicator">{currentServings} servings</span>
                  <button
                    type="button"
                    className="scale-btn"
                    onClick={() => setServingMultiplier((prev) => Math.min(4, prev + 0.5))}
                    disabled={servingMultiplier >= 4}
                    title="More servings"
                  >
                    +
                  </button>
                  {servingMultiplier !== 1 && (
                    <button
                      type="button"
                      className="scale-reset"
                      onClick={() => setServingMultiplier(1)}
                    >
                      Reset (1x)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cooking Content: Ingredients & Instructions */}
          <div className="details-grid-body">
            {/* Ingredients Column */}
            <section className="ingredients-panel">
              <div className="panel-header">
                <h2>Ingredients ({recipe.ingredients?.length || 0})</h2>
                <span className="panel-hint">Tap item to cross off while cooking</span>
              </div>

              <ul className="interactive-ingredients-list">
                {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => {
                  const isChecked = Boolean(checkedIngredients[idx]);
                  return (
                    <li
                      key={idx}
                      className={`ingredient-item ${isChecked ? "checked" : ""}`}
                      onClick={() => toggleIngredientCheck(idx)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleIngredientCheck(idx)}
                        aria-label={ingredient}
                      />
                      <span className="ingredient-text">{ingredient}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Instructions Column */}
            <section className="instructions-panel">
              <div className="panel-header">
                <h2>Step-by-Step Instructions</h2>
                <span className="panel-hint">Follow along at your own pace</span>
              </div>

              <ol className="interactive-steps-list">
                {recipe.instructions && recipe.instructions.map((step, idx) => {
                  const isDone = Boolean(completedSteps[idx]);
                  return (
                    <li
                      key={idx}
                      className={`step-item ${isDone ? "completed" : ""}`}
                      onClick={() => toggleStepComplete(idx)}
                    >
                      <div className="step-number">{idx + 1}</div>
                      <div className="step-body">
                        <p className="step-text">{step}</p>
                        <span className="step-status">
                          {isDone ? "✓ Completed" : "Mark as done"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </article>
      )}
    </div>
  );
}
