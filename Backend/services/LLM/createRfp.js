import Groq from "groq-sdk";

let client = null;
function getClient() {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

function cleanJsonString(str) {
  return str
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

const generateRfpFromTextGroq = async (freeText) => {
  const client = getClient();
  
  const prompt = `
You are an AI that converts free text into a structured RFP JSON object.

Use THIS EXACT SCHEMA:

{
  "subject": "string",
  "budget": number,
  "billingAddress": "string",
  "delivery": "ISO date string or null",
  "vendors": [],
  "lineItem": [
    {
      "name": "string",
      "quantity": number,
      "description": "string",
      "unitPrice": number
    }
  ],
  "remark": "string",
  "status": "Submitted"
}

DEFAULT VALUES WHEN MISSING:
- subject = "General Procurement Requirement"
- budget = "quantity*unitprice" 
- billingAddress = "Not provided"
- delivery = todays date
- vendors = []
- remark = "No additional remarks"
- status = "Submitted"

DEFAULTS FOR EACH LINE ITEM:
- description = "Not provided"
- unitPrice = 0
- quantity = 1 (if completely missing)
- name = "Unknown item" if not extractable

RULES:
1. You MUST always include description and unitPrice for every line item.
2. description must be "Not provided" when missing.
3. unitPrice must be 0 when missing.
4. Only return VALID JSON with no comments, no explanation.
5. If delivery is not defiend by the date try to find the duration like with in the month or somthing similar and add equivalent timeline.
6. If budget is not given fill it with the quantity * unit price.
7. for remark any addition data that is not revelent to any field and if it is important try to fill this field

TEXT:
${freeText}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Respond ONLY with raw JSON. Do NOT use ```."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0,
  });

  return cleanJsonString(response.choices[0].message.content);
};

export default generateRfpFromTextGroq;
