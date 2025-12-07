import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import SentMail from "../model/email.model.js";

const config = {
  imap: {
    user: "darknight3654@gmail.com",
    password: "bips zehw tayj mzdg",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

export const captureReplies = async () => {
  const replies = [];
  try {
    const connection = await imaps.connect(config);

    await connection.openBox("INBOX");

    // Search for unseen emails from the last 24 hours to catch all potential replies
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const imapDate = yesterday.toISOString().slice(0, 10).replace(/-/g, "-");

    const searchCriteria = ["UNSEEN", ["SINCE", imapDate]];

    const fetchOptions = {
      bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID IN-REPLY-TO REFERENCES)", "TEXT", ""],
      struct: true,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    console.log(`Found ${messages.length} unread messages`);

    // 1-hour window check for recent replies
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const message of messages) {
      try {
        // Get the full email body
        const all = message.parts.find((part) => part.which === "");
        const emailBuffer = all ? all.body : "";

        const parsed = await simpleParser(emailBuffer);

        // Check email date
        const emailDate = parsed.date ? new Date(parsed.date) : new Date(0);

        if (emailDate.getTime() < oneHourAgo.getTime()) {
          console.log("Skipping old email:", parsed.subject);
          continue;
        }

        // Extract Message-ID references for reply detection
        const inReplyTo = parsed.inReplyTo || parsed.headers.get("in-reply-to");
        const references = parsed.references || parsed.headers.get("references");
        
        // Build array of possible original message IDs
        let originalMessageIds = [];
        
        if (inReplyTo) {
          // Handle both string and array formats
          const inReplyToIds = Array.isArray(inReplyTo) ? inReplyTo : [inReplyTo];
          originalMessageIds.push(...inReplyToIds);
        }
        
        if (references) {
          // References can be a string with multiple IDs or an array
          if (typeof references === "string") {
            originalMessageIds.push(...references.trim().split(/\s+/));
          } else if (Array.isArray(references)) {
            originalMessageIds.push(...references);
          }
        }

        // Clean up message IDs (remove angle brackets if present)
        originalMessageIds = originalMessageIds
          .map(id => id.trim().replace(/^<|>$/g, ""))
          .filter(id => id.length > 0);

        if (originalMessageIds.length === 0) {
          console.log("Not a reply (missing In-Reply-To/References):", parsed.subject);
          continue;
        }

        console.log("Checking message IDs:", originalMessageIds);

        // Try to find matching sent email in database
        let meta = null;
        for (const msgId of originalMessageIds) {
          // Try with and without angle brackets
          meta = await SentMail.findOne({
            $or: [
              { messageId: msgId },
              { messageId: `<${msgId}>` },
              { messageId: msgId.replace(/^<|>$/g, "") }
            ]
          });
          
          if (meta) {
            console.log("Found match for Message-ID:", msgId);
            break;
          }
        }

        if (!meta) {
          console.log("Reply does NOT match any stored email. Checked IDs:", originalMessageIds);
          continue;
        }

        const fromEmail = parsed.from?.value?.[0]?.address || parsed.from?.text || "unknown";

        // Construct reply object
        replies.push({
          rfpId: meta.rfpId,
          vendorId: meta.vendorId,
          email: {
            from: fromEmail,
            subject: parsed.subject || "",
            text: parsed.text || "",
            html: parsed.html || "",
            receivedAt: emailDate,
          },
        });

        console.log("Reply captured:", {
          rfpId: meta.rfpId,
          vendorId: meta.vendorId,
          from: fromEmail,
          subject: parsed.subject,
        });

        // Mark as seen/read
        await connection.addFlags(message.attributes.uid, "\\Seen");
      } catch (parseError) {
        console.error("Error parsing individual message:", parseError);
        continue;
      }
    }

    await connection.end();

    console.log(`Total replies captured: ${replies.length}`);
    return replies;
  } catch (err) {
    console.error("Error capturing replies:", err);
    return [];
  }
};