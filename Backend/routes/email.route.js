import sendmail from "../Controller/email.controller.js";
import { captureReplies } from "../services/emailExtractor.js";
import { Router } from "express";

const router = Router();


router.route("/outbound").post(sendmail);

router.get("/check", async (req, res) => {
  try {
    const emails = await captureReplies();
    res.json({ count: emails.length, emails });
  } catch (err) {
    console.error("IMAP Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;