import { InventoryItem } from '../models/InventoryItem.js';
import { runInventoryAudit } from '../services/cronService.js';

export const getInventory = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await InventoryItem.find(filter).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { operation, quantity } = req.body; // operation: 'add' | 'subtract' | 'set'

    const item = await InventoryItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ingredient item not found.' });
    }

    const previousStock = item.stockQuantity;
    const qty = Number(quantity);

    if (isNaN(qty)) {
      return res.status(400).json({ success: false, message: 'Invalid quantity parameter.' });
    }

    if (operation === 'add') {
      item.stockQuantity += qty;
    } else if (operation === 'subtract') {
      item.stockQuantity = Math.max(0, item.stockQuantity - qty);
    } else if (operation === 'set') {
      item.stockQuantity = Math.max(0, qty);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid operation. Must be add, subtract, or set.' });
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: `Stock for ${item.name} updated from ${previousStock} to ${item.stockQuantity}.`,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateThreshold = async (req, res) => {
  try {
    const { id } = req.params;
    const { alertThreshold } = req.body;

    const threshold = Number(alertThreshold);
    if (isNaN(threshold) || threshold < 1) {
      return res.status(400).json({ success: false, message: 'Threshold must be a positive integer.' });
    }

    const item = await InventoryItem.findByIdAndUpdate(
      id,
      { alertThreshold: threshold },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Ingredient item not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Alert threshold for ${item.name} set to ${threshold}.`,
      data: item
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const triggerManualAudit = async (req, res) => {
  try {
    const auditResults = await runInventoryAudit();
    res.status(200).json({
      success: true,
      message: 'On-demand inventory audit executed.',
      data: auditResults
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
