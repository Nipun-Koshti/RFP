import analysisGneratorFronQuotation from "../services/LLM/analysisLlm.js";
import generateRfpFromTextGroq from "../services/LLM/createRfp.js"
import asyncHandeler from "../services/asyncHandler.service.js"
import { ApiResponse } from "../services/response.js";

const createRfpControllerGroq = async (req, res) => {

    const text = Object.keys(req.body)[0];
console.log("Extracted text:", text);


  if (!text || !text.trim()) {
    return res.status(400).json({
      ok: false,
      message: "Text input is required to generate RFP."
    });
  }

  const jsonString = await generateRfpFromTextGroq(text);

  let rfp;
  try {
    rfp = JSON.parse(jsonString);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Groq response was not valid JSON.",
      rawResponse: jsonString
    });
  }

  return res.status(200).json({
    ok: true,
    rfp
  });
};

const qutationAnalysisController = asyncHandeler(async(req,res)=>{
  const quotations = req.body


  const data = await analysisGneratorFronQuotation(quotations)

  console.log("data-------------------------------------------analysis--------------------------",JSON.parse(data))

  res.status(200).json(new ApiResponse(200,data,"Analysis retrieved sucessfully"))
})

export {createRfpControllerGroq, qutationAnalysisController}