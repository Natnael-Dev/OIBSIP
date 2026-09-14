export interface Ingredient {
  id: string;
  label: string;
  src: string;
}

export interface IngredientCategory {
  crusts: Ingredient[];
  sauces: Ingredient[];
  cheeses: Ingredient[];
  veggies: Ingredient[];
}

export const INGREDIENTS: IngredientCategory = {
  crusts: [
    { id: "hand-tossed", label: "Hand Tossed", src: "/assets/ingredients/base-hand-tossed.svg" },
    { id: "thin-crust", label: "Thin Crust", src: "/assets/ingredients/base-thin-crust.svg" },
    { id: "sourdough", label: "Sourdough", src: "/assets/ingredients/base-sourdough.svg" },
    { id: "gluten-free", label: "Gluten Free", src: "/assets/ingredients/base-gluten-free.svg" },
    { id: "stuffed-crust", label: "Stuffed Crust", src: "/assets/ingredients/base-stuffed-crust.svg" },
  ],
  sauces: [
    { id: "marinara", label: "Marinara", src: "/assets/ingredients/sauce-marinara.svg" },
    { id: "arrabiata", label: "Arrabbiata", src: "/assets/ingredients/sauce-arrabiata.svg" },
    { id: "alfredo", label: "Alfredo", src: "/assets/ingredients/sauce-alfredo.svg" },
    { id: "bbq", label: "BBQ", src: "/assets/ingredients/sauce-bbq.svg" },
    { id: "pesto", label: "Pesto", src: "/assets/ingredients/sauce-pesto.svg" },
  ],
  cheeses: [
    { id: "mozzarella", label: "Mozzarella", src: "/assets/ingredients/cheese-mozzarella.svg" },
    { id: "cheddar", label: "Cheddar", src: "/assets/ingredients/cheese-cheddar.svg" },
    { id: "gouda", label: "Gouda", src: "/assets/ingredients/cheese-gouda.svg" },
    { id: "ricotta", label: "Ricotta", src: "/assets/ingredients/cheese-ricotta.svg" },
    { id: "vegan", label: "Vegan Blend", src: "/assets/ingredients/cheese-vegan.svg" },
  ],
  veggies: [
    { id: "peppers", label: "Bell Peppers", src: "/assets/ingredients/veggie-peppers.svg" },
    { id: "onions", label: "Red Onions", src: "/assets/ingredients/veggie-onions.svg" },
    { id: "olives", label: "Olives", src: "/assets/ingredients/veggie-olives.svg" },
    { id: "jalapenos", label: "Jalapeños", src: "/assets/ingredients/veggie-jalapenos.svg" },
    { id: "mushrooms", label: "Wild Mushrooms", src: "/assets/ingredients/veggie-mushrooms.svg" },
    { id: "tomatoes", label: "Sun-dried Tomato", src: "/assets/ingredients/veggie-tomatoes.svg" },
  ],
};
