import { useState } from "react";

const emptyForm = {
  title: "",
  category: "Dinner",
  time: "20",
  servings: "2",
  difficulty: "Easy",
  image: "",
  description: "",
  ingredients: "",
  instructions: ""
};

function getInitialForm(data) {
  if (!data) return emptyForm;
  return {
    title: data.title || "",
    category: data.category || "Dinner",
    time: String(data.time || "20"),
    servings: String(data.servings || "2"),
    difficulty: data.difficulty || "Easy",
    image: data.image || "",
    description: data.description || "",
    ingredients: Array.isArray(data.ingredients)
      ? data.ingredients.join("\n")
      : (data.ingredients || ""),
    instructions: Array.isArray(data.instructions)
      ? data.instructions.join("\n")
      : (data.instructions || "")
  };
}

export default function RecipeForm({ initialData = null, onSubmit, onCancel, buttonLabel = "Save Recipe" }) {
  const [form, setForm] = useState(() => getInitialForm(initialData));
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [error, setError] = useState("");
  const [imageValid, setImageValid] = useState(true);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setForm(getInitialForm(initialData));
  }

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "image") {
      setImageValid(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const ingredients = form.ingredients
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const instructions = form.instructions
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!form.title.trim()) {
      setError("Please provide a recipe title.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please add a short recipe description.");
      return;
    }
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient (one per line).");
      return;
    }
    if (instructions.length === 0) {
      setError("Please add at least one cooking step or instruction.");
      return;
    }

    setError("");
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      time: Math.max(1, Number(form.time) || 1),
      servings: Math.max(1, Number(form.servings) || 1),
      ingredients,
      instructions
    });
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error-banner" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Recipe Title *</label>
        <input
          id="title"
          name="title"
          placeholder="e.g. Creamy Tuscan Garlic Chicken"
          value={form.title}
          onChange={update}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={update}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={form.difficulty} onChange={update}>
            <option value="Easy">Easy (Beginner friendly)</option>
            <option value="Medium">Medium (Moderate prep)</option>
            <option value="Hard">Hard (Advanced skills)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="time">Time (minutes) *</label>
          <input
            id="time"
            name="time"
            type="number"
            min="1"
            placeholder="e.g. 30"
            value={form.time}
            onChange={update}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings *</label>
          <input
            id="servings"
            name="servings"
            type="number"
            min="1"
            placeholder="e.g. 4"
            value={form.servings}
            onChange={update}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          name="image"
          type="url"
          placeholder="https://images.unsplash.com/... (optional)"
          value={form.image}
          onChange={update}
        />
        <small className="form-hint">Leave blank to use an automated delicious placeholder.</small>

        {form.image && (
          <div className="image-preview-wrap">
            <p className="preview-label">Live Preview:</p>
            <img
              src={form.image}
              alt="Recipe preview"
              className="image-preview"
              onError={() => setImageValid(false)}
            />
            {!imageValid && <span className="preview-error">Unable to load image from this URL</span>}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Short Description *</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="A quick summary of why this dish is amazing..."
          value={form.description}
          onChange={update}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">
          Ingredients * <span className="label-sub">(one ingredient per line)</span>
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows="5"
          placeholder="2 large chicken breasts&#10;2 tbsp olive oil&#10;4 cloves garlic, minced&#10;1 cup heavy cream"
          value={form.ingredients}
          onChange={update}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructions">
          Instructions * <span className="label-sub">(one step per line)</span>
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows="5"
          placeholder="Season chicken generously with salt and pepper.&#10;Sear in olive oil for 5 minutes per side until golden.&#10;Simmer garlic and cream in the pan, then serve warm."
          value={form.instructions}
          onChange={update}
          required
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}