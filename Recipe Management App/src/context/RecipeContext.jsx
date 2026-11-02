import { createContext, useContext, useState, useEffect } from "react";
import { starterRecipes } from "../data/starterRecipes";

const STORAGE_KEY = "recipe_app_recipes_v1";
const FAVORITES_KEY = "recipe_app_favorites_v1";

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return starterRecipes;
    } catch {
      return starterRecipes;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return ["1", "4"]; // defaults
    } catch {
      return ["1", "4"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error("Failed to save recipes to localStorage", e);
    }
  }, [recipes]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const addRecipe = (recipeData) => {
    const id = Date.now().toString();
    const newRecipe = {
      ...recipeData,
      id,
      createdAt: new Date().toISOString()
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    return id;
  };

  const updateRecipe = (id, updatedData) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updatedData, id } : recipe
      )
    );
  };

  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const getRecipeById = (id) => {
    return recipes.find((r) => String(r.id) === String(id));
  };

  const resetToDefaults = () => {
    setRecipes(starterRecipes);
    setFavorites(["1", "4"]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        getRecipeById,
        resetToDefaults
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}