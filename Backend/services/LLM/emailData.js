import Groq from "groq-sdk";



let client = null;
function getClient() {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}


export const generateQuotationFromReply = async (emailText, rfpId, vendorId,attachments) => {
    const groq = getClient()
    console.log("int ehe ai model it is given -------------------------- ", attachments)
  const prompt = `
You are an AI assistant that extracts quotation information from vendor email replies to RFPs (Request for Proposals).

**INPUT DATA:**
- **Email Body Text:** \${emailText}
- **Attachment Content (Pre-Processed as Text):** \${attachmentContent}

Extract the following information from the combined data and return it as a valid JSON object:

1. **Line Items**: Extract all quoted items with:
   - name: Item/product name
   - description: Item description (if available)
   - quantity: Quantity quoted
   - unitPrice: Price per unit
   - total: Total price for that line item (quantity × unitPrice)

2. **Additional Information** (if mentioned):
   - deliveryTimeline: Expected delivery date or timeline
   - gstDetails: GST/tax information
   - termsAndConditions: Any terms or conditions mentioned
   - remarks: Any additional remarks or notes from the vendor
   - validityPeriod: How long the quotation is valid for

3. **Status**: Determine if the vendor has accepted, rejected, quoted, or needs clarification

**IMPORTANT RULES:**
- **Prioritization:** Always look for and prioritize detailed data (especially line items) found in the **Attachment Content** over the **Email Body Text**.
- If no line items are explicitly mentioned, try to infer from the original RFP data in the email thread.
- Calculate the total for each line item as: quantity × unitPrice.
- Extract all numerical values as numbers (not strings).
- If information is missing, use null or empty array as appropriate.
- Return ONLY valid JSON, no markdown formatting or explanations.

**Email Text:**
${emailText}

**Attachment Content (e.g., text from a parsed Excel/PDF/Word file):**
${attachments}

**Output Format:**
{
  "status": "accepted" | "rejected" | "clarification_needed" | "quoted",
  "quotevalue": [
    {
      "name": "string",
      "description": "string",
      "quantity": number,
      "unitPrice": number,
      "total": number
    }
  ],
  "deliveryTimeline": "string or null",
  "gstDetails": "string or null",
  "termsAndConditions": "string or null",
  "remarks": "string or null",
  "validityPeriod": "string or null",
  "vendorResponse": "brief summary of vendor's response"
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a data extraction expert specializing in parsing vendor quotations from emails. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "groq/compound",
      temperature: 0.1,
      max_tokens: 2000,
    });

    let responseText = completion.choices[0]?.message?.content || "{}";
    
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const quotationData = JSON.parse(responseText);

    // Calculate total amount
    const amount = quotationData.quotevalue?.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0) || 0;

    // Return complete payload with rfpId and vendorId
    return {
      rfpId,
      vendorId,
      quotation: {
        rfp:rfpId,
        vendor: vendorId,
        amount,
        quotevalue: quotationData.quotevalue || [],
        status: quotationData.status || "quoted",
        deliveryTimeline: quotationData.deliveryTimeline,
        gstDetails: quotationData.gstDetails,
        termsAndConditions: quotationData.termsAndConditions,
        remarks: quotationData.remarks,
        validityPeriod: quotationData.validityPeriod,
        vendorResponse: quotationData.vendorResponse,
        extractedAt: new Date()
      }
    };
  } catch (error) {
    console.error("Error generating quotation from reply:", error);
    throw new Error(`Failed to extract quotation: ${error.message}`);
  }
};


export const processEmailReplyToQuotation = async (reply) => {
  const { rfpId, vendorId, email } = reply;
  
  // Use HTML if available, otherwise use text
  const emailContent = email.html || email.text;
  
  if (!emailContent || !emailContent.trim()) {
    throw new Error("Email content is empty");
  }

  

  return await generateQuotationFromReply(emailContent, rfpId, vendorId, email.attachments);
};


export const batchProcessReplies = async (replies) => {
  const quotations = [];
  const errors = [];

  for (const reply of replies) {
    try {
      console.log("attachment--------------------------------------------------------",reply.email.attachments)
      const quotation = await processEmailReplyToQuotation(reply);

      quotations.push(quotation);
    } catch (error) {
      errors.push({
        rfpId: reply.rfpId,
        vendorId: reply.vendorId,
        error: error.message
      });
      console.error(`Error processing reply for RFP ${reply.rfpId}:`, error);
    }
  }

  return {
    quotations,
    errors,
    successCount: quotations.length,
    errorCount: errors.length
  };
};