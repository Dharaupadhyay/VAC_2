import { useContext } from "react";
import { RecipeContext } from "./RecipeContext";

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}
