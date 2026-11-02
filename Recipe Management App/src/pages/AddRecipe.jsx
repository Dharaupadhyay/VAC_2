import { useNavigate, Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeForm from "../components/Recipeform";

export default function AddRecipe() {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();

  const handleCreate = (recipeData) => {
    const newId = addRecipe(recipeData);
    navigate(`/recipe/${newId}`);
  };

  return (
    <div className="page-container form-page">
      <header className="page-header">
        <div className="header-breadcrumbs">
          <Link to="/">← Back to Explore</Link>
        </div>
        <h1 className="page-title">
          Create New Recipe <span className="title-icon">🍳</span>
        </h1>
        <p className="page-subtitle">
          Share your favorite homemade dish, ingredient checklist, and step-by-step instructions.
        </p>
      </header>

      <div className="form-card-container">
        <RecipeForm
          onSubmit={handleCreate}
          onCancel={() => navigate("/")}
          buttonLabel="✨ Publish Recipe"
        />
      </div>
    </div>
  );
}
