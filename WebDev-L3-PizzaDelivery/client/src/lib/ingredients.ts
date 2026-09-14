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
    { id: "hand-tossed", label: "Classic Hand-Tossed", src: "/assets/ingredients/base-hand-tossed.svg" },
    { id: "thin-crust", label: "Thin Crust Crispy", src: "/assets/ingredients/base-thin-crust.svg" },
    { id: "sourdough", label: "Rustic Sourdough", src: "/assets/ingredients/base-sourdough.svg" },
    { id: "gluten-free", label: "Gluten-Free Cauliflower Crust", src: "/assets/ingredients/base-gluten-free.svg" },
    { id: "stuffed-crust", label: "Cheesy Garlic Stuffed Crust", src: "/assets/ingredients/base-stuffed-crust.svg" },
  ],
  sauces: [
    { id: "marinara", label: "San Marzano Marinara", src: "/assets/ingredients/sauce-marinara.svg" },
    { id: "arrabiata", label: "Fiery Arrabiata", src: "/assets/ingredients/sauce-arrabiata.svg" },
    { id: "alfredo", label: "Creamy Roasted Garlic Alfredo", src: "/assets/ingredients/sauce-alfredo.svg" },
    { id: "bbq", label: "Smoky Hickory BBQ", src: "/assets/ingredients/sauce-bbq.svg" },
    { id: "pesto", label: "Ligurian Basil Pesto", src: "/assets/ingredients/sauce-pesto.svg" },
  ],
  cheeses: [
    { id: "mozzarella", label: "Fior di Latte Mozzarella", src: "/assets/ingredients/cheese-mozzarella.svg" },
    { id: "cheddar", label: "Aged Farmhouse Cheddar", src: "/assets/ingredients/cheese-cheddar.svg" },
    { id: "gouda", label: "Smoked Gouda", src: "/assets/ingredients/cheese-gouda.svg" },
    { id: "ricotta", label: "Fresh Sheep Ricotta", src: "/assets/ingredients/cheese-ricotta.svg" },
    { id: "vegan", label: "Artisanal Cashew Vegan Cheese", src: "/assets/ingredients/cheese-vegan.svg" },
  ],
  veggies: [
    { id: "peppers", label: "Sweet Bell Peppers", src: "/assets/ingredients/veggie-peppers.svg" },
    { id: "onions", label: "Slow-Caramelized Onions", src: "/assets/ingredients/veggie-onions.svg" },
    { id: "olives", label: "Kalamata Black Olives", src: "/assets/ingredients/veggie-olives.svg" },
    { id: "jalapenos", label: "Pickled Jalapeños", src: "/assets/ingredients/veggie-jalapenos.svg" },
    { id: "mushrooms", label: "Button Mushrooms", src: "/assets/ingredients/veggie-mushrooms.svg" },
    { id: "tomatoes", label: "Sun-Dried Tomatoes", src: "/assets/ingredients/veggie-tomatoes.svg" },
  ],
};
