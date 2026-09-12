import cron from 'node-cron';
import { InventoryItem } from '../models/InventoryItem.js';
import { sendLowStockAlertEmail } from './emailService.js';

export const runInventoryAudit = async () => {
  try {
    // Find all items where stockQuantity <= alertThreshold
    const lowStockItems = await InventoryItem.find({
      $expr: { $lte: ['$stockQuantity', '$alertThreshold'] }
    });

    if (lowStockItems.length === 0) {
      console.log(`[Cron: Inventory Monitor] Stock levels nominal. 0 threshold breaches.`);
      return { breached: 0, items: [] };
    }

    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

    // Filter items that haven't been alerted recently (prevent spam)
    const itemsToAlert = lowStockItems.filter(
      (item) => !item.lastAlertSentAt || item.lastAlertSentAt < fourHoursAgo
    );

    if (itemsToAlert.length > 0) {
      console.warn(`[Cron: Inventory Monitor] 🚨 ${itemsToAlert.length} items breached threshold! Dispatching alert email...`);
      await sendLowStockAlertEmail(itemsToAlert);

      // Update lastAlertSentAt
      const ids = itemsToAlert.map((i) => i._id);
      await InventoryItem.updateMany({ _id: { $in: ids } }, { $set: { lastAlertSentAt: now } });
    }

    return { breached: lowStockItems.length, alerted: itemsToAlert.length };
  } catch (err) {
    console.error(`[Cron: Inventory Monitor Error] Failed audit execution: ${err.message}`);
  }
};

export const startCronJobs = () => {
  const schedule = process.env.CRON_SCHEDULE || '*/10 * * * *';
  console.log(`[Cron Service] Initializing background inventory worker on schedule: ${schedule}`);

  cron.schedule(schedule, async () => {
    console.log(`[Cron Service] Executing scheduled stock audit at ${new Date().toISOString()}`);
    await runInventoryAudit();
  });
};
