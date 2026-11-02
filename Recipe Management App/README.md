# 🍋 CookRecipeBook — Recipe Management App

A modern, responsive, and interactive Recipe Management Application built with **React 19**, **Vite**, and **React Router**.

---

## ✨ Features

- **🍽️ Explore Curated Recipes:** Browse through delicious starter recipes categorized across Breakfast, Lunch, Dinner, Dessert, and Snack.
- **🔍 Real-Time Search & Filtering:**
  - Instant text search across titles, descriptions, and ingredients.
  - Category tabs with culinary icons.
  - Secondary filters for difficulty (*Easy*, *Medium*, *Hard*) and prep time.
  - Flexible sorting (*Newest*, *Prep Time*, *Title A-Z*).
- **❤️ Favorites System:**
  - One-click heart toggle on recipe cards and detail pages.
  - Live favorite badge counter in the navigation bar.
  - Dedicated Favorites page with friendly empty states.
  - Persisted in browser `localStorage`.
- **➕ Create & Edit Recipes:**
  - Dynamic `RecipeForm` component supporting both creation and inline edits.
  - Live image preview upon entering an image URL.
  - Multi-line ingredient and step parsing.
  - Real-time form validation.
- **📖 Interactive Cooking View (`RecipeDetails`):**
  - **Dynamic Portions Scaler:** Adjust serving size with `+` and `–` buttons.
  - **Interactive Ingredients Checklist:** Cross off ingredients with checkboxes as you prep.
  - **Step-by-Step Instructions:** Track progress and mark cooking steps completed.
  - **Quick Actions:** Copy shareable link, edit recipe, or delete with confirmation.
- **💾 LocalStorage Persistence:** All custom recipes and favorite bookmarks persist across browser reloads.

---

## 🗂️ Project Architecture

```
src/
├── components/
│   ├── Nvmbar.jsx          # Header navigation bar with favorites counter
│   ├── RecipeCard.jsx      # Card component with fallback image, tags & favorites
│   ├── Recipeform.jsx      # Reusable form for adding & editing recipes
│   ├── Navbar.jsx          # Re-export for Navbar naming compatibility
│   └── RecipeForm.jsx      # Re-export for RecipeForm naming compatibility
├── context/
│   ├── RecipeContext.jsx   # Global Context provider managing recipes & favorites
│   └── useRecipes.js       # Custom React hook for consuming recipe context
├── data/
│   └── starterRecipes.js   # Handcrafted starter recipes with Unsplash food imagery
├── pages/
│   ├── Home.jsx            # Hero banner, category tabs, filter bar & recipe grid
│   ├── Favorites.jsx       # User's bookmarked favorites collection
│   ├── AddRecipe.jsx       # Recipe submission page
│   └── RecipeDetails.jsx   # Recipe detail view with interactive checklists & scaling
├── App.jsx                 # Router configuration, routes & footer
├── App.css                 # Modern CSS design system & responsive breakpoints
├── index.css               # Typography, CSS variables & reset
└── main.jsx                # Application root entry
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Lint Code
```bash
npm run lint
```
