import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";

const CATEGORIES = [
  { id: "All", label: "All Recipes", icon: "✨" },
  { id: "Breakfast", label: "Breakfast", icon: "🍳" },
  { id: "Lunch", label: "Lunch", icon: "🥗" },
  { id: "Dinner", label: "Dinner", icon: "🍝" },
  { id: "Dessert", label: "Dessert", icon: "🍰" },
  { id: "Snack", label: "Snack", icon: "🥨" }
];

export default function Home() {
  const { recipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [maxTime, setMaxTime] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((recipe) => {
        // Search term check
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = recipe.title?.toLowerCase().includes(q);
          const matchDesc = recipe.description?.toLowerCase().includes(q);
          const matchIngredients = recipe.ingredients?.some((item) =>
            item.toLowerCase().includes(q)
          );
          if (!matchTitle && !matchDesc && !matchIngredients) return false;
        }

        // Category filter
        if (selectedCategory !== "All" && recipe.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== "All" && recipe.difficulty !== selectedDifficulty) {
          return false;
        }

        // Max time filter
        if (maxTime !== "All") {
          const limit = Number(maxTime);
          if (Number(recipe.time) > limit) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "time-asc") {
          return (Number(a.time) || 0) - (Number(b.time) || 0);
        }
        if (sortBy === "time-desc") {
          return (Number(b.time) || 0) - (Number(a.time) || 0);
        }
        if (sortBy === "title-asc") {
          return a.title.localeCompare(b.title);
        }
        // newest
        return (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0));
      });
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, maxTime, sortBy]);

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    selectedDifficulty !== "All" ||
    maxTime !== "All";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setMaxTime("All");
    setSortBy("newest");
  };

  return (
    <div className="page-container home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-tagline">🍴 Simple, Fresh & Flavorful</span>
          <h1 className="hero-title">
            Cook With Confidence, <br />
            <span className="text-gradient">Eat With Joy.</span>
          </h1>
          <p className="hero-subtitle">
            Explore easy-to-follow kitchen recipes, save your favorite meals, or share your own signature dish with food lovers.
          </p>

          <div className="hero-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search by recipe name, ingredient (e.g. garlic, chicken)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="categories-section">
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`chip ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="chip-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters and Controls Bar */}
      <section className="controls-bar">
        <div className="controls-left">
          <span className="recipe-count-badge">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? "Recipe" : "Recipes"}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-link-reset"
              onClick={handleResetFilters}
            >
              Reset Filters ↺
            </button>
          )}
        </div>

        <div className="controls-right">
          <div className="control-select-group">
            <label htmlFor="filter-difficulty">Difficulty:</label>
            <select
              id="filter-difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="control-select-group">
            <label htmlFor="filter-time">Time:</label>
            <select
              id="filter-time"
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
            >
              <option value="All">Any Duration</option>
              <option value="15">≤ 15 mins</option>
              <option value="30">≤ 30 mins</option>
              <option value="45">≤ 45 mins</option>
              <option value="60">≤ 60 mins</option>
            </select>
          </div>

          <div className="control-select-group">
            <label htmlFor="sort-by">Sort By:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="time-asc">Prep Time: Fastest</option>
              <option value="time-desc">Prep Time: Longest</option>
              <option value="title-asc">Title: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="recipe-grid-section">
        {filteredRecipes.length > 0 ? (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3>No recipes found</h3>
            <p>
              We couldn't find any recipes matching your filters or search terms.
            </p>
            <div className="empty-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetFilters}
                >
                  Clear all filters
                </button>
              )}
              <Link to="/add" className="btn-primary">
                ➕ Add a new recipe
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
