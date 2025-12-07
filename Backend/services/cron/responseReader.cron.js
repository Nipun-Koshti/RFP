import cron from "node-cron";
import { processEmailRepliesController } from "../../Controller/quote.controller.js";


cron.schedule("*/1 * * * *", async () => {
  console.log("Running email quotation processor...");
  const mockReq = {};
  const mockRes = {
    status: (code) => ({
      json: (data) => console.log("Cron result:", data)
    })
  };
  await processEmailRepliesController(mockReq, mockRes);
});