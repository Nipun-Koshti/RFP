import { Router } from "express";
import { createRfpControllerGroq } from "../Controller/ai.controller.js";
import { processEmailRepliesController,processSingleReplyController,getQuotationsByRfpController } from "../Controller/quote.controller.js";


const router = Router()

router.route("/createRFP").post(createRfpControllerGroq)
router.post("/process-emails", processEmailRepliesController);
router.post("/process-single", processSingleReplyController);
// router.get("/rfp/:rfpId", getQuotationsByRfpController);


export default router;