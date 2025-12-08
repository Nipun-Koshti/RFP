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

const analysisGneratorFronQuotation = async (rfp) => {
  const client = getClient();
  
  const prompt = `
You are an AI system that analyzes vendor quotations against an RFP (Request for Proposal).

You will receive a JSON object containing RFP details with vendor quotations.

-------------------------------------
UNDERSTANDING THE DATA STRUCTURE
-------------------------------------

The RFP payload contains a "vendors" array where each element has:
- "vendor": An object with vendor company details (name, contact, etc.)
- "quotation": An object with the vendor's quotation details (pricing, delivery, warranty, etc.)

Each vendor object and its corresponding quotation object are paired together.

YOUR TASK:
1. Count the ACTUAL number of vendors in the "vendors" array
2. For each vendor, analyze their quotation against the RFP requirements
3. Compare all vendors using the weighted scoring system
4. Rank vendors from best to worst
5. Return results for ONLY the vendors present in the data

-------------------------------------
RFP REQUIREMENTS TO CHECK
-------------------------------------

Extract from the payload:
- Budget limit: Compare quotation amounts against this
- Delivery date: Compare vendor delivery dates against this
- Line items: Verify vendors are quoting for the correct items and quantities
- Remarks: Check if vendors addressed special requirements (e.g., warranty)
- Billing address: Verify delivery location compatibility

-------------------------------------
WEIGHTED SCORING SYSTEM (Total: 100)
-------------------------------------

1. **Total Quotation Amount (40 points)**
   - Compare the quotation total amount from each vendor
   - Lower amount = higher score
   - Formula: (Lowest Quote / Current Vendor Quote) × 40
   - Must be within RFP budget

2. **Delivery Timeline (20 points)**
   - Compare quotation delivery date against RFP delivery date
   - Earlier or on-time = higher score
   - Penalize late deliveries heavily

3. **Warranty, Terms & Conditions (20 points)**
   - Evaluate warranty period offered
   - Check payment terms, return policy
   - Assess clarity and favorability of terms
   - Check if remarks/special requirements are addressed

4. **Match With RFP Requirements (10 points)**
   - Verify line items match (name, quantity, specifications)
   - Check if description requirements are met
   - Validate unit prices are reasonable
   - Ensure all requested items are included

5. **Additional Benefits (10 points)**
   - Free shipping or installation
   - Extended warranty beyond requirement
   - Training or support services
   - Accessories or add-ons
   - Flexible payment terms

-------------------------------------
CRITICAL ANALYSIS RULES
-------------------------------------

1. **Count vendors first**: Check vendors.length in the payload
2. **Only analyze existing vendors**: If 1 vendor exists, analyze 1. If 5 exist, analyze 5.
3. **No fabrication**: Never invent or duplicate vendor data
4. **Fair comparison**: Even with 1 vendor, evaluate against RFP requirements
5. **Budget compliance**: Flag if any quotation exceeds the RFP budget
6. **Missing data handling**: If quotation data is incomplete, note it in analysis but include vendor

-------------------------------------
OUTPUT FORMAT (JSON ONLY)
-------------------------------------

{
  "totalVendors": <number of vendors analyzed>,
  
  "analysis": "Comprehensive analysis including: 
    - Number of vendors evaluated
    - Budget: [RFP budget] vs vendor quotations
    - Delivery comparison against RFP date: [date]
    - Line items verification (match/mismatch)
    - Warranty and terms evaluation
    - Special requirements (remarks) compliance
    - Price breakdown and comparison
    - Clear recommendation with justification
    - Any red flags or concerns",
  
  "vendorlist": [
    "Rank 1: [Vendor Name] (Score: X/100) - [Key strengths: price advantage, delivery timeline, warranty details, requirement compliance]",
    "Rank 2: [Vendor Name] (Score: X/100) - [Why ranked here: specific comparison points]"
    // ONLY include actual vendors from the data
  ],
  
  
    // One object per vendor - must match vendorlist length
 
  
  "recommendation": {
    "bestVendor": "Vendor Name",
    "reason": "Concise explanation of why this vendor is recommended",
    "concerns": ["List any concerns or risks", "Even for the recommended vendor"]
  }
}

-------------------------------------
STRICT RULES - NO EXCEPTIONS
-------------------------------------

✓ Output ONLY valid JSON - no extra text before or after
✓ vendorlist.length MUST EQUAL scores.length MUST EQUAL vendors.length from input
✓ totalVendors field must match actual count
✓ Never return 3 vendors if only 1 or 2 exist in the data
✓ All vendor names and IDs must come from the input payload
✓ All scores must be calculated based on actual quotation data
✓ Flag budget violations clearly
✓ Compare delivery dates accurately using the RFP delivery date
✓ Verify line items match between RFP and quotations

-------------------------------------
EXAMPLE SCORING CALCULATION
-------------------------------------

Given:
- RFP Budget: $123,456
- RFP Delivery: 2025-12-20
- Vendor A quotes: $110,000, delivers 2025-12-18
- Vendor B quotes: $115,000, delivers 2025-12-25

Price Score:
- Vendor A: (110,000/110,000) × 40 = 40.0
- Vendor B: (110,000/115,000) × 40 = 38.3

Delivery Score (on-time = 20, 1 day early = +0.5, 1 day late = -2):
- Vendor A: 20 + 1.0 = 21.0 (capped at 20)
- Vendor B: 20 - 10 = 10.0 (late by 5 days)

Continue similarly for other criteria.

-------------------------------------
INPUT DATA
-------------------------------------

RFP Payload:
${JSON.stringify(rfp, null, 2)}

EXECUTE ANALYSIS NOW - Return only the JSON response described above.`;


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

export default analysisGneratorFronQuotation;
