import { Pizza } from '../models/Pizza.js';

export const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ isPopular: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPizzaBySlug = async (req, res) => {
  try {
    const pizza = await Pizza.findOne({ slug: req.params.slug });
    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found.' });
    }
    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPizza = async (req, res) => {
  try {
    const newPizza = await Pizza.create(req.body);
    res.status(201).json({
      success: true,
      data: newPizza
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
