import mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler.service.js";
import { ApiError } from "../services/api.error.js";
import { quoteValidator } from "../services/validations/quote.validation.js";
import Quotation from "../model/quotation.model.js";
import { ApiResponse } from "../services/response.js";
import { captureReplies } from "../services/emailExtractor.js";
import {
  processEmailReplyToQuotation,
  batchProcessReplies,
} from "../services/LLM/emailData.js";
import RfpModel from "../model/rfp.model.js";

const createQuote = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data) {
    throw new ApiError(404, "Data is not present");
  }

  const quote = quoteValidator.parse(data);

  try {
    const newQ = await Quotation.create(quote);
    console.log(newQ);
  } catch (error) {
    console.log("error occured at the time of creation of the error", error);
    throw new ApiError(404, "quote did not get created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, quote, "quote saved sucessfully!!!!"));
});

const updateQuote = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  const valid = await quoteValidator.parse(data);

  if (!valid) {
    throw new ApiError(404, "Fields are not field correctly");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid id provided");
    throw new ApiError(400, "Invalid vendor ID format");
  }

  const quote = await Quotation.findById(id);

  if (!quote) {
    throw new ApiError(404, "Requested quote not found");
  }

  const newQuote = await Quotation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newQuote, "quote updated sucessfully!!!!"));
});

const deleteQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid id provided");
    throw new ApiError(400, "Invalid vendor ID format");
  }

  const deletedQuote = await Quotation.findByIdAndDelete(id);

  if (!deletedQuote) {
    throw new ApiError(404, "Quotation not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedQuote._id, "Quotation deleted successfully")
    );
});

const getByIdQuote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid id provided");
    throw new ApiError(400, "Invalid vendor ID format");
  }

  const quote = await Quotation.findById(id);

  if (!quote) {
    throw new ApiError(404, "Requested quote not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, quote, "quote retrieved sucessfully!!!!"));
});


//below path are used by the ai routes and not by qutation 
const processEmailRepliesController = async (req, res) => {
  try {
    console.log("Starting email reply capture...");

    const replies = await captureReplies();

    if (!replies || replies.length === 0) {
      return res.status(200).json({
        ok: true,
        message: "No new email replies found",
        quotationsCreated: 0,
        quotations: [],
      });
    }

    console.log(`Found ${replies.length} email replies`);

    const { quotations, errors, successCount, errorCount } =
      await batchProcessReplies(replies);

    const savedQuotations = [];
    const saveErrors = [];

    for (const quotationData of quotations) {
      try {
        const { rfpId, vendorId, quotation } = quotationData;

        const existingQuotation = await Quotation.findOne({
          rfp: rfpId,
          vendor: vendorId,
        });

        console.log("thie is the quotation", quotation);

        let savedQuotation;
        if (existingQuotation) {
          

          savedQuotation = await Quotation.findByIdAndUpdate(
            existingQuotation._id,
            quotation,
            { new: true, runValidators: true }
          );
          console.log(`Updated existing quotation for vendor ${vendorId}`);
        } else {
          
          savedQuotation = await Quotation.create(quotation);
          const rfpData = await RfpModel.findById(rfpId);
          const vendors = rfpData.vendors;

          console.log("these are the vendors in the rfp ", vendors);

          vendors.map((v) => {
            console.log("this is the vendor-----------", v.vendor);
            console.log(typeof v.vendor);
            console.log("this is the vendor IDDDDDDDDDDDDD-----", vendorId);
            console.log(
              "to check if the quotation is updating or not",
              savedQuotation._id
            );
            console.log(typeof vendorId);
            if (v.vendor.toString() === vendorId.toString()) {
              console.log("to check if the quotation is updating or not");
              v.quotation = savedQuotation._id;
            }
          });

          console.log(
            "to check it the vendor has been updated or not",
            vendors
          );

          await RfpModel.findByIdAndUpdate(
            rfpData._id,
            { vendors },
            { new: true }
          );

          ///oyroyoeoyoeyoeoy yad rakhna isko delete marna hai

          console.log(`Created new quotation for vendor ${vendorId}`);
        }

        savedQuotations.push({
          quotationId: savedQuotation._id,
          rfpId,
          vendorId,
          amount: savedQuotation.amount,
          status: quotation.status,
        });
      } catch (saveError) {
        console.error(
          `Error saving quotation for vendor ${quotationData.vendorId}:`,
          saveError
        );
        saveErrors.push({
          rfpId: quotationData.rfpId,
          vendorId: quotationData.vendorId,
          error: saveError.message,
        });
      }
    }

    return res.status(200).json({
      ok: true,
      message: `Processed ${replies.length} email replies`,
      quotationsCreated: savedQuotations.length,
      quotations: savedQuotations,
      extractionErrors: errors,
      saveErrors: saveErrors,
      summary: {
        totalReplies: replies.length,
        successfulExtractions: successCount,
        failedExtractions: errorCount,
        savedToDatabase: savedQuotations.length,
        failedToSave: saveErrors.length,
      },
    });
  } catch (error) {
    console.error("Error in processEmailRepliesController:", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to process email replies",
      error: error.message,
    });
  }
};

//Routes were created for the testing purpose for the mail responses

const processSingleReplyController = async (req, res) => {
  try {
    const { rfpId, vendorId, emailText } = req.body;

    if (!rfpId || !vendorId || !emailText) {
      return res.status(400).json({
        ok: false,
        message: "rfpId, vendorId, and emailText are required",
      });
    }

    const reply = {
      rfpId,
      vendorId,
      email: {
        text: emailText,
        html: emailText,
      },
    };

    const quotationData = await processEmailReplyToQuotation(reply);

    const savedQuotation = await Quotation.create(quotationData.quotation);

    return res.status(200).json({
      ok: true,
      message: "Quotation extracted and saved successfully",
      quotation: {
        quotationId: savedQuotation._id,
        rfpId: quotationData.rfpId,
        vendorId: quotationData.vendorId,
        amount: savedQuotation.amount,
        lineItems: savedQuotation.quotevalue,
        status: quotationData.quotation.status,
      },
    });
  } catch (error) {
    console.error("Error in processSingleReplyController:", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to process email reply",
      error: error.message,
    });
  }
};

const getQuotationsByRfpController = async (req, res) => {
  try {
    const { rfpId } = req.params;

    const quotations = await Quotation.find()
      .populate("vendor", "name email contactPerson")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      rfpId,
      quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch quotations",
      error: error.message,
    });
  }
};

export {
  createQuote,
  updateQuote,
  deleteQuote,
  getByIdQuote,
  processEmailRepliesController,
  processSingleReplyController,
  getQuotationsByRfpController,
};
